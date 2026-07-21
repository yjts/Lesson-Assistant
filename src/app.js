import { generateLesson } from "./generator.js?v=0.7.0";
import { createAppState, initialLessonInput } from "./state.js?v=0.11.0";
import { getStandards, getSubjects, grades, powerSkills, standardsCatalogMeta } from "./standards.js?v=0.9.0";
import { validateLessonInput } from "./validation.js?v=0.9.0";
import { clearDiagnostics, readDiagnostics, recordDiagnostic } from "./diagnostics.js?v=0.10.0";
import { deleteDraft, duplicateDraft, exportDraftBackup, getDraft, importDraftBackup, listDrafts, renameDraft, saveDraft } from "./storage.js?v=0.8.0";

const SUMMARY_STORAGE_KEY = "lesson-assistant:print-summary:v1";
const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

const form = document.querySelector("#lesson-form");
const fields = Object.fromEntries(["grade", "subject", "topic", "skill", "standard", "duration"].map((id) => [id, document.querySelector(`#${id}`)]));
const appState = createAppState();
const draftControls = {
  select: document.querySelector("#draft-select"),
  save: document.querySelector("#save-draft"),
  saveAs: document.querySelector("#save-as-draft"),
  load: document.querySelector("#load-draft"),
  rename: document.querySelector("#rename-draft"),
  duplicate: document.querySelector("#duplicate-draft"),
  delete: document.querySelector("#delete-draft"),
  backup: document.querySelector("#backup-drafts"),
  restore: document.querySelector("#restore-drafts"),
  restoreFile: document.querySelector("#restore-file"),
  status: document.querySelector("#draft-status")
};

function addOptions(select, items, selected) {
  select.replaceChildren(...items.map((item) => {
    const option = document.createElement("option");
    const [value, label = value] = Array.isArray(item) ? item : [item];
    option.value = value;
    option.textContent = Array.isArray(item) ? `${value}: ${label}` : label;
    option.selected = value === selected;
    return option;
  }));
}

function updateStandards() {
  const previous = fields.standard.value;
  const options = getStandards(fields.grade.value, fields.subject.value);
  addOptions(fields.standard, options, options.some(([code]) => code === previous) ? previous : fields.grade.value === "Grade 8" ? "CA HSS 8.1" : undefined);
}

function updateSubjects() {
  const previous = fields.subject.value;
  const options = getSubjects(fields.grade.value);
  addOptions(fields.subject, options, options.includes(previous) ? previous : options[0]);
  updateStandards();
}

function readInput() {
  return {
    grade: fields.grade.value,
    subject: fields.subject.value,
    topic: fields.topic.value,
    skill: fields.skill.value,
    standard: fields.standard.value,
    duration: Number(fields.duration.value)
  };
}

function syncInputState() {
  const nextState = appState.updateInput(readInput());
  document.body.dataset.appState = nextState.status;
  document.querySelector("#result-status").textContent = "Selections changed. Generate to refresh the lesson.";
}

function summaryItem(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);
  return wrapper;
}

function render(lesson, options = {}) {
  appState.setLesson(lesson, options);
  document.querySelector("#summary").replaceChildren(
    summaryItem("Grade", lesson.grade), summaryItem("Subject", lesson.subject),
    summaryItem("Power skill", lesson.skill), summaryItem("Standard", lesson.standard),
    summaryItem("Duration", `${lesson.duration} minutes`)
  );
  document.querySelector("#inquiry-question").textContent = lesson.inquiryQuestion;
  document.querySelector("#learning-objective").textContent = lesson.objective;
  document.querySelector("#success-criteria").replaceChildren(...lesson.successCriteria.map((criterion) => {
    const item = document.createElement("li");
    item.textContent = criterion;
    item.className = "editable";
    item.contentEditable = "true";
    item.setAttribute("role", "textbox");
    item.setAttribute("aria-label", "Edit success criterion");
    return item;
  }));
  document.querySelector("#example-heading").textContent = `${lesson.topic} example`;
  document.querySelector("#structure-rows").replaceChildren(...lesson.stages.map((stage) => {
    const row = document.createElement("tr");
    const displayValues = [stage[0], `${stage[4]} min`, stage[1], stage[2], stage[3]];
    displayValues.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 0) { const strong = document.createElement("strong"); strong.textContent = value; cell.append(strong); }
      else if (index === 1) cell.className = "time-cell";
      else cell.textContent = value;
      if (index === 1) cell.textContent = value;
      if (index >= 2) {
        cell.className = "editable-cell";
        cell.contentEditable = "true";
        cell.setAttribute("role", "textbox");
        cell.setAttribute("aria-label", `Edit ${["teacher action", "student action", "example"][index - 2]} for ${stage[0]}`);
      }
      row.append(cell);
    });
    return row;
  }));
  document.querySelector("#teacher-notes").value = lesson.teacherNotes || "";
  document.querySelector("#source-reminder").value = lesson.sourceReminder || "";
  document.querySelector("#result-status").textContent = options.dirty ? "Loaded teacher-edited lesson." : `Generated ${lesson.topic}. Ready to review and edit.`;
  const parameters = new URLSearchParams({
    grade: lesson.grade,
    subject: lesson.subject,
    topic: lesson.topic,
    skill: lesson.skill,
    standard: lesson.standard,
    duration: String(lesson.duration)
  });
  try { sessionStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(lesson)); } catch { recordDiagnostic(localStorage, "summary-handoff-failed"); }
  document.querySelector("#summary-link").href = `summary.html?${parameters}`;
  document.body.dataset.appState = appState.get().status;
}

function confirmReplace(message) {
  return !appState.get().dirty || window.confirm(message);
}

function generateFromForm(event, options = {}) {
  event?.preventDefault();
  if (event && !options.skipConfirmation && !confirmReplace("Regenerate this lesson? Your unsaved teacher edits will be replaced.")) return;
  const error = document.querySelector("#form-error");
  const input = readInput();
  const validation = validateLessonInput(input);
  Object.values(fields).forEach((field) => field.removeAttribute("aria-invalid"));
  if (!validation.valid) {
    error.textContent = validation.message;
    error.hidden = false;
    fields[validation.field].setAttribute("aria-invalid", "true");
    fields[validation.field].focus();
    return;
  }
  error.hidden = true;
  appState.clearActiveDraft();
  render(generateLesson(input), { activeDraftId: null });
  if (event) document.querySelector("#lesson-result").focus();
}

function setDraftStatus(message, isError = false) {
  draftControls.status.textContent = message;
  draftControls.status.classList.toggle("is-error", isError);
}

function refreshDiagnostics() {
  const list = document.querySelector("#diagnostics-list");
  const entries = readDiagnostics(localStorage).slice().reverse();
  list.replaceChildren(...(entries.length ? entries.map((entry) => {
    const item = document.createElement("li");
    item.textContent = `${new Date(entry.occurredAt).toLocaleString()} · ${entry.code} · app ${entry.appVersion}`;
    return item;
  }) : [Object.assign(document.createElement("li"), { textContent: "No diagnostic events recorded." })]));
}

function refreshDraftList(selectedId = "") {
  try {
    const drafts = listDrafts(localStorage);
    const options = drafts.map((draft) => {
      const option = document.createElement("option");
      option.value = draft.id;
      option.textContent = `${draft.name} · ${new Date(draft.updatedAt).toLocaleDateString()}`;
      option.selected = draft.id === selectedId;
      return option;
    });
    if (!options.length) {
      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "No saved drafts";
      options.push(empty);
    }
    draftControls.select.replaceChildren(...options);
    const hasSelection = Boolean(draftControls.select.value);
    draftControls.load.disabled = !hasSelection;
    draftControls.rename.disabled = !hasSelection;
    draftControls.duplicate.disabled = !hasSelection;
    draftControls.delete.disabled = !hasSelection;
  } catch (error) {
    draftControls.select.replaceChildren(new Option("Drafts unavailable", ""));
    draftControls.load.disabled = true;
    draftControls.rename.disabled = true;
    draftControls.duplicate.disabled = true;
    draftControls.delete.disabled = true;
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "drafts-unavailable");
  }
}

function restoreLessonInput(lesson, activeDraftId = null) {
  fields.grade.value = lesson.grade;
  updateSubjects();
  fields.subject.value = lesson.subject;
  updateStandards();
  fields.topic.value = lesson.topic;
  fields.skill.value = lesson.skill;
  fields.standard.value = lesson.standard;
  fields.duration.value = String(lesson.duration);
  render(lesson, { activeDraftId, dirty: false });
}

function readEditedLesson() {
  const lesson = appState.get().lesson;
  if (!lesson) return null;
  const rows = [...document.querySelectorAll("#structure-rows tr")];
  return {
    ...lesson,
    inquiryQuestion: document.querySelector("#inquiry-question").textContent.trim(),
    objective: document.querySelector("#learning-objective").textContent.trim(),
    successCriteria: [...document.querySelectorAll("#success-criteria li")].map((item) => item.textContent.trim()),
    stages: rows.map((row, index) => {
      const cells = row.querySelectorAll("td");
      return [lesson.stages[index][0], cells[2].textContent.trim(), cells[3].textContent.trim(), cells[4].textContent.trim(), lesson.stages[index][4]];
    }),
    teacherNotes: document.querySelector("#teacher-notes").value.trim(),
    sourceReminder: document.querySelector("#source-reminder").value.trim()
  };
}

function recordTeacherEdit() {
  const lesson = readEditedLesson();
  if (!lesson) return;
  appState.editLesson(lesson);
  try { sessionStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(lesson)); } catch { recordDiagnostic(localStorage, "summary-handoff-failed"); }
  document.querySelector("#result-status").textContent = "Teacher edits not yet saved.";
}

document.querySelector("#lesson-result").addEventListener("input", (event) => {
  if (event.target.matches("[contenteditable], textarea")) recordTeacherEdit();
});

draftControls.select.addEventListener("change", () => {
  const hasSelection = Boolean(draftControls.select.value);
  draftControls.load.disabled = !hasSelection;
  draftControls.rename.disabled = !hasSelection;
  draftControls.duplicate.disabled = !hasSelection;
  draftControls.delete.disabled = !hasSelection;
});

draftControls.save.addEventListener("click", () => {
  const state = appState.get();
  const lesson = readEditedLesson();
  if (!lesson) return setDraftStatus("Generate a valid lesson before saving a draft.", true);
  try {
    const existing = state.activeDraftId ? getDraft(localStorage, state.activeDraftId) : null;
    const draft = saveDraft(localStorage, lesson, { id: existing?.id, name: existing?.name });
    appState.markSaved(draft.id);
    refreshDraftList(draft.id);
    setDraftStatus(`Saved “${draft.name}” on this device.`);
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-save-failed");
  }
});

draftControls.saveAs.addEventListener("click", () => {
  const lesson = readEditedLesson();
  if (!lesson) return setDraftStatus("Generate a valid lesson before saving a draft.", true);
  const suggested = `${lesson.topic} — ${lesson.grade}`;
  const name = window.prompt("Name this new lesson draft:", suggested);
  if (name === null) return;
  try {
    const draft = saveDraft(localStorage, lesson, { name });
    appState.markSaved(draft.id);
    refreshDraftList(draft.id);
    setDraftStatus(`Saved new draft “${draft.name}”.`);
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-save-failed");
  }
});

draftControls.load.addEventListener("click", () => {
  if (!confirmReplace("Load this draft? Your unsaved teacher edits will be replaced.")) return;
  try {
    const draft = getDraft(localStorage, draftControls.select.value);
    if (!draft) return setDraftStatus("The selected draft could not be found.", true);
    restoreLessonInput(draft.lesson, draft.id);
    setDraftStatus(`Loaded “${draft.name}”.`);
    document.querySelector("#lesson-result").focus();
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-load-failed");
  }
});

draftControls.rename.addEventListener("click", () => {
  try {
    const draft = getDraft(localStorage, draftControls.select.value);
    if (!draft) return setDraftStatus("The selected draft could not be found.", true);
    const nextName = window.prompt("Rename this lesson draft:", draft.name);
    if (nextName === null) return;
    const renamed = renameDraft(localStorage, draft.id, nextName);
    refreshDraftList(renamed.id);
    setDraftStatus(`Renamed draft to “${renamed.name}”.`);
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-save-failed");
  }
});

draftControls.backup.addEventListener("click", () => {
  try {
    const blob = new Blob([exportDraftBackup(localStorage)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lesson-assistant-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDraftStatus("Draft backup downloaded. Store it somewhere you can find later.");
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "backup-export-failed");
  }
});

draftControls.restore.addEventListener("click", () => draftControls.restoreFile.click());
draftControls.restoreFile.addEventListener("change", async () => {
  const file = draftControls.restoreFile.files?.[0];
  if (!file) return;
  try {
    if (file.size > MAX_BACKUP_BYTES) throw new Error("The selected backup is larger than the 5 MB restore limit.");
    const result = importDraftBackup(localStorage, await file.text());
    refreshDraftList();
    setDraftStatus(`Backup restored. ${result.total} draft${result.total === 1 ? "" : "s"} available on this device.`);
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "backup-import-failed");
  } finally {
    draftControls.restoreFile.value = "";
  }
});

document.querySelector("#diagnostics-panel").addEventListener("toggle", (event) => {
  if (event.currentTarget.open) refreshDiagnostics();
});
document.querySelector("#clear-diagnostics").addEventListener("click", () => {
  clearDiagnostics(localStorage);
  refreshDiagnostics();
  document.querySelector("#diagnostics-status").textContent = "Local diagnostics cleared.";
});

draftControls.duplicate.addEventListener("click", () => {
  try {
    const duplicate = duplicateDraft(localStorage, draftControls.select.value);
    refreshDraftList(duplicate.id);
    setDraftStatus(`Created “${duplicate.name}”.`);
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-save-failed");
  }
});

draftControls.delete.addEventListener("click", () => {
  const selectedId = draftControls.select.value;
  const selectedLabel = draftControls.select.selectedOptions[0]?.textContent || "this draft";
  if (!selectedId || !window.confirm(`Delete ${selectedLabel}? This cannot be undone.`)) return;
  try {
    deleteDraft(localStorage, selectedId);
    if (appState.get().activeDraftId === selectedId) appState.clearActiveDraft();
    refreshDraftList();
    setDraftStatus("Draft deleted from this device.");
  } catch (error) {
    setDraftStatus(error.message, true);
    recordDiagnostic(localStorage, "draft-delete-failed");
  }
});

addOptions(fields.grade, grades, initialLessonInput.grade);
addOptions(fields.subject, getSubjects(initialLessonInput.grade), initialLessonInput.subject);
addOptions(fields.skill, powerSkills, initialLessonInput.skill);
updateStandards();
document.querySelector("#standards-source").textContent = `${standardsCatalogMeta.framework} · source checked ${standardsCatalogMeta.sourceCheckedAt} · educator approval pending`;
document.querySelector("#standards-source-link").href = standardsCatalogMeta.contentStandardsSourceUrl;
fields.grade.addEventListener("change", () => { updateSubjects(); syncInputState(); });
fields.subject.addEventListener("change", () => { updateStandards(); syncInputState(); });
Object.values(fields).forEach((field) => field.addEventListener("input", syncInputState));
form.addEventListener("submit", generateFromForm);
document.querySelector("#reset-lesson").addEventListener("click", () => {
  if (!confirmReplace("Reset teacher edits? The generated lesson will be restored and unsaved revisions will be lost.")) return;
  appState.clearActiveDraft();
  render(generateLesson(readInput()), { activeDraftId: null });
  document.querySelector("#lesson-result").focus();
});
generateFromForm();
refreshDraftList();
refreshDiagnostics();

window.addEventListener("beforeunload", (event) => {
  if (!appState.get().dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

window.addEventListener("error", () => recordDiagnostic(localStorage, "app-error"));
window.addEventListener("unhandledrejection", () => recordDiagnostic(localStorage, "app-error"));
