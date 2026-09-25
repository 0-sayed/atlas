# Atlas — Technical Baseline

**Version:** 0.6\
**Updated:** 2026-09-24\
**Status:** v0.10 target architecture. The static React frontend and booking learning loop are delivered; the local backend, SQLite database, and validated data API remain to be implemented.

> One reusable visual application. One local SQLite database for all projects. Ordinary backend validation before saving. The context-only skill stays independent.

[PROJECT.md](../business/PROJECT.md) owns scope; [DESIGN.md](../business/DESIGN.md) owns the visual experience. This file replaces the earlier frontend-only baseline. The storage/runtime boundary follows Sayed's latest clarification; library and folder choices below are implementation recommendations, not claims that the new backend or storage libraries are installed or benchmarked.

## 1. The architecture in one minute

```text
Independent source preparation:
  source project / PR → fill-atlas → atlas-context.md → STOP

Separately, when the user chooses to update a project:
  agent reads context + existing project data
    → submits data to Atlas's local API
    → backend checks it and saves one SQLite transaction

Browsing:
  React interface → the same local API → SQLite + registered assets
```

The backend is normal application code, not another agent, planner, analysis job, or separate “writer” service. It does not convert free-form context Markdown into facts. The separate agent prepares a structured request using the application's documented contract; that contract does not belong in `fill-atlas`.

JSON is the request/response encoding, not a second authoritative store. There are no saved per-project JSON documents to keep synchronized. The running guide never executes source-context instructions or calls an LLM to open a feature or switch a saved case.

**Adding projects and changing facts, supported scene settings, or project assets must work without rebuilding Atlas.** Adding a genuinely new reusable interaction component still requires a normal application release. Project data never contains executable React or an unrestricted scene program.

## 2. Small stack to implement

| Responsibility | First-build recommendation |
|---|---|
| Visual frontend | React + TypeScript + Vite; retain the existing illustrated direction. [T1] |
| Styling | Tailwind CSS, own theme tokens, and ordinary CSS where clearer. [T2] |
| Controls and motion | Native controls first; Radix where needed; SVG/React illustrations and Motion for meaningful transitions. [T3][T4] |
| Local backend | Node.js + a small NestJS app using its normal HTTP adapter. No microservices, CQRS, or worker platform. Nest supports request validation and serving a built frontend. [T5] |
| Database | SQLite, with `better-sqlite3` as the suggested Node binding. Use prepared statements and tracked SQL migrations; an ORM is not required for this first schema. [T6][T7] |
| Input contract | Versioned Zod schemas shared as code between API/tests and any preparation helper; infer TypeScript types. Validate every write at the backend boundary. [T8] |
| Navigation | React Router; retain hash routing initially if convenient. Include project, feature, and case identity in routes. [T9] |
| Tests | Vitest for schema/helpers and small database integration tests; Playwright for the running app/API learning loop. Use the test setup supported by the scaffold for Nest-specific integration wiring. [T10][T11] |
| Toolchain | A mutually compatible supported Node LTS and package versions, npm, one lockfile, strict TypeScript. Pin these after installation checks, not from guesses. |

NestJS, the SQLite binding, and Zod are defaults to implement, not a claim that Sayed separately approved every library. Keep one backend process; all database access goes through its small data module. Do not add Fastify, Drizzle, Prisma, or a second validator without an actual need. With the installed Nest release, use its supported schema-validation pipe or a small Zod pipe; do not duplicate all rules in decorator DTOs. [T5][T8]

**Not in V1:** PostgreSQL/MongoDB, Redis/queues, vector or graph databases, an AI memory service, source watchers/webhooks, internal Codex jobs, a Markdown-to-data AI service, a drag-and-drop editor, arbitrary plugins, real-time collaboration, or full 3D.

## 3. Where everything lives

```text
atlas/
  planning/context/         # Business and technical documents; business/references/ holds design images
  planning/roadmap/         # Task graph and dependencies
  .agents/skills/fill-atlas/     # standalone source-context skill and template; not app runtime
  src/                      # Frontend, reusable scenes, shared artwork
  server/                   # Local API, checks, database access
  shared/                   # Request/response and scene-setting schemas/types
  migrations/               # Tracked, reviewed SQL schema changes
  fixtures/                 # Harmless demo seeds, not live private project truth
  .gitignore                # Excludes .local/ and build/dependency output
  .local/                   # Created at runtime; NOT tracked or statically served
    atlas.sqlite            # ONE database, containing ALL saved projects
    assets/                 # Registered project-specific image files
    backups/                # Private local backups, if produced
```

The `src/` frontend already exists. `server/`, `shared/`, `migrations/`, `fixtures/`, and `.local/` illustrate the T002 target and are not delivered folders. No additional nested repo, one database per project, or `projects/<name>/project.json` hierarchy is needed.

SQLite stores the primary database in a file; journaling modes can create sidecar files. Ignore the whole `.local/` directory, not only `atlas.sqlite`. Git-ignore does not remove files already tracked, encrypt data, or create backups. [T6][T12]

Store all project knowledge and visual settings in the database. Image bytes may remain in `.local/assets/`; the database owns their IDs, relative storage keys, project association, media types, and provenance. Shared licensed icons/illustrations shipped with Atlas are application assets, not private project data. Keep private files out of Vite's `public/`, frontend imports, and build artifacts. [T13]

## 4. Minimal data model and constraints

Use ordinary SQL tables for projects, features/activities, saved cases, typed relationships, registered assets, and revision/change history. Keep identities and links explicit. A project owns its facts, essential-activity ordering, themes, and scene settings. A feature owns or references its supported rules and evidence. Do not create a table for every descriptive noun just to appear rigorous.

Stable project-scoped IDs and foreign keys should protect links between records. Cases, relations, assets, and every API query must retain project scope. A relation between two existing features in *different* projects must be rejected, not accepted because both IDs happen to exist. Enforce this with project-scoped keys/constraints where possible and backend checks where needed. Enable and verify `PRAGMA foreign_keys = ON` on **every connection**, before transactions. [T14]

Nested rule details, saved examples, or scene settings can use strictly validated serialized fields where that keeps the schema small. Such a field is still inside SQLite, not a parallel project JSON file. Persist primary identities and relationship endpoints as columns so references remain checkable. Exact columns belong in the first migration and its tests.

Preserve the following distinctions:

- **Current facts versus history:** reference current rule values from scenes; before/after deliberately retains a labelled prior snapshot.
- **Atlas revision versus source revision:** a successful Atlas save increments a project-data revision. It does not prove the entire source product was examined at that commit or deployed.
- **Evidence versus format validity:** important claims carry source identity, inspected revision/scope, evidence, and supported/uncertain/demo status. Valid fields do not prove true business rules.
- **Partial update versus replacement:** omitted features remain unchanged. Removing/retiring behavior is explicit; a brief about one PR cannot replace the whole project.

SQLite supports transactions, but only one write transaction can proceed at a time. Keep writes brief and bounded. This is appropriate for a local user and sequential agent updates; do not promise unlimited concurrent writers or migrate based on feature count alone. [T15][T16]

## 5. What “the backend validates” means

These are ordinary request/service checks inside the same backend, not another deployed program:

1. **Parse the request:** enforce the supported contract version, bounded sizes, required fields, correct types, and unexpected-field rejection. Use Zod strict schemas. [T8]
2. **Check meaning-independent integrity:** allowed scene kinds/settings, unique stable IDs, asset references, same-project links, and consistent references between scenes, facts, and cases.
3. **Check the target revision:** the caller supplies the current revision it read. Recheck that revision and database-dependent conditions inside the write transaction. Reject stale updates instead of silently overwriting newer data.
4. **Save together:** apply the scoped batch, related history, and revision increment in one transaction. On an error, roll back all database changes. Do not run agent/model calls inside the transaction. [T15]
5. **Respond honestly:** return saved IDs/revision or useful field/conflict errors. A rejected write must not produce a success badge, duplicate features, or a partial new guide.

Requests contain data only, never SQL strings. Use prepared parameterized statements in the backend. Small create/read/apply-update endpoints are enough; do not expose a generic SQL console or filesystem API. The agent reads the actual contract/schema and examples before submitting a change, then corrects errors if needed. Those examples are not instructions added to the context-only skill. [T7]

The implemented API should let an agent list/select/create projects, read relevant current data/revision, register assets when necessary, and submit a scoped batch of changes. Exact routes are implementation details. No separate API-spec Markdown file is required; keep the contract in tested code and concise usage examples.

Stable IDs prevent duplicate features. Reapplying an already-used stale revision can simply return a conflict; elaborate retry/event infrastructure is unnecessary. The frontend should also reject incompatible response/scene versions rather than render arbitrary data, but it must not be the only validation boundary.

**Limits:** backend validation protects the normal API path, not against a person or agent with unrestricted filesystem access editing the DB directly. Keep direct DB writes outside the ordinary workflow. Neither Zod nor SQL constraints verifies business truth; source review remains necessary.

## 6. Dynamic visuals without a generic game engine

Keep a small code-owned registry of reviewed explanation patterns: illustrated walkthrough, recorded-case comparison, timeline, compact permission comparison, and a scoped relationship treatment as needed. Implement only the patterns needed by the first demo, then extend through normal code review.

Each saved feature binds a supported scene kind/version to its facts, cases, illustrations, and permitted layout/theme options. This is how the booking project and another project can look different without shipping different Atlas applications. Scene code renders facts; it does not duplicate thresholds or infer unknown outcomes. The overview and deeper view consume the same current data.

A saved configuration cannot invent a new renderer. Reject unknown kinds during writes; use a clear compatibility error if an older app encounters newer saved data. Do not store/evaluate arbitrary JSX, JavaScript, MDX, raw HTML/SVG markup, CSS programs, or expressions inside project records. Trusted shared SVG components are application code, not uploaded instructions.

Project-specific art may be PNG/WebP/JPEG initially; simple dynamic elements use the shared reviewed vector components. Support SVG uploads only with a deliberate sanitization/content-security strategy, not by injecting raw markup. Asset references resolve through controlled backend handlers by ID, not arbitrary filesystem paths. Missing art should preserve a readable explanation, not fabricate a subject.

Keep the warm 2D/2.5D style, a few reusable assets, real readable labels, keyboard/focus support, reduced-motion alternatives, and precise restrictions. A database does not justify turning the interface into an admin dashboard. Labels are not baked into paintings. [T4]

## 7. Loading, updates, and project selection

Use a small project picker, then Start here / Explore / What changed within that project. Routes can be `#/projects/<id>/explore/<feature>?case=<case>`; they are local navigation links, not automatically shareable project exports.

The frontend fetches project-scoped summaries and selected feature data from the local API. Keep loaded UI state separate from persistent knowledge. Cache keys include project and revision identity; do not show the previous project's facts while the next project loads. Use bounded lists and queries for larger catalogs rather than rendering every scene simultaneously.

After an external agent saves a valid update, an explicit Refresh/refetch is sufficient for V1. No polling or push infrastructure is needed. A selected scene and its evidence must use one coherent revision. Read a complete feature response consistently; do not mix current rules with old cases from separate cached responses. Database commit does not imply an already-open browser has refetched.

Handle no projects, an empty project, loading, missing features, partial evidence, unknown outcomes, backend failure, and rejected writes distinctly. Retain last-loaded content on a request failure where possible, labelled as such. There is no source scanner, live source-sync status, or compulsory context upload form.

## 8. Privacy, assets, and backups

**Local first:** bind the backend and development UI to loopback. Use one application origin when serving the built frontend; development can proxy the API. Nest can serve the compiled frontend, but `.local/` must never be mounted as a static directory. A static frontend host alone cannot replace the database/API runtime. [T5]

Protect the local API from unrelated websites: restrict Host/Origin handling, do not use permissive CORS, and require an explicit local credential for writes (a small local token, not a user-account system). Do not bake credentials into the frontend build, put them in URLs, or log sensitive payloads. CORS alone is not authorization; tests must cover cross-origin write rejection. Exact local credential delivery can be implemented alongside the first API without creating a cloud identity platform. [T17]

Assets are served only through allowlisted routes with project/asset validation, safe relative paths, known file types, and traversal/symlink escape checks. Do not offer the raw database, source code, arbitrary local files, or unregistered images as public downloads. Vite's client environment variables and static public assets are not secret storage. [T13]

The user owns the local machine; Git-ignore and loopback are not encrypted storage or multi-user authorization. Hosted sharing requires a separate access-control/deployment decision. Open-source code can remain separate from private `.local/` data; select a project license before public release, not as part of this documentation edit.

**Back up the database plus its registered assets.** Use the SQLite/binding backup facility or a clean shutdown procedure; do not copy only an active database file and assume journal/sidecar consistency. Track numbered schema migrations and test them against an existing nonempty database. SQLite's backup facilities support consistent database snapshots. [T7][T18]

Database transactions do not include filesystem writes. For a new image, stage and verify the file before committing its reference. Failed transactions may leave an unreferenced file for cleanup, but must not leave a visible row pointing to an incomplete upload. Take coordinated backups with writes paused for the simple V1; preserve asset files referenced by historical scenes. A private backup outside the working directory is useful protection against deleting the entire repo. Test restoration before relying on the data.

Do not share the whole multi-project database to share one selected project. A selective share/export mechanism and public-link service are deferred, not silently promised as already implemented.

## 9. First-build tests and acceptance

Implement tests before considering this a working platform; the current static booking tests cover only the delivered frontend behavior, not these database-backed acceptance checks.

| Check | Required first-build result |
|---|---|
| Storage | Creating and updating a project persists after backend restart. Migrations preserve existing data; backup/restore recovers the database and assets. |
| Strict writes | Invalid shape, unknown scene, broken/cross-project references, stale revision, and disallowed asset paths are rejected. Failed batches leave the previous state intact. |
| Data/code separation | The same unchanged built frontend/backend displays two saved projects; adding a project or editing a rule does not rebuild application code. |
| Shared facts/history | A current rule change reaches its current views; a saved historical comparison retains the earlier value. Partial context leaves unrelated facts unchanged. |
| Booking behavior | Labelled fixture covers allowed, time-blocked, occupied-slot, ownership, unknown, and the 48-to-24-hour change at 36 hours remaining. No real booking is made. |
| Visual experience | One inviting interactive explanation works in code; essential restrictions stay visible and different cases visibly explain consequences. |
| Navigation | Project switching, search, direct links, back, case selection, and evidence drawers preserve correct scope and orientation. |
| Accessibility | Keyboard, focus, reduced motion, contrast, and narrow layouts work; automated checks supplement actual inspection. |
| Runtime boundary | Ordinary browsing makes no model or source-repository calls. The context skill does not call Atlas or write its database. |
| Privacy | `.local/` is ignored and absent from build output; DB and private source paths are not served. Unrelated website writes fail. |

Use temporary isolated SQLite files for tests; never point test resets at the user's `.local/atlas.sqlite`. Use real database constraints in integrity tests, not mocks alone. Playwright checks the learning loop against the running local app. Retain the verified frontend toolchain; pin compatible backend dependencies and verify install, type-check, unit/integration tests, browser tests, and build. Do not copy hypothetical commands as though scripts already exist. [T10][T11]

**Human check:** Sayed can explain the feature's purpose and important restriction and wants to revisit it. This is not an in-app quiz or a proven learning metric.

**Source-skill check is separate:** test one authorized PR, an initial small app, scaffolding-only scope, a refactor with no behavior change, and missing evidence. Verify context-only output and factual support. Rendering demo data cannot establish source-analysis accuracy.

## 10. Build order and remaining choices

1. Migrate the delivered frontend and booking fixture to a minimal backend/database/schema path. Seed the labelled demo through that validated path and replace compiled fixture reads.
2. Preserve and adapt the delivered learning loop. Add a second small, differently composed demo project and change a rule through the API. Verify no-rebuild behavior and project separation.
3. Review the experience with Sayed, then separately exercise `fill-atlas` on real authorized evidence and use the result for a real validated data update. Check an addition, a changed/removed behavior, and a refactor/no-change case.

Choose compatible package versions, exact columns, supported scene props, and real assets during implementation. These are not reasons for another planning round. The real source repo and publication license can be selected before their respective tests/releases; they do not block a local seeded prototype.

Keep public hosting, collaboration, universal scene generation, large legacy discovery, export UI, heavier search, and high-write-concurrency infrastructure for a demonstrated need. One shared SQLite file does not mean unlimited writers or cloud multi-tenancy. It does satisfy the current local, reusable-project design without a separate DB server. [T16]

## 11. Primary technical references

New storage/backend/validation references were checked during this revision on 2026-09-24; the existing frontend documentation links are retained as implementation references. They support capabilities and constraints, not claims that Atlas has been built or tested.

- **[T1]** [Vite guide](https://vite.dev/guide/) and [production build](https://vite.dev/guide/build).
- **[T2]** [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite).
- **[T3]** [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction).
- **[T4]** Motion: [SVG animation](https://motion.dev/docs/react-svg-animation) and [reduced motion](https://motion.dev/docs/react-use-reduced-motion).
- **[T5]** NestJS: [validation pipes](https://docs.nestjs.com/pipes) and [serving a frontend](https://docs.nestjs.com/recipes/serve-static).
- **[T6]** SQLite: [single-file database](https://sqlite.org/onefile.html).
- **[T7]** [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) and its [API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md).
- **[T8]** Zod: [schema API](https://zod.dev/api) and [parsing](https://zod.dev/basics).
- **[T9]** [React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter).
- **[T10]** [Vitest](https://vitest.dev/guide/).
- **[T11]** [Playwright assertions](https://playwright.dev/docs/test-assertions).
- **[T12]** [Git-ignore behavior](https://git-scm.com/docs/gitignore).
- **[T13]** Vite: [assets](https://vite.dev/guide/assets) and [client environment variables](https://vite.dev/guide/env-and-mode).
- **[T14]** [SQLite foreign-key enforcement](https://sqlite.org/foreignkeys.html).
- **[T15]** [SQLite transactions](https://sqlite.org/transactional.html).
- **[T16]** [SQLite deployment fit and writer limits](https://sqlite.org/whentouse.html).
- **[T17]** [OWASP cross-site request forgery prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- **[T18]** [SQLite backup API](https://sqlite.org/backup.html).

### Change log

| Version | Date | Change |
|---|---|---|
| 0.1–0.5 | 2026-09-24 | Earlier frontend-only/code-bundled knowledge baseline and subsequent naming/packaging/default refinements. **Superseded**, not parallel instructions to implement. |
| 0.6 | 2026-09-24 | One Git-ignored SQLite database, local backend validation, project-scoped data and assets, data-driven reusable scenes, and no-rebuild updates. Preserved independent context-only skill and visual direction; added integrity/privacy/restore test gates. No application tests claimed. |
