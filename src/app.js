import { generateLesson } from "./generator.js?v=0.2.0";
import { createAppState, initialLessonInput } from "./state.js?v=0.2.0";
import { getStandards, getSubjects, grades, powerSkills, standardsCatalogMeta } from "./standards.js?v=0.2.0";
import { validateLessonInput } from "./validation.js?v=0.2.0";

const form = document.querySelector("#lesson-form");
const fields = Object.fromEntries(["grade", "subject", "topic", "skill", "standard", "duration"].map((id) => [id, document.querySelector(`#${id}`)]));
const appState = createAppState();

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
  document.querySelector("#example-heading").textContent = `${lesson.topic} example`;
  document.querySelector("#structure-rows").replaceChildren(...lesson.stages.map((stage) => {
    const row = document.createElement("tr");
    stage.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 0) { const strong = document.createElement("strong"); strong.textContent = value; cell.append(strong); }
      else cell.textContent = value;
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
