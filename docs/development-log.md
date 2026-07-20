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

## 2026-07-20 — Git history and delivery

### Git author identity was missing

- **Operation:** Create the root commit.
- **Observed state:** Repository and global Git configuration had no author name or email.
- **Cause:** Git identity was not configured on this machine.
- **Response:** Set repository-local identity to `yjts <yjts@users.noreply.github.com>` without changing global Git settings.
- **Status:** Resolved locally. The user should confirm this identity is preferred before long-term contribution history grows.

### Branch push lacks GitHub write authentication

- **Operation:** `git push -u origin codex/work`.
- **Observed error:** `could not read Username for 'https://github.com': Device not configured`.
- **Cause:** The shell can read the repository but has no credential available for HTTPS writes.
- **Response:** Preserved all work in local commits and continued development without retrying destructive or insecure credential workarounds.
- **Status:** Open delivery blocker. Configure a GitHub credential helper, SSH key, or GitHub CLI login before pushing. Do not place a personal access token in source files or the remote URL.

## Current open issues

- GitHub write authentication is not configured, so local commits cannot yet be pushed.
- The project uses Codex's bundled Node executable in this environment because `node` and `npm` are not globally available.
- Curriculum standards still require educator review and authoritative source/version metadata before release.

