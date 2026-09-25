# Atlas Project Bootstrap Checklist

This checklist records the delivered T000 static frontend foundation. T001 later delivered the labelled booking experience (merged PR #2). T002 now implements the v0.10 local data platform; the original T000 checkboxes remain historical frontend evidence. T002 verification is recorded separately below.

## Phase 0 — Planning and repository foundation

### Step 1 — Planning folder ready

Use one `planning/` folder at the repository root:

```text
planning/
  bootstrap.md
  context/
    business/              # Product, design, and visual references
    technical/             # Technical baseline
  roadmap/
    tasks.md
    dependencies.mmd
```

The Atlas context pack belongs under `planning/context/`. Keep its files together so relative links work. Do not maintain a second copy of the pack.

`roadmap/tasks.md` has one `Task Graph` table with a row per task: status, priority, task ID/title, size (`L` for every current task), branch, dependencies, and context references. Lower priority numbers break ties among unblocked tasks; dependencies determine what is blocked. `roadmap/dependencies.mmd` is the Mermaid task DAG. Do not add fixed execution waves.

Color every task node to match the `Done` column: unchecked `[ ]` tasks are gray (`pending`); checked `[x]` tasks are green (`done`). Use `classDef pending fill:#E5E7EB,stroke:#6B7280,color:#111827` and `classDef done fill:#DCFCE7,stroke:#16A34A,color:#14532D`. Assign every node exactly one class and update it when the task status changes.

- [x] Confirm the planning context is present and its links resolve.
- [x] Create the roadmap and make frontend bootstrap its first task.
- [x] Put the first illustrated booking experience in a separate feature task that depends on bootstrap.

### Step 2 — Repository foundation

> First commit: `chore: initialize repository foundation`

- [x] Initialize Git and create a root `README.md` with the Atlas purpose and pointers to the planning context.
- [x] Add `.gitignore` (including `.env`, build output, and dependencies), `.editorconfig`, and a license decision. No license is granted yet.
- [x] Keep `planning/` in the repository root. Commit the foundation and planning files without application behavior.
- [x] Push `main`, confirm it matches the remote, and verify only bootstrap is unblocked in the task graph. No automation system has been selected for registration.

### Step 3 — Repository settings

- [x] Protect `main`: block deletion and force pushes; require a pull request, the passing `verify` check, and resolved review conversations. Zero approvals are required for this solo project.
- [x] Enable automatic deletion of merged head branches.
- [x] Verify source repository visibility: GitHub reports Atlas as public; no open-source license is selected. Local SQLite knowledge, assets, credentials and backups remain private.
- [x] Add `pr-title` and `dependency-review` checks, plus a metadata-only PR-author assignment workflow. Bot authors are skipped; the assignment workflow never checks out PR code.
- [ ] Push the branch and verify `verify`, `pr-title`, `dependency-review`, `dependencies`, and `secrets` pass on GitHub. Local validation does not establish remote workflow success.
- [ ] After their first successful runs, add `pr-title`, `dependency-review`, `dependencies`, and `secrets` to the existing required checks alongside `verify`. Keep the current protection rules; downloaded rulesets use different check names and must not be imported unchanged.
- [ ] After merge, verify a new human-authored PR is assigned to its author. The `pull_request_target` workflow must exist on the base branch before it can handle new PRs.

Monthly Dependabot updates are grouped per ecosystem, including major updates; security updates are grouped separately without a monthly delay. Existing protection requires an up-to-date branch, so GitHub's mergeability checks already prevent merging conflicts; a separate conflict-detection job is unnecessary.

## Phase 1 — Frontend foundation

### Step 4 — Runtime and project shape

T000 delivered one static, client-rendered React application. Its first content boundary used TypeScript modules. T001 delivered booking fixture behavior on that baseline. The v0.10 target supersedes compiled project facts: T002 will retain the React canvas while moving saved knowledge to one SQLite database through a local validated API. The independent `fill-atlas` skill remains a later, outside-repository deliverable that writes standalone Markdown and stops; the browser will not import that file, scan repositories, or call an LLM.

- [x] Select mutually compatible supported Node and package versions; pin Node 22.23.2, use npm with one lockfile, and record the versions used.
- [x] Scaffold React, TypeScript, and Vite at the repository root alongside `planning/`. Do not create a monorepo or nested Atlas app.
- [x] Enable TypeScript strict checking. Add extra compiler flags only where useful to this app.
- [x] Install Tailwind through its current Vite integration and define Atlas visual theme tokens. Use CSS where clearer for illustration.
- [x] Add a simple app shell with Start here, Explore, and What changed. Empty or fixture states must be honest; do not imply live synchronization.
- [x] Add only the content boundaries needed now. Keep facts separate from presentation without a generic content engine; T001 adds its scene.
- [x] Set up direct hash links and browser back for static hosting. T001 adds activity/case routes. Verify the chosen routing mode through a static HTTP preview.

### Step 5 — Quality gates

- [x] Configure Prettier and ESLint for this TypeScript/React app. Start with useful rules and project patterns; avoid broad test-file exemptions.
- [x] Add scripts for development, format checking, linting, type checking, unit testing, browser testing, and production build.
- [x] Add CI for format, lint, type check, tests that exist, and build. Give workflows minimum permissions, timeouts, and branch concurrency control.
- [x] Review shipped dependency and asset licenses. The current runtime dependencies are MIT licensed; no third-party art is shipped.

### Step 6 — Test foundation

- [x] Configure Vitest for content and helper behavior. Foundation tests verify stable destination IDs, paths, and honest state; T001 adds activity/case and fixture/history assertions.
- [x] Configure Playwright and cover the available shell routes, direct links, Back, and unavailable state. T001 adds the real browser learning loop.
- [x] Cover keyboard operation, visible focus, narrow layouts, and reduced motion as those controls are implemented.
- [x] Do not use a coverage threshold as a substitute for verifying the visual explanation. The first feature task supplies its behavior assertions.

### Step 7 — Local development and security

- [x] Start the dev server on loopback by default. Keep raw source briefs, private project material, and secrets out of browser-served files and build output.
- [x] Treat Vite client environment variables as public. The app needs none, so no `.env.example` is added.
- [x] Use accessible controls and real text for labels and rules. The foundation uses authored CSS shapes rather than full-screen mockup images.
- [x] Check provenance and rights for artwork, fonts, and other assets before shipping. The retained images are design references and are not bundled.

### Step 8 — Developer experience

- [x] Create concise `AGENTS.md` after scripts and app shape exist. Include the architecture boundary, verified commands, test conventions, source-evidence rules, and distinction between the skill and app.
- [x] Keep one agent guidance file and npm scripts; neither `CLAUDE.md` nor a Makefile is needed for this build.
- [x] Expand the root `README.md` with verified setup, development, testing, and build steps.

## Phase 2 — Verify the bootstrap

### Step 9 — Validation and smoke test

- [x] On a clean `npm ci`, run format check, lint, type check, Vitest, Playwright shell tests, and the production build.
- [x] Start the dev server and confirm the app loads, its three destinations are reachable, and direct links/back work.
- [x] Preview the production build through HTTP and confirm it renders with hash routing.
- [x] Check build output for raw source briefs, private reference material, secrets, and other unintended files.
- [x] Stop the local server and report the checks that passed or failed.

### Step 10 — First pull request

- [x] Open one bootstrap PR from `chore/t000-project-bootstrap` once the GitHub repository exists. Use title `chore: bootstrap Atlas frontend`.
- [x] Describe the repository foundation, frontend tooling, verification, and known gaps. Keep illustrated feature behavior out of this PR.
- [x] Verify the configured `verify` CI check passes before merging.

## T001 — delivered first feature after bootstrap

T001 delivered one illustrated, clearly labelled booking fixture from the design context: Start here → feature → select a case → inspect its reason → compare the 48-hour and 24-hour versions → return. The app performs no real booking. The fixture and browser checks establish the implemented learning loop, not real-source accuracy or the v0.10 data platform. Evaluate comprehension and enjoyment against real use later. Create and test the independent `fill-atlas` skill on authorized real source evidence separately.

## T002 — verified platform transition

Root guidance and ignore rules now describe the implemented NestJS/SQLite architecture. `.local/` was ignored before runtime data creation. See [the T002 outcome](roadmap/tasks.md#outcome-boundaries) and [technical acceptance checks](context/technical/TECHNICAL.md#9-first-build-tests-and-acceptance).

Verified on 2026-09-25: `npm run validate` passed 31 unit/integration tests, 16 browser tests, frontend/backend builds, artifact checks, and production restart/shutdown. A separate fresh copy passed `npm ci`, builds and production smoke. Independent review findings for dynamic case/art/actor reads, failed-start cleanup and maintenance beyond 100 projects were reproduced and fixed with regression tests. Dependency audit reported zero vulnerabilities; remote CI jobs are configured but have not been run on a pushed branch.

- [x] Align root guidance and ignore rules, then add one small local NestJS backend, shared strict versioned Zod contracts, tracked SQL migrations, and SQLite under ignored `.local/`; keep source interpretation outside the backend.
- [x] Seed the labelled booking fixture through the same validated API used for later updates; migrate current UI reads without losing the T001 learning loop.
- [x] Enforce scoped IDs and references, foreign keys on every connection, supported scenes/assets, revision conflicts, parameterized SQL, bounded requests, and all-or-nothing writes.
- [x] Serve only registered assets through controlled routes; keep the database/private files out of static output. Restrict local API access and reject unrelated-site writes with an explicit local write credential.
- [x] Verify persistence after restart, data migrations, backup and restore of the database plus assets, history/current consistency, partial-update preservation, and rejected-write rollback.
- [x] Add backend unit/integration and browser tests, extend CI and build/runtime checks, and update root `README.md`, `AGENTS.md`, and `.gitignore` to describe the implemented architecture.

### Configuration, API contract, and runtime

- [x] Document local configuration in `.env.example` with safe defaults and fake placeholders. Keep app, migration, test, and CI settings consistent; document local write-credential setup without committing or exposing the credential to the frontend bundle.
- [x] Give each checkout/worktree its own `.local/atlas.sqlite`, assets, and configurable frontend/backend ports. Keep proxy settings aligned and prevent tests or parallel checkouts from sharing a live database.
- [x] Document versioned request/response schemas, error responses, revision-conflict behavior, and working read/write examples for agents. Keep examples checked against the shared contracts; a separate Swagger installation is not required.
- [x] Add a readiness endpoint that checks database availability and schema compatibility without exposing private details. Add useful structured logs with private content and credentials redacted, enable Nest shutdown hooks, and close database handles and listeners cleanly.
- [x] Test upgrades from a nonempty earlier schema: preserve saved projects, reject incompatible database versions with a clear error, and document backup/restore recovery before applying migrations.

### Testing and clean-start verification

- [x] Use Vitest for validation, rule, and helper contracts. Run integration tests against isolated temporary SQLite files using the production database binding and migrations; cover project isolation, transactions, rollback, partial updates, history, restart persistence, and database-plus-assets backup/restore.
- [x] Add Supertest coverage against an initialized Nest HTTP application backed by real temporary SQLite storage. Exercise reads, valid updates, invalid/scoped references, stale revisions, access restrictions, and rejected writes without replacing persistence with mocks.
- [x] Extend Playwright through the frontend → backend → SQLite path while preserving navigation, keyboard, focus, narrow-layout, and reduced-motion checks. Establish the test setup in T002; T003 must prove two different saved projects and an updated rule in one unchanged frontend/backend build.
- [x] Provide one npm validation command covering formatting, linting, type checking, unit/integration/API tests, browser tests, and frontend/backend builds. Keep security audits and any future container-image verification in separate CI jobs; do not add arbitrary coverage thresholds or broad lint exemptions.
- [x] From a fresh checkout, follow documented setup, initialize/migrate storage, build and start both production applications, verify readiness and real API/browser behavior, then stop them. Confirm no stale listeners or background processes remain and no private data appears in build output.

### Maintenance and open-source readiness

- [x] Add automated secret scanning and a separate dependency-vulnerability CI check. Configure scheduled dependency and GitHub Actions updates with a manageable cadence; review compatibility instead of blindly upgrading every package to latest.
- [x] Recorded the public source repository, all-rights-reserved status and runtime dependency license review; original artwork and system fonts are documented, and private data/design references are excluded from frontend artifacts. The owner must decide licensing before an open-source release or artifact distribution; T002 does not grant a license.

### Deferred Docker packaging

SQLite runs inside the backend process, so the initial integration suite uses real temporary database files without Docker or Testcontainers. Do not add PostgreSQL, Redis, queues, monorepo tooling, or container infrastructure solely to match the generic bootstrap.

If container distribution is selected later, add a dedicated packaging checklist and CI job covering image build, production startup/readiness, persistent database-and-asset storage, restart persistence, writable-volume permissions, and clean shutdown. Keep images free of private `.local/` data and secrets. Keep image verification separate from routine npm validation; registry publishing requires an explicit distribution decision. Use Testcontainers when a real containerized dependency or container-runtime test needs it.

T003 then proves a second project and changed rule in the same unchanged build. T004 validates the independent skill outside this repository, and T005 evaluates verified source knowledge through the API.
