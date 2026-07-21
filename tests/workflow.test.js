import test from "node:test";
import assert from "node:assert/strict";
import { generateLesson } from "../src/generator.js";
import { exportDraftBackup, getDraft, importDraftBackup, saveDraft } from "../src/storage.js";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test("primary pilot workflow preserves teacher edits through save and restore", () => {
  const input = { grade: "Grade 8", subject: "U.S. History", topic: "Boston Tea Party", skill: "Cause and Effect", standard: "CA HSS 8.1", duration: 60 };
  const editedLesson = {
    ...generateLesson(input),
    inquiryQuestion: "How did colonial protest reshape political participation?",
    teacherNotes: "Provide printed sources and vocabulary support."
  };
  const browserA = memoryStorage();
  saveDraft(browserA, editedLesson, { id: "pilot-draft", now: "2026-07-21T10:00:00.000Z" });
  const browserB = memoryStorage();
  importDraftBackup(browserB, exportDraftBackup(browserA));
  const restored = getDraft(browserB, "pilot-draft").lesson;
  assert.equal(restored.inquiryQuestion, editedLesson.inquiryQuestion);
  assert.equal(restored.teacherNotes, editedLesson.teacherNotes);
  assert.equal(restored.stages.length, 6);
  assert.equal(restored.stages.reduce((minutes, stage) => minutes + stage[4], 0), 60);
});
