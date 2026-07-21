import test from "node:test";
import assert from "node:assert/strict";
import { createAppState, initialLessonInput } from "../src/state.js";

test("state begins with an isolated copy of default input", () => {
  const state = createAppState();
  const snapshot = state.get();
  snapshot.input.topic = "Changed outside state";
  assert.equal(state.get().input.topic, initialLessonInput.topic);
  assert.equal(state.get().status, "initial");
});

test("state tracks editing and generated transitions", () => {
  const state = createAppState();
  state.updateInput({ topic: "Constitutional Convention" });
  assert.equal(state.get().status, "editing");
  state.setLesson({ ...state.get().input, inquiryQuestion: "Why?", stages: [] });
  assert.equal(state.get().status, "generated");
  assert.equal(state.get().lesson.topic, "Constitutional Convention");
  state.editLesson({ ...state.get().lesson, inquiryQuestion: "Teacher revision?" });
  assert.equal(state.get().dirty, true);
  assert.equal(state.get().status, "edited");
  state.markSaved("draft-1");
  assert.equal(state.get().dirty, false);
  assert.equal(state.get().activeDraftId, "draft-1");
});
