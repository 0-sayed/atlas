# Atlas Project Bootstrap Checklist

Bootstrap establishes the repository, planning workflow, and runnable frontend foundation. It does not implement Atlas's first illustrated feature. That belongs in the first feature task.

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

`roadmap/tasks.md` has one `Task Graph` table with a row per task: status, priority, task ID/title, size (`S`, `M`, or `L`), branch, dependencies, and context references. Lower priority numbers break ties among unblocked tasks; dependencies determine what is blocked. `roadmap/dependencies.mmd` is the Mermaid task DAG. Do not add fixed execution waves.

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

## Phase 1 — Frontend foundation

### Step 4 — Runtime and project shape

Atlas V1 is one static, client-rendered React application. Maintained product facts live in small TypeScript content modules; scenes present those facts. A later, separate `fill-atlas` skill will produce standalone source-context Markdown and stop. The browser does not import that file, scan repositories, call an LLM, or require a backend.

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

## First feature after bootstrap

Build one illustrated, clearly labelled booking fixture from the design context: Start here → feature → select a case → inspect its reason → compare the 48-hour and 24-hour versions → return. The app performs no real booking. Evaluate whether the explanation is clear and enjoyable before expanding the guide. Create and test the independent `fill-atlas` skill on authorized real source evidence separately; a successful fixture does not establish source accuracy.
