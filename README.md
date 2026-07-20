# Lesson Assistant

An open-source, browser-native prototype that creates inquiry-based lesson direction from a grade, subject, topic, power skill, academic standard, and lesson duration.

## Current status

Sprint 0 baseline: the supplied concept has been repaired and separated into maintainable HTML, CSS, data, generation, and interface modules. Generated content is deterministic and does not require an AI service.

## Run locally

Requirements: Python 3 for the local server and Node.js 20 or newer for automated tests.

```sh
npm run dev
```

Open `http://localhost:4173`.

## Verify

```sh
npm run check
npm test
```

## Project principles

- Teachers review and edit instructional decisions.
- Verified standards data remains separate from generation logic.
- Core functionality does not depend on paid APIs or hosted AI.
- Accessibility and safe text rendering are treated as baseline requirements.

See [LESSON_PLANNER_AGILE_CODE_PLAN.md](LESSON_PLANNER_AGILE_CODE_PLAN.md) for the complete sprint roadmap.
