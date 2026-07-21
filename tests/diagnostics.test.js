import test from "node:test";
import assert from "node:assert/strict";
import { DIAGNOSTICS_LIMIT, DIAGNOSTICS_STORAGE_KEY, clearDiagnostics, readDiagnostics, recordDiagnostic } from "../src/diagnostics.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

test("records only approved content-free diagnostic fields", () => {
  const storage = memoryStorage();
  assert.equal(recordDiagnostic(storage, "draft-save-failed", { now: "2026-07-21T10:00:00.000Z", appVersion: "test" }), true);
  assert.equal(recordDiagnostic(storage, "Boston Tea Party"), false);
  assert.deepEqual(readDiagnostics(storage), [{ code: "draft-save-failed", occurredAt: "2026-07-21T10:00:00.000Z", appVersion: "test" }]);
  assert.doesNotMatch(storage.getItem(DIAGNOSTICS_STORAGE_KEY), /topic|lesson|note/i);
});

test("bounds and clears the local diagnostic history", () => {
  const storage = memoryStorage();
  for (let index = 0; index < DIAGNOSTICS_LIMIT + 5; index += 1) {
    recordDiagnostic(storage, "app-error", { now: `2026-07-21T10:00:${String(index).padStart(2, "0")}.000Z` });
  }
  assert.equal(readDiagnostics(storage).length, DIAGNOSTICS_LIMIT);
  clearDiagnostics(storage);
  assert.deepEqual(readDiagnostics(storage), []);
});
