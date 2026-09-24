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

- [ ] Initialize Git and create a root `README.md` with the Atlas purpose and pointers to the planning context.
- [ ] Add `.gitignore` (including `.env`, build output, and dependencies), `.editorconfig`, and a license decision.
- [ ] Keep `planning/` in the repository root. Commit the foundation and planning files without application behavior.
- [ ] If using a remote repository, push `main`, confirm it matches the remote, register the planning folder with the chosen automation system, and run a dry run in which only bootstrap is runnable.

### Step 3 — Repository settings

- [ ] When GitHub is used, protect `main`: block deletion and force pushes; require a pull request, passing checks that actually exist, and resolved review conversations. Zero approvals is acceptable for a solo project.
- [ ] Enable automatic deletion of merged head branches if desired.

## Phase 1 — Frontend foundation

### Step 4 — Runtime and project shape

Atlas V1 is one static, client-rendered React application. Maintained product facts live in small TypeScript content modules; scenes present those facts. A later, separate `fill-atlas` skill will produce standalone source-context Markdown and stop. The browser does not import that file, scan repositories, call an LLM, or require a backend.

- [ ] Select mutually compatible supported Node and package versions; pin Node, use npm with one lockfile, and record the versions used.
- [ ] Scaffold React, TypeScript, and Vite at the repository root alongside `planning/`. Do not create a monorepo or nested Atlas app.
- [ ] Enable TypeScript strict checking. Add extra compiler flags only where useful to this app.
- [ ] Install Tailwind through its current Vite integration and define Atlas visual theme tokens. Use CSS where clearer for illustration.
- [ ] Add a simple app shell with Start here, Explore, and What changed. Empty or fixture states must be honest; do not imply live synchronization.
- [ ] Add only the content and scene boundaries needed for the first feature task. Keep facts separate from presentation without a generic content engine.
- [ ] Set up direct activity/case links and browser back for static hosting. Verify the chosen routing mode on the intended host.

### Step 5 — Quality gates

- [ ] Configure Prettier and ESLint for this TypeScript/React app. Start with useful rules and project patterns; avoid broad test-file exemptions.
- [ ] Add scripts for development, format checking, linting, type checking, unit testing, browser testing, and production build.
- [ ] Add CI for format, lint, type check, tests that exist, and build. Give workflows minimum permissions, timeouts, and branch concurrency control.
- [ ] Review shipped dependency and asset licenses. Do not add a blanket license ban without a product decision.

### Step 6 — Test foundation

- [ ] Configure Vitest for content and helper behavior. As those structures exist, verify stable activity/case IDs, resolved links, and explicit fixture/current/historical states.
- [ ] Configure Playwright for the real browser loop: Start here → feature → select a case → inspect its reason → compare a change → return.
- [ ] Cover keyboard operation, visible focus, narrow layouts, and reduced motion as those controls are implemented.
- [ ] Do not use a coverage threshold as a substitute for verifying the visual explanation. The first feature task supplies its behavior assertions.

### Step 7 — Local development and security

- [ ] Start the dev server on loopback by default. Keep raw source briefs, private project material, and secrets out of browser-served files and build output.
- [ ] Treat Vite client environment variables as public. Add `.env.example` only for variables the app actually needs, with fake values and clear comments.
- [ ] Use accessible controls and real text for labels and rules. Use reviewed SVG/React art and licensed assets rather than full-screen mockup images.
- [ ] Check provenance and rights for artwork, fonts, and other assets before shipping. The retained images are design references.

### Step 8 — Developer experience

- [ ] Create concise `AGENTS.md` after scripts and app shape exist. Include the architecture boundary, verified commands, test conventions, source-evidence rules, and distinction between the skill and app.
- [ ] If Claude Code is used, `CLAUDE.md` may import `AGENTS.md` to avoid duplicate instructions. Add a Makefile only if it simplifies real workflows.
- [ ] Expand the root `README.md` with verified setup, development, testing, and build steps.

## Phase 2 — Verify the bootstrap

### Step 9 — Validation and smoke test

- [ ] On a clean install, run format check, lint, type check, Vitest, and the production build. Browser behavior tests run when the first feature task provides an interaction to test.
- [ ] Start the dev server and confirm the app loads, its three destinations are reachable, and direct links/back work where implemented.
- [ ] Preview the production build through HTTP and confirm it renders with the selected static-host routing setup.
- [ ] Check build output for raw source briefs, private reference material, secrets, and other unintended files.
- [ ] Stop the local server and report the checks that passed or failed.

### Step 10 — First pull request

- [ ] Open one bootstrap PR from `chore/t000-project-bootstrap` once the GitHub repository exists. Use title `chore: bootstrap Atlas frontend`.
- [ ] Describe the repository foundation, frontend tooling, verification, and known gaps. Keep illustrated feature behavior out of this PR.
- [ ] Verify configured CI checks pass before merging.

## First feature after bootstrap

Build one illustrated, clearly labelled booking fixture from the design context: Start here → feature → select a case → inspect its reason → compare the 48-hour and 24-hour versions → return. The app performs no real booking. Evaluate whether the explanation is clear and enjoyable before expanding the guide. Create and test the independent `fill-atlas` skill on authorized real source evidence separately; a successful fixture does not establish source accuracy.
