# Atlas — Technical Baseline and Guide Model

**Version:** 0.9\
**Updated:** 2026-10-01\
**Status:** T009 and T010 implementation merged in PR #13 (`f7bc975`). Contract v2, schema 4, authored activities, capabilities, six desktop destinations and the interactive map are delivered. T011 real-source/cross-domain desktop acceptance and T005 human evaluation remain open.

[PROJECT.md](../business/PROJECT.md) owns product scope and the six destinations. [DESIGN.md](../business/DESIGN.md) owns their visual behavior. This document records the implemented technical boundary and remaining acceptance work.

For concrete Penpot boards, components and token lookup, use the [design reference](../design-reference.md). Design changes do not automatically update application code.

## 1. The architecture in one minute

```text
Authorized source → independent fill-atlas → reviewed context Markdown → stop
Reviewed context + selected Atlas project → separate update-atlas workflow
  → local versioned API → validated SQLite transaction → explicit browser refresh
React guide → local API → SQLite and registered assets
```

`fill-atlas` records source facts only. `update-atlas` prepares a scoped write after scene-fit and evidence review. The NestJS API validates and persists it; the browsing app does not analyze source, execute a model, or run either skill. JSON is the API encoding, while SQLite is the authoritative project store. A validated data update can change saved knowledge without rebuilding Atlas. A new interaction or contract capability still needs an application release.

**Implemented today:** One React/TypeScript/Vite client with hash-based React Router navigation; a loopback NestJS API on Express; one SQLite database through `better-sqlite3`; tracked migrations through schema 4; strict Zod read contract v2 and version-1/version-2 writes. Booking, approval, navigation and authored scenes are accepted at scene version 1. Authored scenes require contract v2. Explicit purpose, actors, rules, areas, journeys, glossary, evidence and typed relationships support six desktop destinations. Normal storage starts empty; fixtures remain outside browser runtime imports.

**Remaining acceptance:** T011 must establish the required three-domain reuse, two authorized real-source contexts and broader desktop/source review. The delivered finite scene set does not guarantee arbitrary web-product coverage. T005 human understanding and voluntary return remain separate.

## 2. Stack and dependency decisions

| Concern | Implemented baseline and boundary |
|---|---|
| Client | React, TypeScript, Vite, React Router `HashRouter`, Tailwind CSS and ordinary CSS. Keep the existing illustrated Atlas style and scene components. [T1][T2][T9] |
| Server | One NestJS process on Express, with local API checks and optional built-client serving. No new service tier is needed for authored knowledge. [T5] |
| Persistence | `better-sqlite3`, prepared SQL and tracked migrations in `migrations/`; no ORM, Redis, queue or graph database justified by this change. [T6][T7][T16] |
| Contracts | Strict shared Zod schemas and TypeScript types in `shared/`, with backend validation and version checks. [T8] |
| Interaction | Native controls, visible focus, and reduced-motion-safe behavior. Radix is a candidate only for a complex widget that needs it; Radix and shadcn are not installed baselines. [T3][T4] |
| Art/navigation | Approved Penpot-derived PNG artwork and SVG icons, bundled font roles and registered raster art. Pinned `react-zoom-pan-pinch` 4.2.0 handles map camera transforms; application code owns grouping, nodes, routes and minimap coordinates. |
| Verification | Vitest for contracts, pure helpers and real SQLite/API behavior; Playwright for navigation and interaction. Run repository-required gates before claiming a branch ready. [T10][T11] |

The current package versions and lockfile, rather than this document, are the source for installed versions. Keep the established `src/components/`, `src/pages/`, `src/scenes/`, `src/content/`, `shared/`, and `server/` boundaries. Add a boundary only when real behavior needs one. No generic content engine, new framework, separate writer service, schema-generated UI, or per-project frontend build is implied.

## 3. Where everything lives

| Path | Role |
|---|---|
| `planning/` | Development context and roadmap; its raw briefs and reference images are not app assets. |
| `.agents/skills/fill-atlas/` | Independent source-context Markdown skill. |
| `.agents/skills/update-atlas/` | Separate portable workflow for reviewed API incorporation; its reference and tests must evolve with advertised API capabilities. |
| `src/content/`, `src/components/`, `src/pages/`, `src/scenes/` | API loading and pure view helpers; presentation and explicit interactions. |
| `shared/` | Strict versioned contracts, typed relationships and pure scene helpers. |
| `server/`, `migrations/` | Local API, SQLite access, registered-asset handling and tracked SQL changes. |
| `fixtures/` | Isolated demo and tests only; never imported into browser runtime. |
| `.local/` | Ignored private SQLite data, registered assets and optional backups. |

One database contains all projects. Assets have project-scoped registrations; raw storage directories are never statically served. `.env` and `.local/` remain private and ignored. Git-ignore is not encryption or a backup. [T12][T13]

## 4. Minimal data model and constraints

**Current contract:** A project has a stable ID, title and revision. `shared/limits.ts` bounds the normalized document at 500 features, 2,000 relationships, 2,000 evidence records, 1,000 records per supporting collection and 200 assets. Writes allow 100 features, 200 relationships and 100 records per supporting collection per request. Requests are limited to 2 MiB; ordinary current documents to 8 MiB. A narrowly checked legacy-only document can retain the former 256 MiB readability allowance. Each feature has a strict scene-specific payload, cases, evidence, optional bindings/presentation and registered asset IDs. Relationship kinds are `requires`, `related`, `blocks` and `triggers`. Schema 4 stores supporting knowledge with the project while keeping existing feature/asset tables; shared validation enforces scoped references.

**Implemented record set for the six destinations:**

| Record or binding | Purpose |
|---|---|
| Project | Stable identity, title and optional evidenced purpose; absent purpose stays absent. |
| Activity and authored scene | Stable project-scoped feature identity, purpose, versioned scene selection, ordered observable steps, actors involved, explicit conditions, recorded cases and their outcome with an optional reason. A case is a cited observation/example, not an executable simulation or universal rule program. |
| Actor and participation | Identifiable person/system entries and scoped links to activities/steps. Do not infer permissions from participation. |
| Rule/condition | A stable, searchable condition with precise authored meaning, applicability and affected activities/cases; preserve exact operators, thresholds and units where applicable. Preserve unknown or configuration-dependent values; do not duplicate a changed rule as conflicting prose across views. |
| Journey | Authored goal and ordered references to existing activities/steps, with supported cautions. Do not derive journeys from dependency links. |
| Relationship | Stable typed, evidenced links with an explicit meaning and scope. Keep current `requires`/`related`; introduce further kinds only where an actual source distinction and renderer treatment warrant them. Decorative paths carry no relationship claim. |
| Glossary term | Saved definition, scope, evidence and references to relevant records. |
| Domain/group and essentials | Optional grouping and curated Start Here ordering. No universal taxonomy, island count, or fabricated usage score. |
| Evidence | Source identity, inspected revision/scope, status and precise source reference for each meaningful claim or shared record. |

Contract v2 binds steps, actors, conditions, journeys, terms and cases to scoped evidence records. Preserve `supported`, `uncertain`, `demo` and `conflicting` statuses, and record source revision separately from Atlas revision. A valid schema cannot establish source truth or deployment.

Keep stable scoped IDs and same-project reference checks. Schema 4 persists supporting records as strictly validated project knowledge; feature identities and relationship endpoints retain their existing relational tables. Do not accept arbitrary JSON as an interface specification. Foreign keys remain enabled per connection. [T14]

## 5. What “the backend validates” means

The API parses strict version-1/version-2 requests, rejects unknown scene kinds and malformed or cross-project references, checks the expected Atlas revision, and writes the scoped current update in one transaction. Omitted records remain unchanged; explicit removals are required. An upsert replaces the full named record, so callers must preserve unmodified fields. Failed batches roll back. [T8][T15]

Contract v2 enforces bounded text/collections, unique scoped IDs, valid references, supported scene/version combinations and transactionally consistent current data. Nonempty upgrade and backup/restore tests cover legacy current knowledge, registered assets and revision preservation. A source commit alone never changes the guide; a conversion must not reinterpret recorded rules or evidence.

`GET /api/v1/capabilities` advertises accepted scenes/versions, contracts, records, relationships, visuals and limits. `GET /api/v1/ready` reports read contract version 2; readiness alone does not establish scene support. The portable `update-atlas` preflight checks advertised capabilities, validates payload support and projected document capacity before writes. Its independently copied workflow is tested against an isolated API. Keep unsupported behavior as a renderer gap, never a fabricated navigation case.

Requests contain data, never SQL, JSX, arbitrary expressions or executable scene programs. Backend validation protects the normal API boundary; it does not make unreviewed source claims true. [T7]

## 6. Dynamic visuals without a generic game engine

The authored-activity scene is a finite, versioned composition of saved actors, steps, conditions, cases and outcomes. Selecting a recorded case shows its recorded conditions, outcome, optional reason and evidence, including unknown/conflicting states. It does not evaluate arbitrary rule programs or fetch live source state. Booking, approval and navigation retain specialized version-1 scenes.

Start Here uses curated essentials or honestly labelled unprioritized content. Feature Map groups and searches all recorded activities, with selective local relationships and stable routes. User Journeys follow authored order. Actors, Rules and Glossary read their own saved records and links. One record can appear in several destinations without conflicting copies of its facts. A new visual treatment is code-owned, reviewed, versioned and explicitly advertised before the portable updater may target it.

Project data can select supported art and accent choices and refer to registered images, but cannot provide JSX, JavaScript, MDX, HTML, raw SVG, CSS or unrestricted layout. Native controls and semantic text carry the meaning; art remains decorative or explanatory. T008 delivered the packaged Penpot desktop style in the owner-accepted two-screen proof while preserving functional behavior. T010 delivered map pan/zoom with bounded keyboard, focus and reduced-motion checks; a package name alone does not establish the design. T011 retains broader desktop/source acceptance. Tablet/mobile refinements are deferred while retaining the present usable responsive baseline. [T3][T4]

## 7. Loading, updates, and project selection

The client reads the selected project through the API and supports Start Here, Feature Map, User Journeys, Actors, Rules and Glossary, plus project-scoped feature/case details and browser Back. Filters and local section controls do not add project destinations. Missing records have honest empty states; project switching isolates selection/search/camera state.

A browser view must use one coherent loaded Atlas revision for its facts, cases, evidence and links. A successful API write needs a refetch/Refresh before an open browser reflects it; there is no live source sync. Preserve project/feature/case identity in navigation and cache state so switching projects cannot show stale content from another project. Handle empty storage, empty or partial projects, unknown outcomes, missing assets, retired features and API failure distinctly. Routes should remain directly loadable and Back should restore orientation.

The reader uses bounded full-project documents, stable grouping and selective map detail. Isolated capacity and browser tests exercise 160 activities through API persistence, rendering, search, keyboard and camera interactions. The normalized project cap is 500 features; legacy compatibility has its own checked byte boundary. This is bounded capacity evidence, not a benchmark for arbitrary large repositories. Keep QA datasets outside the single owner showcase; add infrastructure only for a measured bottleneck. [T16]

## 8. Privacy, assets, and backups

The existing server binds loopback, checks Host/Origin, denies cross-site requests, requires a local write token and serves only registered images. Keep those checks with any new endpoints and never place the token in the frontend build, URL or logs. Private source context and assets remain outside `public/` and build artifacts. A static frontend host alone cannot serve the local knowledge store. [T5][T13][T17]

Back up SQLite **and** registered asset files. A database transaction does not include filesystem writes, so stage/verify an image before committing its registration and clean unreferenced leftovers separately. Before changing migrations, test a nonempty upgrade and backup/restore with the real SQLite binding, including version-1 current documents; a fresh empty database test is insufficient. Reject incompatible future schema versions. [T7][T18]

The repository is public but all rights reserved; private local knowledge and credentials are not release artifacts. License choice and hosted sharing remain owner decisions, not consequences of this document.

## 9. First-build tests and acceptance

The existing platform and scenes have unit, API, storage and Playwright coverage. A future branch is ready only after the repository-required `format:check`, `lint`, `typecheck`, `test:unit`, `test:e2e` and `build` gates pass; the `validate` script also runs artifact and production restart/shutdown checks. Use temporary storage and the real production SQLite binding for backend integration tests. Do not infer source-product accuracy or owner approval from passing tests.

PR #13's recorded full validation passed 86 unit/API tests and 71 Chromium tests, covering contracts/capabilities, copied preflight, nonempty upgrades/restore, scoped references, revision conflicts/rollback, six destinations, direct links/Back, recorded cases, keyboard/reduced motion and 160-feature map behavior. Preserve these regressions. T011 still needs three genuinely distinct domains, at least two authorized reviewed real-source contexts, broader desktop/source review and end-to-end authoring effort. Synthetic fixtures cannot establish those outcomes.

## 10. Build order and remaining choices

Delivered milestones and remaining acceptance are:

1. **T007 — local Penpot design handoff:** preserve the approved native file at ignored `.local/design/atlas.penpot`. Record its identity, relevant boards and missing-file retrieval in the [design reference](../design-reference.md). Extract assets only as required by implementation tasks; no generated gallery or full export prerequisite.
2. **T008 — two-screen visual proof (complete):** illustrated Start Here and one activity explanation are merged at `0681fef` and accepted by the owner on 2026-09-30. See [validation](../delivery-evidence.md#t008--desktop-visual-proof).
3. **T009 — models, capabilities and authoring (merged):** contract v2, schema 4, authored scenes, supporting records and capability-aware portable authoring delivered in PR #13.
4. **T010 — desktop views and map (merged):** six destinations, current source details and the interactive grouped map delivered in PR #13.
5. **T011 — cross-domain verification:** test three distinct domains, at least two based on authorized real-source evidence, and size/accessibility behavior; keep synthetic examples labelled.

This is a dependency outline, not authorization to implement all five tasks or a substitute for reviewed task specs. Exact schemas, evidence references, migration steps and measured capacity budgets belong in the scoped implementation plans within these boundaries; owner review evaluates visual results and consequential scope changes. Desktop is the design priority; preserve today's responsive baseline while full tablet/mobile design is deferred. No real source should be inferred from fixtures or old Atlas content.

## 11. Primary technical references

These primary references explain relevant technology constraints; they do not prove an Atlas feature is installed, tested or accepted. Existing links are retained. Motion is a historical reference, not a selected new dependency; use the existing reduced-motion-safe presentation unless a demonstrated interaction needs more.

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
| 0.1–0.5 | 2026-09-24 | Earlier frontend-only/code-bundled baseline. Superseded. |
| 0.6 | 2026-09-24 | Proposed local SQLite/API platform and project-scoped data. |
| 0.7 | 2026-09-28 | Reconciled implemented platform and three current scenes; scoped proposed authored activities, seven-view records, evidence, capability discovery, migration, size checks and T007–T011 sequence for review. |
| 0.8 | 2026-09-29 | Set the six-destination current-state contract: no product-history API or saved comparisons; revision conflicts, transactional updates, current data, and backup/restore remain required. |
| 0.9 | 2026-10-01 | Recorded PR #13's delivered contract v2, schema 4, four scenes, capability preflight, six destinations, map and bounded capacity; T011 and T005 remain open. |

### T010 map camera integration decision — 2026-09-30

Adopt pinned `react-zoom-pan-pinch` 4.2.0 for transient camera transforms only. Before installation, an isolated Chromium probe using the packed distribution checked 160 nodes, background dragging versus node clicks, keyboard pan and off-screen focus, Fit/viewport-minimap agreement, reduced-motion zero-duration transforms and 160-character labels. All checks passed after removing unconditional focus re-centering (it could swallow a pointer click) and fitting long-label row height. The app owns derived grouping/layout, URL selection, accessible text and minimap coordinates; the dependency owns gesture/transform mechanics. Neither camera nor layout writes knowledge revisions. The final map adds the same checks against saved API data. Official API reference: [maintainer repository](https://github.com/BetterTyped/react-zoom-pan-pinch).
