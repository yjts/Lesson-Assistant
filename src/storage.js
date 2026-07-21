export const DRAFT_STORAGE_KEY = "lesson-assistant:drafts:v1";
export const DRAFT_SCHEMA_VERSION = 2;
export const DRAFT_BACKUP_FORMAT = "lesson-assistant-draft-backup";

export class DraftStorageError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "DraftStorageError";
  }
}

function emptyStore() {
  return { version: DRAFT_SCHEMA_VERSION, drafts: [] };
}

function migrateLesson(lesson) {
  return {
    ...lesson,
    teacherNotes: lesson.teacherNotes || "",
    sourceReminder: lesson.sourceReminder || "Confirm that all classroom sources are accessible, age-appropriate, and accurately represented."
  };
}

function parseStore(value) {
  if (!value) return emptyStore();
  try {
    const parsed = JSON.parse(value);
    if (![1, DRAFT_SCHEMA_VERSION].includes(parsed?.version) || !Array.isArray(parsed.drafts)) throw new Error("Unsupported draft data shape");
    if (parsed.version === 1) {
      return {
        version: DRAFT_SCHEMA_VERSION,
        drafts: parsed.drafts.map((draft) => ({ ...draft, lesson: migrateLesson(draft.lesson), schemaVersion: DRAFT_SCHEMA_VERSION }))
      };
    }
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
    schemaVersion: DRAFT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    lesson: structuredClone(migrateLesson(lesson))
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

export function exportDraftBackup(storage, now = new Date().toISOString()) {
  return JSON.stringify({
    format: DRAFT_BACKUP_FORMAT,
    version: DRAFT_SCHEMA_VERSION,
    exportedAt: now,
    drafts: listDrafts(storage)
  }, null, 2);
}

export function importDraftBackup(storage, value) {
  let backup;
  try {
    backup = JSON.parse(value);
  } catch (error) {
    throw new DraftStorageError("The selected backup is not valid JSON.", error);
  }
  if (backup?.format !== DRAFT_BACKUP_FORMAT || ![1, DRAFT_SCHEMA_VERSION].includes(backup.version) || !Array.isArray(backup.drafts)) {
    throw new DraftStorageError("The selected file is not a supported Lesson Assistant backup.");
  }
  const store = parseStore(storage.getItem(DRAFT_STORAGE_KEY));
  const byId = new Map(store.drafts.map((draft) => [draft.id, draft]));
  backup.drafts.forEach((draft) => {
    if (!draft?.id || !draft?.lesson || !draft?.createdAt || !draft?.updatedAt) return;
    const migrated = { ...draft, schemaVersion: DRAFT_SCHEMA_VERSION, lesson: migrateLesson(draft.lesson) };
    const existing = byId.get(draft.id);
    if (!existing || migrated.updatedAt > existing.updatedAt) byId.set(draft.id, migrated);
  });
  const merged = { version: DRAFT_SCHEMA_VERSION, drafts: [...byId.values()] };
  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    throw new DraftStorageError("The backup could not be restored on this device.", error);
  }
  return { imported: merged.drafts.length - store.drafts.length, total: merged.drafts.length };
}
