export const initialLessonInput = Object.freeze({
  grade: "Grade 8",
  subject: "U.S. History",
  topic: "Boston Tea Party",
  skill: "Cause and Effect",
  standard: "CA HSS 8.1",
  duration: 60
});

export function createAppState(seed = initialLessonInput) {
  let current = { input: { ...seed }, lesson: null, status: "initial", dirty: false, activeDraftId: null };
  return {
    get() {
      return structuredClone(current);
    },
    updateInput(patch) {
      current = { ...current, input: { ...current.input, ...patch }, status: "editing", dirty: Boolean(current.lesson) };
      return this.get();
    },
    setLesson(lesson, options = {}) {
      current = {
        ...current,
        input: { ...current.input, ...lesson },
        lesson: structuredClone(lesson),
        status: options.dirty ? "edited" : "generated",
        dirty: Boolean(options.dirty),
        activeDraftId: options.activeDraftId ?? current.activeDraftId
      };
      return this.get();
    },
    editLesson(lesson) {
      current = { ...current, lesson: structuredClone(lesson), status: "edited", dirty: true };
      return this.get();
    },
    markSaved(activeDraftId) {
      current = { ...current, status: "saved", dirty: false, activeDraftId };
      return this.get();
    },
    clearActiveDraft() {
      current = { ...current, activeDraftId: null };
      return this.get();
    }
  };
}
