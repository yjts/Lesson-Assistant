const questionTemplates = {
  "Cause and Effect": (topic) => `What caused ${topic}, and what changed because of it?`,
  "Change Over Time": (topic) => `How did ${topic} develop or change over time?`,
  "Historical Perspective": (topic) => `How might different groups have viewed ${topic}?`,
  "Source Analysis": (topic) => `What can available sources reveal—and not reveal—about ${topic}?`,
  "Evidence-Based Claims": (topic) => `What claim can we make about ${topic}, and what evidence supports it?`,
  "Citizenship": (topic) => `What does ${topic} teach us about citizenship?`,
  "Civic Participation": (topic) => `How did people participate in public life during ${topic}?`,
  "Rights and Responsibilities": (topic) => `What rights and responsibilities are connected to ${topic}?`,
  "Discussion and Debate": (topic) => `What is the strongest argument for and against the main issue in ${topic}?`,
  "Argumentation": (topic) => `Which interpretation of ${topic} is best supported by evidence?`,
  "Chronological Thinking": (topic) => `Which sequence of events is essential to understanding ${topic}?`
};

const timingTemplates = Object.freeze({
  45: [5, 7, 11, 8, 8, 6],
  60: [6, 9, 16, 10, 11, 8],
  75: [8, 11, 20, 13, 13, 10],
  90: [10, 14, 24, 15, 16, 11]
});

export function getStageTimings(duration) {
  const timings = timingTemplates[duration];
  if (!timings) throw new RangeError(`Unsupported lesson duration: ${duration}`);
  return [...timings];
}

export function buildInquiryQuestion(topic, skill) {
  return (questionTemplates[skill] || ((value) => `What is the most important idea to understand about ${value}?`))(topic);
}

export function generateLesson(input) {
  const topic = input.topic.trim();
  const inquiryQuestion = buildInquiryQuestion(topic, input.skill);
  const timings = getStageTimings(input.duration);
  return {
    ...input,
    topic,
    inquiryQuestion,
    templateVersion: "0.3.0",
    stages: [
      ["1. Inquiry opener", "Show an image, quotation, or opening question.", "Think independently and give an initial response.", inquiryQuestion],
      ["2. Short instruction", `Give the essential background for ${topic}.`, "Listen and identify the central issue.", `Provide only the context students need to begin investigating ${topic}.`],
      ["3. Investigation", "Provide a short source, image, chart, map, or quotation.", "Look for evidence and differing viewpoints.", `Identify information that helps explain ${topic}.`],
      ["4. Evidence-based thinking", "Ask for a clear claim supported by evidence.", "Explain an answer using information from the source.", `Make a claim about ${topic} using ${input.skill.toLowerCase()}.`],
      ["5. Application", "Present a realistic decision or related problem.", "Make a choice and explain the reasoning.", `Apply learning about ${topic} to a new situation.`],
      ["6. Mastery check", "Check for an independent explanation of the key idea.", "Explain the learning without teacher help.", `Demonstrate mastery of ${topic} through ${input.skill.toLowerCase()}.`]
    ].map((stage, index) => [...stage, timings[index]])
  };
}
