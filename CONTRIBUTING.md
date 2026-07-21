# Contributing

## Development baseline

Lesson Assistant is intentionally browser-native and dependency-free at runtime. Keep the deterministic generator usable without accounts, paid APIs, hosted AI, or a build step.

Requirements:

- Node.js 20 or newer for verification
- Python 3 or another static server for local browser testing

## Before changing code

1. Read `LESSON_PLANNER_AGILE_CODE_PLAN.md` and the relevant documentation under `docs/`.
2. Keep curriculum decisions separate from interface code.
3. Do not mark standards as educator-verified without a named human review and date.
4. Do not add lesson content, teacher notes, student information, tokens, or credentials to logs, fixtures, screenshots, or commits.

## Verify a change

```sh
npm run check
npm test
python3 -m http.server 4173
```

Open `http://localhost:4173/`; use `localhost`, not `127.0.0.1`, for the in-app browser on this development machine.

For interface changes, exercise generate, edit, save, reload, printable summary, and phone-width behavior. Record material failures and their resolution in `docs/development-log.md`.

## Pull-request checklist

- The change has one observable teacher outcome.
- Logic changes include tests.
- `npm run check` and `npm test` pass.
- Teacher-entered text is rendered with safe text APIs.
- Keyboard focus, labels, live announcements, and phone overflow were considered.
- Draft schema changes include migration and backup compatibility.
- Curriculum language remains pending educator review unless approval is documented.
- No dependency was added without a necessity, maintenance, and license review.

GitHub Actions runs the same syntax and test commands on every push and pull request. Static publishing is intentionally not part of CI until deployment is approved and configured.
