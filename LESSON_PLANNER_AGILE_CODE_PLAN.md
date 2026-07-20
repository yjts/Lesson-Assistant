# Inquiry Lesson Direction Builder
## Agile Code Plan and Sprint Roadmap

## 1. Product Vision

Build a responsive teacher-planning application that turns a grade level, subject, topic, power skill, academic standard, and lesson duration into a useful inquiry-based lesson direction. The application should help teachers plan faster while keeping them responsible for reviewing sources, supports, and instructional decisions.

### Primary users

- Middle- and high-school teachers
- Instructional coaches
- Curriculum leaders
- School administrators reviewing lesson direction

### Product promise

In a few minutes, a teacher can produce, revise, save, and export a standards-aligned lesson direction showing the inquiry question, teacher actions, student actions, evidence-based learning, and mastery check.

## 2. MVP Boundary

### Include in the MVP

- Grade, subject, topic, power skill, standard, and duration inputs
- Standards filtered by grade and subject
- Generated inquiry question
- Six-part instructional structure
- Teacher and student roles
- Editable generated content
- Lesson validation and helpful error messages
- Local draft saving and reloading
- Print-friendly lesson direction
- Responsive, keyboard-accessible interface
- Unit tests for deterministic generation rules

### Defer until after the MVP

- User accounts and shared school workspaces
- Cloud database
- AI-generated lesson content
- Automatic source or resource selection
- Learning-management-system integration
- Collaborative editing and approvals
- Large multi-state standards library
- Student-data collection
- Usage analytics beyond basic privacy-conscious telemetry

## 3. Product Principles

1. The tool provides lesson direction, not a finished lesson.
2. Teachers can review and edit every generated field.
3. Standards and instructional rules are stored as data, not embedded in the interface.
4. Deterministic templates power the MVP so results are predictable and testable.
5. AI may enhance drafting later but must never be required for core functionality.
6. Accessibility and mobile usability are part of every feature's definition of done.

## 4. Recommended Technical Approach

### MVP stack

- HTML5 for semantic page structure
- CSS for responsive components and print layouts
- JavaScript modules for state, rules, generation, storage, and UI behavior
- JSON files for standards, power skills, and lesson templates
- Vite for local development and production builds
- Vitest for unit tests
- Playwright for end-to-end and accessibility smoke tests
- axe-core for automated accessibility checks
- ESLint and Prettier for code quality and formatting
- Git for local source control and GitHub for the existing remote repository
- GitHub Actions for automated tests and GitHub Pages for free static preview deployment
- Ollama with a permissively licensed local model if AI drafting enters scope

### Resource constraint

The project must be buildable with free and open-source development dependencies. Core product behavior must not require a paid API, proprietary AI service, commercial database, or metered hosting plan. The existing GitHub remote and its free repository, automation, and static hosting features may be used for collaboration and delivery. Any AI model added to the product must run locally or on infrastructure controlled by the project, and its model license must be reviewed before distribution.

### Later evolution

Move to an open-source framework such as React only if the application grows into multi-page workflows, collaboration, complex state, or reusable school dashboards. Add a backend only when accounts, cloud drafts, shared templates, or approvals become confirmed requirements. Prefer an open-source, self-hostable backend such as PocketBase, Appwrite, or PostgreSQL with a small Node.js service; choose only after the pilot confirms the need.

## 4A. Solo Developer and AI-Agent Operating Model

The human developer remains product owner, curriculum reviewer, security approver, and final code reviewer. The AI coding agent acts as an implementation partner, not an autonomous product authority.

### Human responsibilities

- Confirm priorities and sprint acceptance criteria.
- Approve standards content and instructional language.
- Review security, privacy, licenses, and dependency changes.
- Test teacher-facing behavior and accept completed stories.
- Decide when changes are committed, merged, released, or deployed.

### Agent responsibilities

- Inspect the current repository before changing it.
- Implement one clearly scoped story at a time on a feature branch.
- Add or update tests with every logic change.
- Run formatting, unit, build, and relevant browser tests.
- Report assumptions, changed files, test results, and remaining risks.
- Maintain documentation and the sprint checklist.

### Working agreement

- Keep stories small enough to implement and verify in one focused session.
- Use a branch per sprint or coherent feature; keep commits reviewable.
- Never let AI-generated curriculum claims bypass educator verification.
- Do not introduce a dependency until its license, maintenance, and necessity are checked.
- Keep deterministic rules as the fallback when local AI is unavailable.
- End every sprint with a tested, runnable increment rather than unfinished parallel work.

## 5. High-Level Architecture

```text
Teacher
  |
  v
Responsive Planning Interface
  |
  +-- Input validation
  +-- Editable generated output
  |
  v
Lesson Generation Engine
  |
  +-- Standards catalog
  +-- Power-skill rules
  +-- Inquiry-question templates
  +-- Instructional-structure templates
  |
  v
Local Draft Storage and Print Export
```

### Application modules

- `state.js`: current form values, generated lesson, and editing state
- `standards.js`: grade/subject filtering and standards lookup
- `generator.js`: deterministic inquiry and lesson-structure generation
- `validation.js`: input validation and user-facing messages
- `storage.js`: local draft save, load, rename, and delete operations
- `ui.js`: rendering, events, keyboard behavior, and status updates
- `print.css`: printable lesson layout

## 6. Core Data Model

### Lesson input

```json
{
  "gradeLevel": "Grade 8",
  "subject": "U.S. History",
  "topic": "Boston Tea Party",
  "powerSkill": "Cause and Effect",
  "standardCode": "CA HSS 8.1",
  "durationMinutes": 60
}
```

### Generated lesson direction

```json
{
  "id": "lesson_123",
  "title": "Boston Tea Party Lesson Direction",
  "inquiryQuestion": "What caused the Boston Tea Party, and what changed because of it?",
  "steps": [
    {
      "type": "inquiry-opener",
      "teacherAction": "Show an image, quotation, or opening question.",
      "studentAction": "Think independently and give an initial response.",
      "example": "What caused the Boston Tea Party?"
    }
  ],
  "createdAt": "2026-07-20T00:00:00Z",
  "updatedAt": "2026-07-20T00:00:00Z",
  "version": 1
}
```

### Standard

```json
{
  "code": "CA HSS 8.1",
  "gradeLevels": ["Grade 8"],
  "subjects": ["U.S. History"],
  "description": "Founding principles and the American Revolution",
  "source": "California History-Social Science Standards"
}
```

## 7. Sprint Cadence

Use one-week sprints for a solo developer working consistently with an AI coding agent. Limit each sprint to one primary outcome, approximately 5 to 8 implementation stories, and a small buffer for review and fixes. If development is part-time, treat each sprint as two calendar weeks without changing its scope. Every sprint ends with a working, tested increment on GitHub Pages and a short retrospective.

### Recommended weekly rhythm

- Day 1: confirm stories, acceptance criteria, and curriculum questions.
- Days 2–3: agent-assisted implementation in small reviewed changes.
- Day 4: integration, automated testing, accessibility checks, and documentation.
- Day 5: manual teacher workflow test, deployment, review, and backlog adjustment.

### Story completion workflow

1. Define the observable user outcome and acceptance checks.
2. Ask the agent to inspect relevant code and propose the smallest implementation.
3. Implement with tests on the active feature branch.
4. Review the diff and run the full verification suite.
5. Manually exercise the teacher workflow.
6. Commit only when the story meets the definition of done.

## Sprint 0 — Product Alignment and Repository Setup

### Goal

Turn the supplied single-file mockup into a safe development baseline.

### Work

- Add the prototype to the repository as a reference artifact.
- Correct the standard control mismatch: the HTML uses an input while JavaScript expects a select.
- Correct the result table mismatch: HTML uses `rows` while JavaScript expects `structureRows`.
- Confirm the initial supported grades, subjects, standards, and power skills.
- Confirm whether California HSS is the only standards set required for the MVP.
- Create the Vite project structure and development scripts.
- Add README, contribution notes, `.gitignore`, and issue templates.
- Configure Vitest, Playwright, formatting, and linting.
- Create a preview deployment.

### Deliverables

- Running repaired prototype
- Initialized development project
- Product assumptions and open-questions list
- Automated test and preview-deployment baseline

### Acceptance criteria

- The page loads without console errors.
- Changing grade or subject updates available standards.
- Generate updates the inquiry question and all six instructional rows.
- A contributor can install dependencies, run the app, and run tests from the README.

## Sprint 1 — Responsive and Accessible Interface

### Goal

Build a maintainable, responsive version of the core planning screen.

### Work

- Separate HTML, CSS, JavaScript, and data files.
- Build semantic form controls with explicit labels and help text.
- Add responsive desktop, tablet, and phone layouts.
- Add visible focus styles and logical keyboard navigation.
- Add empty, initial, generated, and error states.
- Make generated output readable without relying on color.
- Preserve the useful visual language of the prototype.

### Deliverables

- Responsive planning interface
- Reusable form, card, status, table, and notice styles
- Accessibility smoke-test suite

### Acceptance criteria

- No horizontal page scrolling at 320 CSS pixels.
- The full planning flow works with a keyboard.
- Labels and errors are announced appropriately by screen readers.
- The interface meets WCAG AA contrast targets.

## Sprint 2 — State, Validation, and Standards Catalog

### Goal

Make inputs reliable and move curriculum data outside the interface code.

### Work

- Add a central application-state model.
- Move standards into versioned JSON data.
- Filter standards by grade and subject.
- Validate required fields, topic length, and supported combinations.
- Handle Grade 12 Government and Economics explicitly.
- Add source metadata and a standards last-reviewed date.
- Add unit tests for filtering and validation.

### Deliverables

- Standards catalog
- Predictable state updates
- Inline validation and recovery messages

### Acceptance criteria

- Unsupported grade/subject combinations cannot silently produce a misleading standard.
- Every displayed standard has a code, description, and source.
- Invalid inputs do not erase the teacher's previous work.
- Filtering and validation edge cases are covered by tests.

## Sprint 3 — Lesson Generation Engine

### Goal

Generate consistent lesson direction from deterministic instructional rules.

### Work

- Extract inquiry-question templates by power skill.
- Generate all six lesson stages from normalized input.
- Adapt wording to topic, skill, subject, and duration.
- Define expected outcomes for 45-, 60-, 75-, and 90-minute lessons.
- Add safe HTML rendering so teacher-entered text cannot inject markup.
- Add normal, empty, unusual-character, and long-topic tests.
- Keep generation functions independent from the browser interface.

### Deliverables

- Tested generation module
- Versioned template configuration
- Live output updates

### Acceptance criteria

- The same inputs produce the same result.
- Every supported power skill produces an appropriate inquiry question.
- All outputs contain six instructional stages and a mastery check.
- Teacher input is rendered safely.
- Generation logic has meaningful unit-test coverage.

## Sprint 4 — Teacher Editing and Draft Management

### Goal

Allow teachers to turn generated direction into their own usable plan.

### Work

- Make the inquiry question and lesson-stage text editable.
- Track generated versus teacher-edited content.
- Add Save Draft, Save As, Load, Rename, Duplicate, and Delete.
- Store drafts locally with a documented data schema.
- Add unsaved-change warnings.
- Add reset and regenerate confirmation where edits would be replaced.
- Add graceful handling for corrupt or outdated local drafts.

### Deliverables

- Editable lesson direction
- Local draft library
- Draft schema and migration strategy

### Acceptance criteria

- Refreshing does not lose a saved draft.
- Regeneration does not overwrite teacher edits without warning.
- Multiple drafts can be distinguished and reloaded.
- Failed storage operations produce a clear recovery message.

## Sprint 5 — Print, Export, and Classroom Usability

### Goal

Produce a clean lesson-direction artifact teachers can use or share.

### Work

- Create print-specific layouts.
- Include title, metadata, inquiry question, six stages, and mastery check.
- Remove application controls from printed output.
- Add print preview and browser PDF guidance.
- Add a copy-to-clipboard workflow.
- Add optional teacher notes and source reminders.
- Verify standard page sizes and long-content pagination.

### Deliverables

- Print-ready lesson direction
- Copyable output
- Classroom-use review checklist

### Acceptance criteria

- Typical output prints cleanly without clipped content.
- Standards and teacher edits appear in the exported result.
- Warnings or incomplete fields remain visible in print.
- Output remains understandable in grayscale.

## Sprint 6 — Quality, Accessibility, and Pilot Release

### Goal

Prepare the MVP for a small teacher pilot.

### Work

- Add end-to-end coverage for the primary workflow.
- Test supported browsers and common device sizes.
- Run automated and manual accessibility reviews.
- Conduct teacher usability sessions.
- Measure time to first useful lesson direction.
- Fix critical usability and content problems.
- Add error logging that does not collect lesson content by default.
- Document backup, browser-storage limitations, and support procedures.

### Deliverables

- Pilot-ready MVP
- Test and accessibility report
- Pilot feedback form and prioritized backlog

### Acceptance criteria

- A new teacher can generate, edit, save, reload, and print without assistance.
- No critical or high-severity accessibility issues remain.
- No known data-loss defect remains in supported browsers.
- Pilot users judge the generated structure useful enough to revise and use.

## Sprint 7 — Self-Hosted Accounts and Shared Templates (Optional)

### Goal

Add secure persistence only after the local MVP proves useful.

### Work

- Select a self-hostable open-source backend after a short proof of concept.
- Add teacher authentication using the selected backend.
- Store private drafts in an open-source database.
- Add school-approved shared templates.
- Define teacher, coach, and administrator permissions.
- Add row-level security and authorization tests.
- Add audit timestamps and account-data deletion.
- Complete a privacy and retention review.
- Document local development, backup, upgrade, and self-hosting procedures.

### Acceptance criteria

- Users cannot read or modify another teacher's private drafts.
- Shared templates are separated from personal drafts.
- Authorization is enforced by the backend, not only the interface.
- Account and lesson data can be exported and deleted.

## Sprint 8 — AI-Assisted Drafting (Optional)

### Goal

Use a locally hosted, permissively licensed model to improve drafts while keeping teachers in control and avoiding a required paid API.

### Suitable features

- Suggest alternate inquiry questions.
- Adapt teacher and student actions for a selected duration.
- Suggest differentiation or scaffolding ideas.
- Draft mastery-check alternatives.
- Rewrite directions for clarity.

### Guardrails

- AI is optional and clearly labeled.
- Deterministic generation continues to work when AI is unavailable.
- Run inference through Ollama or another open-source local runtime.
- Record the exact model name, version, license, and minimum hardware requirements.
- Teachers approve changes before they enter the lesson.
- The app does not send student names or student work by default.
- Standards are retrieved from the verified catalog, not invented by AI.
- Prompts, context handling, storage, performance limits, and model behavior are documented.
- Do not download or redistribute a model until its license is confirmed compatible with the project.

### Acceptance criteria

- Teachers can compare the original and suggested text.
- AI cannot silently replace teacher edits.
- Unsupported standards are not presented as verified facts.
- Failures return the teacher safely to the deterministic output.
- The complete MVP still works on a machine without Ollama or a model installed.

## 8. Recommended Project Structure

```text
Lesson-Assistant/
├── index.html
├── package.json
├── README.md
├── docs/
│   ├── product-requirements.md
│   ├── curriculum-data.md
│   ├── accessibility.md
│   ├── privacy.md
│   └── deployment.md
├── src/
│   ├── app.js
│   ├── state.js
│   ├── standards.js
│   ├── generator.js
│   ├── validation.js
│   ├── storage.js
│   ├── ui.js
│   └── data/
│       ├── standards.json
│       ├── power-skills.json
│       └── lesson-templates.json
├── styles/
│   ├── base.css
│   ├── components.css
│   └── print.css
├── tests/
│   ├── standards.test.js
│   ├── generator.test.js
│   ├── validation.test.js
│   ├── storage.test.js
│   └── lesson-flow.spec.js
└── reference/
    └── original-prototype.html
```

## 9. Testing Strategy

### Unit tests

- Grade and subject return the correct standards.
- Each power skill returns an appropriate inquiry template.
- All generated lessons contain six ordered stages.
- Empty and invalid values return useful validation errors.
- Special characters are displayed safely.
- Draft serialization and migration preserve teacher edits.

### End-to-end tests

- Generate a Grade 8 U.S. History lesson.
- Change grade and verify standards update.
- Edit an inquiry question and lesson stage.
- Save, reload, duplicate, and delete a draft.
- Print or open print preview.
- Complete the workflow using only a keyboard.

### Content-quality review

- Standards codes and descriptions match their authoritative source.
- Inquiry questions match the selected power skill.
- Teacher and student roles are distinct and actionable.
- Mastery checks require independent student understanding.
- Generated language does not claim to be a complete lesson.

## 10. Definition of Done

A feature is done when:

- Its acceptance criteria pass.
- It works at supported phone and desktop sizes.
- It is usable by keyboard and has appropriate labels.
- Loading, empty, success, and error states are handled where relevant.
- Automated tests cover its important logic and workflow.
- Teacher-entered content is rendered safely.
- Curriculum data includes a source and review date.
- Documentation is updated.
- The change is available in a preview deployment.

## 11. Initial Product Backlog

### Must have

- Repair the supplied prototype.
- Separate code and standards data.
- Generate a six-stage lesson direction.
- Validate all inputs.
- Let teachers edit output.
- Save drafts locally.
- Print cleanly.
- Support keyboard and mobile use.

### Should have

- Duplicate drafts.
- Copy output to clipboard.
- Duration-aware lesson guidance.
- Teacher notes.
- Standards source metadata.

### Could have

- Additional state standards.
- Shared school templates.
- Cloud synchronization.
- AI-assisted alternatives.
- LMS export.

### Will not have in the initial release

- Automated grading
- Student profiles or student records
- AI as the authoritative standards source
- Fully generated instructional resources
- Automatic publishing to an LMS

## 12. Key Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Standards are inaccurate or outdated | Store source and review date; require educator review before release |
| Output is mistaken for a complete lesson | Keep the teacher disclaimer visible and make all output editable |
| Generic templates produce weak guidance | Test each power skill with real topics and collect teacher feedback |
| Teacher edits are lost | Add save status, unsaved-change warnings, and storage recovery tests |
| Scope expands into a full curriculum platform | Protect the MVP boundary and prioritize pilot evidence |
| AI invents standards or unsuitable advice | Keep verified standards deterministic and AI optional and reviewable |
| Accessibility is postponed | Include accessibility criteria and tests in every sprint |
| Agent changes are too large to review safely | Use small stories, focused diffs, and mandatory human acceptance |
| Open-source dependency becomes unmaintained | Keep dependencies minimal and review health and license before adoption |
| Local AI is too slow for available hardware | Keep AI optional and benchmark a small model before product integration |

## 13. Decisions Needed Before Sprint 2

- Is California History-Social Science the only standards framework for launch?
- Which grade and subject combinations are officially supported?
- Are the current 11 power skills final?
- Should lesson duration change the generated structure or only its suggested timing?
- Must teachers save drafts only on their device, or is login required for the first pilot?
- What school branding and disclaimer language should appear on printed plans?
- Who is responsible for approving standards and instructional templates?

## 14. Suggested MVP Release Target

Sprints 0 through 6 form the first usable release. For a solo developer working regularly with an AI coding agent, plan for seven focused one-week sprints, or approximately fourteen calendar weeks if working part-time. This is a planning target rather than a promise; reassess scope after the Sprint 3 generation-engine demo. Self-hosted accounts and local AI remain separate optional releases so they cannot delay the core teacher tool.
