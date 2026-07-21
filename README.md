# Lesson Assistant

An open-source, browser-native prototype that creates inquiry-based lesson direction from a grade, subject, topic, power skill, academic standard, and lesson duration.

## Current status

Sprints 1 through 5 are complete, and the Sprint 6 engineering pass is complete. The project is a pilot candidate pending educator curriculum review, cross-browser checks, and teacher usability sessions. It now includes deterministic generation, validation, provisional standards filtering, teacher editing, local draft management, portable backups, privacy-safe local diagnostics, and classroom-ready print and copy workflows.

Grade selections now narrow the available subjects and standards using a documented provisional mapping. Mismatched grade, subject, standard, and duration combinations are rejected before generation. These mappings remain pending educator verification.

Sprint 3 has started with deterministic duration-aware planning. Each 45-, 60-, 75-, or 90-minute lesson now divides the available time across the inquiry opener, short instruction, investigation, evidence-based thinking, application, and mastery check. The stage timings also appear in the printable summary.

Each power skill also produces a topic-specific learning objective and three measurable success criteria. These outcomes appear in both the working lesson direction and printable summary.

Teachers can revise the inquiry question, learning objective, success criteria, all teacher and student actions, and stage examples. They can also add teacher notes and a source/accessibility reminder. Unsaved edits trigger warnings before regeneration, draft replacement, or leaving the page.

Device-local drafts support Save, Save As, Load, Rename, Duplicate, and Delete. The versioned draft schema migrates earlier local drafts by adding the new planning fields. Drafts do not leave the device or require an account.

Use **Backup** to download all local drafts as JSON and **Restore** to merge a backup into the current browser. When draft identities collide, the newest updated copy is retained. The application keeps at most 20 local diagnostic entries containing only an approved event code, timestamp, and application version—never lesson content.

## Printable summary

After generating or editing lesson direction, select **Open printable summary**. The summary preserves the current teacher-edited lesson, including planning notes and source reminders. Use **Copy lesson text** for a plain-text handoff, or select **Print / Save as PDF**, choose the browser's PDF destination, use Letter paper, and keep background graphics enabled.

The summary uses temporary same-tab browser storage to preserve edits and retains URL selections as a recovery fallback. Do not include student information or other sensitive data in lesson topics or notes.

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

Pilot materials are in [docs/pilot-test-report.md](docs/pilot-test-report.md), [docs/pilot-feedback-form.md](docs/pilot-feedback-form.md), [docs/pilot-backlog.md](docs/pilot-backlog.md), and [docs/support-and-backup.md](docs/support-and-backup.md).
