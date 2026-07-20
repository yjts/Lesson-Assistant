import { generateLesson } from "./generator.js";
import { getStandards, grades, subjects, powerSkills } from "./standards.js";
import { validateLessonInput } from "./validation.js";

const form = document.querySelector("#lesson-form");
const fields = Object.fromEntries(["grade", "subject", "topic", "skill", "standard", "duration"].map((id) => [id, document.querySelector(`#${id}`)]));

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

addOptions(fields.grade, grades, "Grade 8");
addOptions(fields.subject, subjects, "U.S. History");
addOptions(fields.skill, powerSkills, "Cause and Effect");
updateStandards();
fields.grade.addEventListener("change", updateStandards);
fields.subject.addEventListener("change", updateStandards);
form.addEventListener("submit", generateFromForm);
generateFromForm();
