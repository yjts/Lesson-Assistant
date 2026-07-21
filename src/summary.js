import { generateLesson } from "./generator.js?v=0.7.0";
import { validateLessonInput } from "./validation.js?v=0.11.0";

const SUMMARY_STORAGE_KEY = "lesson-assistant:print-summary:v1";

const params = new URLSearchParams(window.location.search);
const input = {
  grade: params.get("grade") || "",
  subject: params.get("subject") || "",
  topic: params.get("topic") || "",
  skill: params.get("skill") || "",
  standard: params.get("standard") || "",
  duration: Number(params.get("duration"))
};

function metadataItem(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);
  return wrapper;
}

function stageCard(stage) {
  const card = document.createElement("section");
  card.className = "print-stage";
  const headingRow = document.createElement("div");
  headingRow.className = "print-stage-heading";
  const title = document.createElement("h3");
  title.textContent = stage[0];
  const timing = document.createElement("span");
  timing.textContent = `${stage[4]} min`;
  headingRow.append(title, timing);
  const content = document.createElement("div");
  [["Teacher", stage[1]], ["Student", stage[2]], ["Example", stage[3]]].forEach(([label, value]) => {
    const block = document.createElement("div");
    const heading = document.createElement("h4");
    const text = document.createElement("p");
    heading.textContent = label;
    text.textContent = value;
    block.append(heading, text);
    content.append(block);
  });
  card.append(headingRow, content);
  return card;
}

function renderSummary(lesson) {
  document.title = `${lesson.topic} — Lesson Direction Summary`;
  document.querySelector("#summary-title").textContent = `${lesson.topic} Lesson Direction`;
  document.querySelector("#print-metadata").replaceChildren(
    metadataItem("Grade", lesson.grade), metadataItem("Subject", lesson.subject),
    metadataItem("Power skill", lesson.skill), metadataItem("Standard", lesson.standard),
    metadataItem("Duration", `${lesson.duration} minutes`)
  );
  document.querySelector("#print-inquiry-question").textContent = lesson.inquiryQuestion;
  document.querySelector("#print-objective").textContent = lesson.objective;
  document.querySelector("#print-success-criteria").replaceChildren(...lesson.successCriteria.map((criterion) => {
    const item = document.createElement("li");
    item.textContent = criterion;
    return item;
  }));
  document.querySelector("#print-stages").replaceChildren(...lesson.stages.map(stageCard));
  document.querySelector("#print-teacher-notes").textContent = lesson.teacherNotes || "No additional teacher notes.";
  document.querySelector("#print-source-reminder").textContent = lesson.sourceReminder || "Review all sources, supports, and instructional decisions before use.";
  const requiredText = [lesson.inquiryQuestion, lesson.objective, ...lesson.successCriteria, ...lesson.stages.flatMap((stage) => stage.slice(1, 4))];
  document.querySelector("#print-warning").hidden = requiredText.every((value) => String(value || "").trim());
}

function readStoredLesson() {
  try {
    const lesson = JSON.parse(sessionStorage.getItem(SUMMARY_STORAGE_KEY));
    return lesson?.topic && Array.isArray(lesson.stages) ? lesson : null;
  } catch {
    return null;
  }
}

function lessonAsText(lesson) {
  const lines = [
    `${lesson.topic} Lesson Direction`,
    `${lesson.grade} | ${lesson.subject} | ${lesson.skill} | ${lesson.standard} | ${lesson.duration} minutes`,
    "", `Inquiry question: ${lesson.inquiryQuestion}`, `Learning objective: ${lesson.objective}`,
    "Success criteria:", ...lesson.successCriteria.map((criterion) => `- ${criterion}`), ""
  ];
  lesson.stages.forEach((stage) => lines.push(stage[0], `Time: ${stage[4]} minutes`, `Teacher: ${stage[1]}`, `Student: ${stage[2]}`, `Example: ${stage[3]}`, ""));
  lines.push("Teacher notes:", lesson.teacherNotes || "None", "", "Source and accessibility reminder:", lesson.sourceReminder || "Review before classroom use.");
  return lines.join("\n");
}

const validation = validateLessonInput(input);
const storedLesson = readStoredLesson();
const lesson = storedLesson || (validation.valid ? generateLesson(input) : null);
if (!lesson) {
  document.querySelector("#summary-content").hidden = true;
  document.querySelector("#summary-error").hidden = false;
  document.querySelector("#print-button").disabled = true;
} else {
  renderSummary(lesson);
  document.querySelector("#printable-summary").focus();
}

document.querySelector("#print-button").addEventListener("click", () => window.print());
document.querySelector("#copy-button").addEventListener("click", async () => {
  if (!lesson) return;
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(lessonAsText(lesson));
    status.textContent = "Lesson text copied.";
  } catch {
    status.textContent = "Copy was blocked. Select the lesson text and copy it manually.";
  }
});
