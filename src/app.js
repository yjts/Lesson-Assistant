import { generateLesson } from "./generator.js?v=0.5.0";
import { createAppState, initialLessonInput } from "./state.js?v=0.5.0";
import { getStandards, getSubjects, grades, powerSkills, standardsCatalogMeta } from "./standards.js?v=0.5.0";
import { validateLessonInput } from "./validation.js?v=0.5.0";
import { deleteDraft, duplicateDraft, getDraft, listDrafts, renameDraft, saveDraft } from "./storage.js?v=0.6.0";

const form = document.querySelector("#lesson-form");
const fields = Object.fromEntries(["grade", "subject", "topic", "skill", "standard", "duration"].map((id) => [id, document.querySelector(`#${id}`)]));
const appState = createAppState();
const draftControls = {
  select: document.querySelector("#draft-select"),
  save: document.querySelector("#save-draft"),
  load: document.querySelector("#load-draft"),
  rename: document.querySelector("#rename-draft"),
  duplicate: document.querySelector("#duplicate-draft"),
  delete: document.querySelector("#delete-draft"),
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

function render(lesson) {
  appState.setLesson(lesson);
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
      row.append(cell);
    });
    return row;
  }));
  document.querySelector("#result-status").textContent = `Generated ${lesson.topic}. Ready to review.`;
  const parameters = new URLSearchParams({
    grade: lesson.grade,
    subject: lesson.subject,
    topic: lesson.topic,
    skill: lesson.skill,
    standard: lesson.standard,
    duration: String(lesson.duration)
  });
  document.querySelector("#summary-link").href = `summary.html?${parameters}`;
  document.body.dataset.appState = appState.get().status;
}

function generateFromForm(event) {
  event?.preventDefault();
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
  render(generateLesson(input));
  if (event) document.querySelector("#lesson-result").focus();
}

function setDraftStatus(message, isError = false) {
  draftControls.status.textContent = message;
  draftControls.status.classList.toggle("is-error", isError);
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
  }
}

function restoreLessonInput(lesson) {
  fields.grade.value = lesson.grade;
  updateSubjects();
  fields.subject.value = lesson.subject;
  updateStandards();
  fields.topic.value = lesson.topic;
  fields.skill.value = lesson.skill;
  fields.standard.value = lesson.standard;
  fields.duration.value = String(lesson.duration);
  generateFromForm();
}

draftControls.select.addEventListener("change", () => {
  const hasSelection = Boolean(draftControls.select.value);
  draftControls.load.disabled = !hasSelection;
  draftControls.rename.disabled = !hasSelection;
  draftControls.duplicate.disabled = !hasSelection;
  draftControls.delete.disabled = !hasSelection;
});

draftControls.save.addEventListener("click", () => {
  const lesson = appState.get().lesson;
  if (!lesson) return setDraftStatus("Generate a valid lesson before saving a draft.", true);
  try {
    const draft = saveDraft(localStorage, lesson);
    refreshDraftList(draft.id);
    setDraftStatus(`Saved “${draft.name}” on this device.`);
  } catch (error) {
    setDraftStatus(error.message, true);
  }
});

draftControls.load.addEventListener("click", () => {
  try {
    const draft = getDraft(localStorage, draftControls.select.value);
    if (!draft) return setDraftStatus("The selected draft could not be found.", true);
    restoreLessonInput(draft.lesson);
    setDraftStatus(`Loaded “${draft.name}”.`);
    document.querySelector("#lesson-result").focus();
  } catch (error) {
    setDraftStatus(error.message, true);
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
  }
});

draftControls.duplicate.addEventListener("click", () => {
  try {
    const duplicate = duplicateDraft(localStorage, draftControls.select.value);
    refreshDraftList(duplicate.id);
    setDraftStatus(`Created “${duplicate.name}”.`);
  } catch (error) {
    setDraftStatus(error.message, true);
  }
});

draftControls.delete.addEventListener("click", () => {
  const selectedId = draftControls.select.value;
  const selectedLabel = draftControls.select.selectedOptions[0]?.textContent || "this draft";
  if (!selectedId || !window.confirm(`Delete ${selectedLabel}? This cannot be undone.`)) return;
  try {
    deleteDraft(localStorage, selectedId);
    refreshDraftList();
    setDraftStatus("Draft deleted from this device.");
  } catch (error) {
    setDraftStatus(error.message, true);
  }
});

addOptions(fields.grade, grades, initialLessonInput.grade);
addOptions(fields.subject, getSubjects(initialLessonInput.grade), initialLessonInput.subject);
addOptions(fields.skill, powerSkills, initialLessonInput.skill);
updateStandards();
document.querySelector("#standards-source").textContent = `${standardsCatalogMeta.framework} · educator verification pending`;
fields.grade.addEventListener("change", () => { updateSubjects(); syncInputState(); });
fields.subject.addEventListener("change", () => { updateStandards(); syncInputState(); });
Object.values(fields).forEach((field) => field.addEventListener("input", syncInputState));
form.addEventListener("submit", generateFromForm);
generateFromForm();
refreshDraftList();
