# Lesson Assistant

An open-source, browser-native prototype that creates inquiry-based lesson direction from a grade, subject, topic, power skill, academic standard, and lesson duration.

## Current status

Sprint 2 is in progress: the supplied concept has been repaired and separated into maintainable HTML, CSS, state, curriculum data, generation, validation, and interface modules. The interface includes responsive behavior, keyboard navigation support, accessible validation, result announcements, and a described lesson table. Teachers can open a dedicated summary from their completed selections and print it or save it as a PDF. Application state now distinguishes edited selections from generated output, and the unverified standards catalog is visibly labeled. Generated content is deterministic and does not require an AI service.

## Printable summary

After generating lesson direction, select **Open printable summary**. The summary carries forward the grade, subject, topic, power skill, standard, duration, inquiry question, and all six instructional stages. Select **Print / Save as PDF**, then choose the browser's PDF destination.

The selections are encoded in the summary page URL for this prototype. Do not include student information or other sensitive data in lesson topics.

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

Material setup and development problems are recorded in [docs/development-log.md](docs/development-log.md).
