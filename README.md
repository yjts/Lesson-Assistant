# Lesson Assistant

An open-source, browser-native prototype that creates inquiry-based lesson direction from a grade, subject, topic, power skill, academic standard, and lesson duration.

## Current status

Sprint 2 is in progress: the supplied concept has been repaired and separated into maintainable HTML, CSS, state, curriculum data, generation, validation, and interface modules. The interface includes responsive behavior, keyboard navigation support, accessible validation, result announcements, and a described lesson table. Teachers can open a dedicated summary from their completed selections and print it or save it as a PDF. Application state now distinguishes edited selections from generated output, and the unverified standards catalog is visibly labeled. Generated content is deterministic and does not require an AI service.

Grade selections now narrow the available subjects and standards using a documented provisional mapping. Mismatched grade, subject, standard, and duration combinations are rejected before generation. These mappings remain pending educator verification.

Sprint 3 has started with deterministic duration-aware planning. Each 45-, 60-, 75-, or 90-minute lesson now divides the available time across the inquiry opener, short instruction, investigation, evidence-based thinking, application, and mastery check. The stage timings also appear in the printable summary.

Each power skill also produces a topic-specific learning objective and three measurable success criteria. These outcomes appear in both the working lesson direction and printable summary.

Sprint 4 has started with device-local draft management. Teachers can save multiple generated lessons in the current browser, reload them after refreshing, and delete drafts they no longer need. Drafts do not leave the device or require an account.

## Printable summary

After generating lesson direction, select **Open printable summary**. The summary carries forward the grade, subject, topic, power skill, standard, duration, inquiry question, and all six instructional stages. Select **Print / Save as PDF**, then choose the browser's PDF destination.

The selections are encoded in the summary page URL for this prototype. Do not include student information or other sensitive data in lesson topics.

Browser drafts are also local to the current browser profile and may be lost if site data is cleared. They are not synchronized across devices.

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
