# Pilot Test and Accessibility Report

Date: 2026-07-21  
Candidate branch: `codex/work`

## Automated verification

- JavaScript syntax checks cover all application modules.
- 37 tests cover generation, timing, standards filtering and provenance, validation, state, editable draft persistence, schema migration, backup/restore safeguards, content-free diagnostics, print structure, accessibility contracts, and the primary save-and-restore workflow.
- Current result: 37 passed, 0 failed.

## Live workflow verification

Verified in the Codex in-app Chromium browser:

- Generate the default lesson.
- Edit the inquiry question and teacher notes.
- Observe the unsaved-edits status.
- Save the edited draft.
- Open the printable summary and confirm edits are preserved.
- Copy the plain-text lesson successfully.
- Confirm no browser console errors during the workflow.

## Accessibility review

Verified contracts include semantic labels, keyboard skip navigation, visible focus styles, live status announcements, alert semantics, labeled editable regions, table captioning, non-color status text, responsive overflow containment, and reduced-motion handling. No critical or high-severity issue was found in the scoped review.

Manual screen-reader testing with VoiceOver or NVDA and a complete WCAG 2.2 AA audit remain pilot-release checks.

## Browser and device matrix

| Environment | Status |
|---|---|
| Codex in-app Chromium, desktop | Primary workflow passed |
| Codex in-app Chromium, 390 × 844 phone viewport | Passed; page width equals viewport and table scroll remains contained |
| Chrome current | Pilot check required |
| Edge current | Pilot check required |
| Firefox current | Pilot check required |
| Safari current on macOS/iOS | Pilot check required |

## Known release constraints

- Standards remain provisional and require educator confirmation against authoritative source/version metadata.
- Drafts are local to one browser unless the teacher downloads and restores a backup.
- Teacher usability results and time-to-first-useful-lesson measurements are not yet available.
- The MVP has no accounts, collaboration, cloud synchronization, or student-data workflow.
