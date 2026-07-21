# Development and Error Log

This log records material setup, development, testing, and delivery errors encountered while building Lesson Assistant. Each entry includes the observed symptom, cause, response, and current status so future work does not repeat the same investigation.

## 2026-07-20 — Initial repository setup

### GitHub clone could not resolve the host

- **Operation:** Clone `https://github.com/yjts/Lesson-Assistant.git`.
- **Observed error:** `Could not resolve host: github.com`.
- **Cause:** The first Git operation ran without network access in the restricted workspace.
- **Response:** Retried the exact clone operation with approved network access.
- **Status:** Resolved.

### Private-repository authentication was unavailable

- **Operation:** Retry the GitHub clone over HTTPS.
- **Observed error:** `could not read Username for 'https://github.com': Device not configured`.
- **Cause:** Git had no usable GitHub HTTPS credentials in the shell session.
- **Response:** Reported the authentication requirement and checked for the GitHub CLI.
- **Status:** The repository later became readable and cloned successfully. GitHub write authentication remains unresolved; see the push entry below.

### GitHub CLI was not installed

- **Operation:** Check GitHub authentication with `gh auth status`.
- **Observed error:** `command not found: gh`.
- **Cause:** GitHub CLI is not installed or exposed on the system path.
- **Response:** Continued using standard Git and HTTPS.
- **Status:** Unresolved but not required for local development.

### Repository cloned without commits

- **Operation:** Successful clone.
- **Observed warning:** `You appear to have cloned an empty repository`.
- **Cause:** The GitHub repository did not contain an initial commit.
- **Response:** Created `codex/work` as an unborn branch and built the root project baseline.
- **Status:** Resolved by local root commit `9f5bffb`.

## 2026-07-20 — Supplied prototype review

### Academic-standard control type mismatch

- **Observed defect:** The HTML declared `standard` as an `<input>`, while JavaScript treated it as a `<select>` and attempted to populate options.
- **Effect:** Standards initialization could throw when accessing select-specific properties.
- **Response:** Rebuilt the field as a semantic `<select>` populated from a standards module.
- **Status:** Resolved and covered by standards tests and browser interaction checks.

### Instructional-table identifier mismatch

- **Observed defect:** The HTML table body used `id="rows"`, while generation logic targeted `structureRows`.
- **Effect:** Generating a new lesson attempted to update a missing element.
- **Response:** Standardized the table body as `structure-rows` and updated rendering logic.
- **Status:** Resolved and verified by confirming six rendered stages.

## 2026-07-20 — Local runtime and testing

### Node and npm were not on the system path

- **Operation:** Check development runtime.
- **Observed errors:** `command not found: node` and `command not found: npm`.
- **Cause:** The desktop shell does not expose a standard Node installation.
- **Response:** Used Codex's bundled Node executable for syntax and test execution. Kept the project compatible with a normal Node 20+ installation for contributors.
- **Status:** Workaround active. A conventional Node installation is still recommended for manual local development.

### Local HTTP server could not bind inside the sandbox

- **Operation:** Start `python3 -m http.server 4173` for browser testing.
- **Observed error:** `PermissionError: [Errno 1] Operation not permitted`.
- **Cause:** Binding a local port required elevated sandbox approval.
- **Response:** Restarted the same temporary server with approved local-server permission.
- **Status:** Resolved for testing sessions.

### In-app browser timed out on `127.0.0.1`

- **Operation:** Open `http://127.0.0.1:4173/` in the in-app browser.
- **Observed error:** Navigation timed out even though a command-line HEAD request returned HTTP 200.
- **Cause:** The in-app browser connection did not successfully reach the numeric loopback target in that attempt.
- **Response:** Used `http://localhost:4173/`, which loaded correctly.
- **Status:** Resolved. Use `localhost` for subsequent in-app browser tests.

### Phone layout exceeded the viewport

- **Operation:** Test the page at 390 by 844 CSS pixels.
- **Observed state:** Page width was 785 pixels while the viewport was 390 pixels.
- **Cause:** The results grid item retained its content-based minimum width, allowing the 720-pixel lesson table to expand the page.
- **Response:** Added `min-width: 0` to grid/card result containers and constrained overflow to the table wrapper.
- **Verification:** Page scroll width now equals the 390-pixel viewport; the table scrolls inside its 311-pixel container.
- **Status:** Resolved.

### First empty-topic browser probe produced misleading state

- **Operation:** Fill the topic with an empty string and submit during browser automation.
- **Observed state:** The recorded state appeared successful rather than invalid.
- **Cause:** The probe read an HTML value attribute rather than consistently inspecting the live input property, making the intermediate diagnostic misleading.
- **Response:** Re-ran the validation workflow with a one-character live value and inspected the input property, error visibility, focus, and `aria-invalid` state together.
- **Verification:** The field receives focus, `aria-invalid="true"`, and the expected error message; a subsequent valid submission clears the error and focuses the result.
- **Status:** Resolved as a testing-diagnostic issue, not an application defect.

### Browser loaded a stale standards module during Sprint 2 verification

- **Operation:** Load the state-management and standards-provenance increment.
- **Observed error:** `The requested module './standards.js' does not provide an export named 'standardsCatalogMeta'`.
- **Cause:** The simple local server returned a previously cached copy of `standards.js` while loading the updated `app.js`, leaving incompatible module versions in the same page load.
- **Response:** Added a shared application-version query to browser module imports so static deployments and the local server request a consistent module version.
- **Status:** Resolved; rechecked initial rendering and browser console after cache-busting.

### Stage timing displayed as `undefined` during Sprint 3 verification

- **Operation:** Add duration-aware timing to the six generated lesson stages.
- **Observed defect:** The updated table rendered `undefined min` for every stage.
- **Cause:** Browser imports still used the `0.2.0` cache key, so the updated interface loaded alongside a cached generator without timing data.
- **Response:** Bumped the shared browser-module query version to `0.3.0` across the builder, summary, validation, state, and standards imports.
- **Status:** Resolved and rechecked in both the builder and printable summary.

## 2026-07-20 — Git history and delivery

### Git author identity was missing

- **Operation:** Create the root commit.
- **Observed state:** Repository and global Git configuration had no author name or email.
- **Cause:** Git identity was not configured on this machine.
- **Response:** Set repository-local identity to `yjts <yjts@users.noreply.github.com>` without changing global Git settings.
- **Status:** Resolved locally. The user should confirm this identity is preferred before long-term contribution history grows.

### Branch push initially lacked GitHub write authentication

- **Operation:** `git push -u origin codex/work`.
- **Observed error:** `could not read Username for 'https://github.com': Device not configured`.
- **Cause:** The shell can read the repository but has no credential available for HTTPS writes.
- **Response:** Preserved all work in local commits and continued development without retrying destructive or insecure credential workarounds.
- **Status:** Resolved outside the original shell session; `codex/work` now tracks and matches `origin/codex/work`. Do not place a personal access token in source files or the remote URL.

### Push retry remained unauthenticated

- **Operation:** Retry `git push -u origin codex/work` after the user asked to continue.
- **Observed error:** `could not read Username for 'https://github.com': Device not configured`.
- **Cause:** No GitHub HTTPS credential, credential helper entry, GitHub CLI login, or SSH key had been added since the prior attempt.
- **Response:** Kept all work in local commits and continued development without exposing or embedding a token.
- **Status:** Historical; later repository inspection confirmed the branch was pushed successfully.

### Draft-delete browser click timed out after completing

- **Operation:** Delete the temporary draft created during persistence testing.
- **Observed error:** Browser automation timed out while translating the click event for the Delete button.
- **Cause:** The confirmation-triggering click completed in the page, but the automation layer did not receive its normal completion signal before timing out.
- **Response:** Inspected fresh page state instead of retrying blindly. The draft list showed `No saved drafts` and the status announced that the draft was deleted.
- **Status:** Test data was removed successfully; no application defect remained.

### Automated rename prompt did not open reliably

- **Operation:** Browser-test the Rename action for a saved draft.
- **Observed error:** Semantic and ID-based automated clicks did not expose the JavaScript prompt to the automation session.
- **Cause:** The in-app browser's dialog translation did not consistently surface the prompt after the synthetic click.
- **Response:** Verified rename behavior through storage-layer tests, verified the visible enabled Rename control in the browser, and avoided repeated prompt automation. Duplicate and cleanup flows were tested through the live interface.
- **Status:** Core rename logic passes automated tests. Manual prompt interaction remains part of the next usability pass.

## Current open issues

- The project uses Codex's bundled Node executable in this environment because `node` and `npm` are not globally available.
- Curriculum standards still require educator review of shortened descriptions and local grade/subject mappings before release.

Authoritative CDE source, adoption, page-review, and application source-check metadata are now recorded. Educator verification of every shortened description and local grade/subject mapping remains open.

## 2026-07-21 — Automated browser workflow coverage

### Changing lesson selections triggered an incorrect overwrite warning

- **Observed defect:** The first Playwright primary-workflow run changed the topic and power skill, then Generate opened an unsaved-teacher-edits confirmation even though generated content had not been edited.
- **Cause:** Input selection changes reused the lesson-content `dirty` flag.
- **Response:** Kept selection changes in the `editing` status without marking teacher-authored lesson content dirty. Direct edits continue to set the dirty flag and retain overwrite protection.
- **Status:** Resolved and covered by state and browser workflow tests.

### Playwright could not initially find Node on this development machine

- **Observed error:** `./node_modules/.bin/playwright: line 41: exec: node: not found` while installing Chromium.
- **Cause:** The shell does not expose system Node, matching the existing runtime limitation.
- **Response:** Ran Playwright with the Codex bundled Node directory on `PATH`; Chromium, its headless shell, and FFmpeg installed successfully.
- **Status:** Local workaround verified. GitHub Actions uses standard Node 20 and is unaffected.

### Browser workflow automation became a development dependency

- **Decision:** Pinned `@playwright/test` 1.61.0 as development-only, with Apache-2.0 licensing recorded in `CONTRIBUTING.md`. It is not part of the teacher-facing runtime.
- **Scope:** CI installs Chromium only. The tests cover teacher edits through printable summary, phone overflow containment, and privacy-safe diagnostics.

### First expanded CI run failed during pnpm installation

- **Observed state:** GitHub Actions run `29871224312` failed at `pnpm install --frozen-lockfile` before syntax or test execution; the same lockfile installed successfully in a clean local directory.
- **Response:** Removed the extra pnpm setup action, generated `package-lock.json`, and changed CI to the standard `npm ci` flow on Node 22 with current checkout/setup actions.
- **Status:** Superseded configuration; the replacement run must pass before the increment is considered complete.

## 2026-07-21 — Standards provenance pass

### Framework and content-standard provenance were conflated

- **Observed risk:** The catalog linked only a broad standards landing page and did not distinguish the state-adopted content standards from the 2016 implementation framework.
- **Response:** Recorded the official Appendix C content-standards PDF, the framework page, both adoption dates, the CDE page-review date, and the application source-check date. Added a direct official-source link beside the standard selector.
- **Verification:** Representative Grade 6, Grade 8, Grade 11, Grade 12 Government, Grade 12 Economics, and grade-span analysis-skill structures were checked against CDE Appendix C.
- **Status:** Source provenance resolved. Every locally shortened description and grade/subject mapping still requires educator approval.

## 2026-07-21 — Sprint 6 engineering pass

### Local drafts needed a user-controlled recovery path

- **Observed risk:** Clearing browser data or changing profiles could remove all local drafts.
- **Response:** Added portable JSON Backup and Restore controls with schema validation and newest-copy-wins merging.
- **Status:** Resolved for user-managed recovery; browser-local storage limitations remain documented.

### Diagnostics could accidentally collect lesson content

- **Observed risk:** General error-message logging could capture a teacher-entered topic or note.
- **Response:** Added a bounded local log that accepts only approved event codes, timestamps, and the application version. Raw messages, lesson content, URLs, and user identifiers are excluded.
- **Status:** Resolved and covered by diagnostics tests.

### Support diagnostics originally required developer access

- **Observed limitation:** The privacy-safe local entries existed but teachers and support staff could not inspect or clear them from the interface.
- **Response:** Added an accessible Support diagnostics disclosure with newest-first entries, an empty state, and a clear action. Added a 5 MB pre-read limit for backup restoration.
- **Status:** Resolved and covered by interface-contract tests.

### Pilot phone status text exceeded the viewport by one pixel

- **Observed defect:** At a 390-pixel viewport, the non-wrapping generated-status badge extended the document width to 391 pixels.
- **Response:** Allowed result-status text to wrap at the phone breakpoint while retaining contained table scrolling.
- **Status:** Resolved; live re-verification confirmed document width equals the viewport.

## 2026-07-21 — Sprints 4 and 5 completion

### Teacher edits were not part of the saved or printed artifact

- **Observed limitation:** Generated fields were read-only, and the summary regenerated from URL selections instead of carrying teacher revisions forward.
- **Response:** Made inquiry, objective, success criteria, teacher actions, student actions, and examples editable; added teacher notes and a source/accessibility reminder; stored the full edited lesson in drafts and temporary summary handoff storage.
- **Verification:** Edited inquiry and notes were saved in the live browser and reproduced exactly on the printable summary.
- **Status:** Resolved.

### Draft replacement could overwrite unsaved work

- **Observed limitation:** Regeneration and loading had no dirty-state protection, and Save always created a new draft identity.
- **Response:** Added explicit edited/saved state, before-unload protection, confirmation before regeneration or draft loading, update-in-place Save, distinct Save As, and a version 1 to version 2 draft migration.
- **Status:** Resolved and covered by state and storage tests.

### Printable handoff lacked copy and classroom guidance

- **Observed limitation:** Print / Save as PDF was available, but teachers had no plain-text copy action, PDF settings guidance, notes, or source reminder in the output.
- **Response:** Added accessible copy status, Letter/PDF instructions, printed notes and source reminders, and break-resistant print sections.
- **Verification:** Copy completed in the live browser without console errors; print contracts remain covered by automated tests.
- **Status:** Resolved.
