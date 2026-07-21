import { getSubjects, hasStandard } from "./standards.js?v=0.9.0";

export function validateLessonInput(input) {
  const topic = input.topic.trim();
  if (!topic) return { valid: false, field: "topic", message: "Enter a topic before generating lesson direction." };
  if (topic.length < 3) return { valid: false, field: "topic", message: "Use at least three characters for the lesson topic." };
  if (!getSubjects(input.grade).includes(input.subject)) return { valid: false, field: "subject", message: "Choose a subject supported for the selected grade." };
  if (!input.standard) return { valid: false, field: "standard", message: "Choose an academic standard before generating." };
  if (!hasStandard(input.grade, input.subject, input.standard)) return { valid: false, field: "standard", message: "Choose a standard that matches the selected grade and subject." };
  if (![45, 60, 75, 90].includes(input.duration)) return { valid: false, field: "duration", message: "Choose one of the supported lesson lengths." };
  return { valid: true };
}
