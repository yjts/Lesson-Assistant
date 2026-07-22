# Contributing

## Development baseline

Lesson Assistant is intentionally browser-native and dependency-free at runtime. Keep the deterministic generator usable without accounts, paid APIs, hosted AI, or a build step.

Requirements:

- Node.js 20 or newer for verification
- pnpm 11.9.0 (declared in `package.json`)
- Node.js static server included with the project

## Before changing code

1. Read `LESSON_PLANNER_AGILE_CODE_PLAN.md` and the relevant documentation under `docs/`.
2. Keep curriculum decisions separate from interface code.
3. Do not mark standards as educator-verified without a named human review and date.
4. Do not add lesson content, teacher notes, student information, tokens, or credentials to logs, fixtures, screenshots, or commits.

## Verify a change

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm exec playwright install chromium
pnpm run test:e2e
pnpm run dev
```

Open `http://localhost:4173/`; use `localhost`, not `127.0.0.1`, for the in-app browser on this development machine.

For interface changes, exercise generate, edit, save, reload, printable summary, and phone-width behavior. Record material failures and their resolution in `docs/development-log.md`.

## Pull-request checklist

- The change has one observable teacher outcome.
- Logic changes include tests.
- `pnpm run verify` passes.
- Teacher-entered text is rendered with safe text APIs.
- Keyboard focus, labels, live announcements, and phone overflow were considered.
- Draft schema changes include migration and backup compatibility.
- Curriculum language remains pending educator review unless approval is documented.
- No dependency was added without a necessity, maintenance, and license review.

GitHub Actions runs the same syntax, unit, and Chromium workflow tests on every push and pull request. Static publishing is intentionally not part of CI until deployment is approved and configured.

## Development dependency decision

`@playwright/test` is pinned as a development-only dependency for browser workflow coverage. Playwright is Apache-2.0 licensed and is not shipped to teachers or required by the application at runtime. CI installs only Chromium to keep download and execution costs bounded; Firefox and WebKit remain explicit release-matrix checks.
