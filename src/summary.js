import { generateLesson } from "./generator.js?v=0.3.0";
import { validateLessonInput } from "./validation.js?v=0.3.0";

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
  document.querySelector("#print-stages").replaceChildren(...lesson.stages.map(stageCard));
}

const validation = validateLessonInput(input);
if (!validation.valid || !input.grade || !input.subject || !input.skill || !Number.isFinite(input.duration)) {
  document.querySelector("#summary-content").hidden = true;
  document.querySelector("#summary-error").hidden = false;
  document.querySelector("#print-button").disabled = true;
} else {
  renderSummary(generateLesson(input));
  document.querySelector("#printable-summary").focus();
}

document.querySelector("#print-button").addEventListener("click", () => window.print());
