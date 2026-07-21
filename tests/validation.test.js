import test from "node:test";
import assert from "node:assert/strict";
import { validateLessonInput } from "../src/validation.js";

test("requires a meaningful topic", () => {
  const base = { grade: "Grade 8", subject: "U.S. History", standard: "CA HSS 8.1", duration: 60 };
  assert.equal(validateLessonInput({ ...base, topic: " " }).valid, false);
  assert.match(validateLessonInput({ ...base, topic: "A" }).message, /three characters/);
  assert.match(validateLessonInput({ ...base, topic: "A".repeat(121) }).message, /120 characters/);
});

test("accepts a topic and standard", () => {
  assert.deepEqual(validateLessonInput({ grade: "Grade 8", subject: "U.S. History", topic: "Boston Tea Party", standard: "CA HSS 8.1", duration: 60 }), { valid: true });
});

test("rejects mismatched curriculum selections and durations", () => {
  const base = { grade: "Grade 8", subject: "U.S. History", topic: "Boston Tea Party", standard: "CA HSS 8.1", duration: 60 };
  assert.equal(validateLessonInput({ ...base, subject: "Economics" }).field, "subject");
  assert.equal(validateLessonInput({ ...base, standard: "CA HSS 10.1" }).field, "standard");
  assert.equal(validateLessonInput({ ...base, duration: 30 }).field, "duration");
});
