import test from "node:test";
import assert from "node:assert/strict";
import { buildInquiryQuestion, generateLesson, getStageTimings } from "../src/generator.js";
import { powerSkills } from "../src/standards.js";

test("builds a skill-specific inquiry question", () => {
  assert.equal(buildInquiryQuestion("Boston Tea Party", "Cause and Effect"), "What caused Boston Tea Party, and what changed because of it?");
});

test("generates six ordered instructional stages", () => {
  const lesson = generateLesson({ grade: "Grade 8", subject: "U.S. History", topic: " Boston Tea Party ", skill: "Cause and Effect", standard: "CA HSS 8.1", duration: 60 });
  assert.equal(lesson.topic, "Boston Tea Party");
  assert.equal(lesson.stages.length, 6);
  assert.match(lesson.stages[0][0], /Inquiry opener/);
  assert.match(lesson.stages[5][0], /Mastery check/);
});

test("allocates every supported lesson duration across six stages", () => {
  for (const duration of [45, 60, 75, 90]) {
    const timings = getStageTimings(duration);
    assert.equal(timings.length, 6);
    assert.equal(timings.reduce((total, minutes) => total + minutes, 0), duration);
  }
  assert.throws(() => getStageTimings(30), RangeError);
});

test("every power skill produces a topic-specific question", () => {
  for (const skill of powerSkills) {
    const question = buildInquiryQuestion("Reconstruction", skill);
    assert.match(question, /Reconstruction/);
    assert.ok(question.endsWith("?"));
  }
});
