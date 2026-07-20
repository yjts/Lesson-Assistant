export const initialLessonInput = Object.freeze({
  grade: "Grade 8",
  subject: "U.S. History",
  topic: "Boston Tea Party",
  skill: "Cause and Effect",
  standard: "CA HSS 8.1",
  duration: 60
});

export function createAppState(seed = initialLessonInput) {
  let current = { input: { ...seed }, lesson: null, status: "initial" };
  return {
    get() {
      return structuredClone(current);
    },
    updateInput(patch) {
      current = { ...current, input: { ...current.input, ...patch }, status: "editing" };
      return this.get();
    },
    setLesson(lesson) {
      current = { ...current, input: { ...current.input, ...lesson }, lesson: structuredClone(lesson), status: "generated" };
      return this.get();
    }
  };
}

