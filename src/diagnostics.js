export const DIAGNOSTICS_STORAGE_KEY = "lesson-assistant:diagnostics:v1";
export const DIAGNOSTICS_LIMIT = 20;

const allowedCodes = new Set([
  "app-error",
  "draft-delete-failed",
  "draft-load-failed",
  "draft-save-failed",
  "drafts-unavailable",
  "backup-export-failed",
  "backup-import-failed",
  "summary-handoff-failed"
]);

export function recordDiagnostic(storage, code, options = {}) {
  if (!allowedCodes.has(code)) return false;
  try {
    const current = JSON.parse(storage.getItem(DIAGNOSTICS_STORAGE_KEY) || "[]");
    const entries = Array.isArray(current) ? current : [];
    entries.push({
      code,
      occurredAt: options.now || new Date().toISOString(),
      appVersion: options.appVersion || "0.8.0"
    });
    storage.setItem(DIAGNOSTICS_STORAGE_KEY, JSON.stringify(entries.slice(-DIAGNOSTICS_LIMIT)));
    return true;
  } catch {
    return false;
  }
}

export function readDiagnostics(storage) {
  try {
    const entries = JSON.parse(storage.getItem(DIAGNOSTICS_STORAGE_KEY) || "[]");
    return Array.isArray(entries) ? structuredClone(entries) : [];
  } catch {
    return [];
  }
}

export function clearDiagnostics(storage) {
  storage.removeItem(DIAGNOSTICS_STORAGE_KEY);
}
