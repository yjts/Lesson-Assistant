import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("provides a keyboard skip link and labeled form controls", () => {
  assert.match(html, /class="skip-link" href="#lesson-form"/);
  for (const id of ["grade", "subject", "topic", "skill", "standard", "duration"]) {
    assert.match(html, new RegExp(`<label for="${id}">`));
  }
});

test("announces errors and generated status", () => {
  assert.match(html, /id="form-error"[^>]*role="alert"/);
  assert.match(html, /id="result-status"[^>]*role="status"[^>]*aria-live="polite"/);
});

test("describes the generated result and table", () => {
  assert.match(html, /id="lesson-result"[^>]*aria-labelledby="result-title"[^>]*tabindex="-1"/);
  assert.match(html, /<caption>[^<]*six-stage inquiry lesson direction/i);
});

test("labels editable teacher planning fields", () => {
  assert.match(html, /id="inquiry-question"[^>]*contenteditable="true"[^>]*aria-label="Edit inquiry question"/);
  assert.match(html, /<label[^>]*for="teacher-notes">Teacher notes<\/label>/);
  assert.match(html, /<label for="source-reminder">Source and accessibility reminder<\/label>/);
  assert.match(html, /id="reset-lesson"[^>]*>Reset teacher edits<\/button>/);
});
