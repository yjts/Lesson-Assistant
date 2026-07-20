export const DRAFT_STORAGE_KEY = "lesson-assistant:drafts:v1";

export class DraftStorageError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "DraftStorageError";
  }
}

function emptyStore() {
  return { version: 1, drafts: [] };
}

function parseStore(value) {
  if (!value) return emptyStore();
  try {
    const parsed = JSON.parse(value);
    if (parsed?.version !== 1 || !Array.isArray(parsed.drafts)) throw new Error("Unsupported draft data shape");
    return parsed;
  } catch (error) {
    throw new DraftStorageError("Saved drafts could not be read. The local draft data may be damaged or outdated.", error);
  }
}

export function listDrafts(storage) {
  return parseStore(storage.getItem(DRAFT_STORAGE_KEY)).drafts
    .map((draft) => structuredClone(draft))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveDraft(storage, lesson, options = {}) {
  const now = options.now || new Date().toISOString();
  const id = options.id || globalThis.crypto.randomUUID();
  const store = parseStore(storage.getItem(DRAFT_STORAGE_KEY));
  const draft = {
    id,
    name: options.name?.trim() || `${lesson.topic} — ${lesson.grade}`,
    createdAt: now,
    updatedAt: now,
    lesson: structuredClone(lesson)
  };
  const existingIndex = store.drafts.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    draft.createdAt = store.drafts[existingIndex].createdAt;
    store.drafts[existingIndex] = draft;
  } else {
    store.drafts.push(draft);
  }
  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    throw new DraftStorageError("The draft could not be saved on this device.", error);
  }
  return structuredClone(draft);
}

export function getDraft(storage, id) {
  return listDrafts(storage).find((draft) => draft.id === id) || null;
}

export function deleteDraft(storage, id) {
  const store = parseStore(storage.getItem(DRAFT_STORAGE_KEY));
  const nextDrafts = store.drafts.filter((draft) => draft.id !== id);
  if (nextDrafts.length === store.drafts.length) return false;
  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...store, drafts: nextDrafts }));
  } catch (error) {
    throw new DraftStorageError("The draft could not be deleted from this device.", error);
  }
  return true;
}

export function renameDraft(storage, id, name, now = new Date().toISOString()) {
  const trimmedName = name.trim();
  if (!trimmedName) throw new DraftStorageError("Enter a name for the draft.");
  const existing = getDraft(storage, id);
  if (!existing) throw new DraftStorageError("The selected draft could not be found.");
  return saveDraft(storage, existing.lesson, { id, name: trimmedName, now });
}

export function duplicateDraft(storage, id, options = {}) {
  const existing = getDraft(storage, id);
  if (!existing) throw new DraftStorageError("The selected draft could not be found.");
  return saveDraft(storage, existing.lesson, {
    id: options.id,
    name: options.name || `${existing.name} (copy)`,
    now: options.now
  });
}
