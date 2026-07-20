export function validateLessonInput(input) {
  const topic = input.topic.trim();
  if (!topic) return { valid: false, field: "topic", message: "Enter a topic before generating lesson direction." };
  if (topic.length < 3) return { valid: false, field: "topic", message: "Use at least three characters for the lesson topic." };
  if (!input.standard) return { valid: false, field: "standard", message: "Choose an academic standard before generating." };
  return { valid: true };
}

