import test from "node:test";
import assert from "node:assert/strict";
import { validateLessonInput } from "../src/validation.js";

test("requires a meaningful topic", () => {
  assert.equal(validateLessonInput({ topic: " ", standard: "CA HSS 8.1" }).valid, false);
  assert.match(validateLessonInput({ topic: "A", standard: "CA HSS 8.1" }).message, /three characters/);
});

test("accepts a topic and standard", () => {
  assert.deepEqual(validateLessonInput({ topic: "Boston Tea Party", standard: "CA HSS 8.1" }), { valid: true });
});
