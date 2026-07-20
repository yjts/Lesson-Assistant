import test from "node:test";
import assert from "node:assert/strict";
import { DRAFT_STORAGE_KEY, DraftStorageError, deleteDraft, getDraft, listDrafts, saveDraft } from "../src/storage.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

const lesson = { topic: "Boston Tea Party", grade: "Grade 8", subject: "U.S. History", skill: "Cause and Effect", standard: "CA HSS 8.1", duration: 60, stages: [] };

test("saves, lists, reads, and deletes a local draft", () => {
  const storage = memoryStorage();
  const draft = saveDraft(storage, lesson, { id: "draft-1", now: "2026-07-20T10:00:00.000Z" });
  assert.equal(listDrafts(storage).length, 1);
  assert.equal(getDraft(storage, draft.id).lesson.topic, "Boston Tea Party");
  assert.equal(deleteDraft(storage, draft.id), true);
  assert.equal(listDrafts(storage).length, 0);
});

test("updates a draft while preserving its creation time", () => {
  const storage = memoryStorage();
  saveDraft(storage, lesson, { id: "draft-1", now: "2026-07-20T10:00:00.000Z" });
  const updated = saveDraft(storage, { ...lesson, topic: "Reconstruction" }, { id: "draft-1", now: "2026-07-21T10:00:00.000Z" });
  assert.equal(updated.createdAt, "2026-07-20T10:00:00.000Z");
  assert.equal(updated.updatedAt, "2026-07-21T10:00:00.000Z");
  assert.equal(listDrafts(storage).length, 1);
});

test("reports corrupted local draft data", () => {
  const storage = memoryStorage({ [DRAFT_STORAGE_KEY]: "not-json" });
  assert.throws(() => listDrafts(storage), DraftStorageError);
});

