# Atlas — Technical Baseline and Proposed Guide Model

**Version:** 0.7\
**Updated:** 2026-09-28\
**Status:** Current implementation reconciled with the proposed full-guide direction. The proposed model and sequence below are for owner review; they are not an executable implementation plan or a claim of delivered behavior.

[PROJECT.md](../business/PROJECT.md) owns product scope and the seven destinations. [DESIGN.md](../business/DESIGN.md) owns their visual behavior. This document states the implemented technical boundary, then the smallest data and renderer extensions that appear necessary to support that direction.

For concrete Penpot boards, components and token lookup, use the [design reference](../design-reference.md). Design changes do not automatically update application code.

## 1. The architecture in one minute

```text
Authorized source → independent fill-atlas → reviewed context Markdown → stop
Reviewed context + selected Atlas project → separate update-atlas workflow
  → local versioned API → validated SQLite transaction → explicit browser refresh
React guide → local API → SQLite and registered assets
```

`fill-atlas` records source facts only. `update-atlas` prepares a scoped write after scene-fit and evidence review. The NestJS API validates and persists it; the browsing app does not analyze source, execute a model, or run either skill. JSON is the API encoding, while SQLite is the authoritative project store. A validated data update can change saved knowledge without rebuilding Atlas. A new interaction or contract capability still needs an application release.

**Implemented today:** One React/TypeScript/Vite client with hash-based React Router navigation; a loopback NestJS API on its Express adapter; one SQLite database through `better-sqlite3`; tracked SQL migrations; shared strict version-1 Zod contracts; project-scoped features, cases, relations, registered raster assets, and immutable revision snapshots. Booking, approval, and navigation are the only accepted scene kinds, all at scene version 1. The frontend has their explicit code-owned scene helpers and components. Normal storage starts empty; fixtures are labelled demo data and stay outside browser runtime imports.

**Proposed:** A domain-neutral, versioned authored-activity scene and first-class supporting records for the complete guide. Neither exists in the current write contract or renderer. The current visual foundation and two-screen proof do not establish that all seven destinations work or that arbitrary web-product behavior fits the three existing scenes.

## 2. Stack and dependency decisions

| Concern | Implemented baseline and proposed limit |
|---|---|
| Client | React, TypeScript, Vite, React Router `HashRouter`, Tailwind CSS and ordinary CSS. Keep the existing illustrated Atlas style and scene components. [T1][T2][T9] |
| Server | One NestJS process on Express, with local API checks and optional built-client serving. No new service tier is needed for authored knowledge. [T5] |
| Persistence | `better-sqlite3`, prepared SQL and tracked migrations in `migrations/`; no ORM, Redis, queue or graph database justified by this change. [T6][T7][T16] |
| Contracts | Strict shared Zod schemas and TypeScript types in `shared/`, with backend validation and version checks. [T8] |
| Interaction | Native controls, visible focus, and reduced-motion-safe behavior. Radix is a candidate only for a complex widget that needs it; Radix and shadcn are not installed baselines. [T3][T4] |
| Art/navigation | Existing code-owned SVG/React illustrations and registered PNG/JPEG/WebP. `react-zoom-pan-pinch` is a candidate for a bounded map interaction check, not a selected or installed dependency. |
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

**Current contract:** A project has a stable ID, title, revision, up to 100 features and 200 relations. Each feature contains its scene-specific payload, actor/purpose, one evidence object, case list, optional group/essential order/presentation, and asset IDs. Relations have project-scoped stable endpoints and only `requires` or `related` meaning. The SQLite schema stores projects, features, cases, relations, assets, feature-asset links and revision snapshots. Its SQL migrations are tracked. Those are current facts, not a sufficient model for every activity in a large web app.

**Proposed record set for the seven destinations:**

| Record or binding | Purpose |
|---|---|
| Project | Stable identity, title and optional evidenced purpose; absent purpose stays absent. |
| Activity and authored scene | Stable project-scoped feature identity, purpose, versioned scene selection, ordered observable steps, actors involved, explicit conditions, recorded cases and their outcome **and reason**. A case is a cited observation/example, not an executable simulation or universal rule program. |
| Actor and participation | Identifiable person/system entries and scoped links to activities/steps. Do not infer permissions from participation. |
| Rule/condition | A stable, searchable condition with precise authored meaning, applicability and affected activities/cases; preserve exact operators, thresholds and units where applicable. Preserve unknown or configuration-dependent values; do not duplicate a changed rule as conflicting prose across views. |
| Journey | Authored goal and ordered references to existing activities/steps, with supported cautions. Do not derive journeys from dependency links. |
| Relationship | Stable typed, evidenced links with an explicit meaning and scope. Keep current `requires`/`related`; introduce further kinds only where an actual source distinction and renderer treatment warrant them. Decorative paths carry no relationship claim. |
| Glossary term | Saved definition, scope, evidence and references to relevant records. |
| Domain/group and essentials | Optional grouping and curated Start Here ordering. No universal taxonomy, island count, or fabricated usage score. |
| Evidence and history | Source identity, inspected revision/scope, status and precise source reference for each meaningful claim or shared record; immutable Atlas revision snapshots and classified changes. |

Evidence at one feature level is too coarse when steps, conditions, actors, journeys, terms, and cases can have different support. Give each meaningful claim or shared record evidence identifiers and scoped references to inspected paths, symbols, documents or verified sources. Preserve `supported`, `uncertain` and `demo` distinctions; record source revision separately from Atlas revision. A valid schema cannot establish source truth or production deployment.

Use stable project-scoped IDs and check cross-record references within the same project. Store primary identities and relationship endpoints in checkable columns; use strictly validated serialized detail only where it keeps the schema small. Do not turn every noun into a table or accept arbitrary JSON as a user interface specification. The exact next SQL shape belongs to the reviewed contract/migration work. Foreign keys remain enabled per connection. [T14]

## 5. What “the backend validates” means

The existing API parses strict version-1 requests, rejects unknown scene kinds and malformed or cross-project references, checks the expected Atlas revision, and writes the scoped change plus history in one transaction. Omitted features remain unchanged; explicit removals are required. An upsert replaces the full named feature, so callers must read and preserve unmodified fields. Failed batches roll back. Stored history gives a previous value only when that value was actually saved; it is not a reconstruction from a new context brief. [T8][T15]

The proposed contract must keep those guarantees for new activities and records: bound text and collection sizes; unique project-scoped IDs; typed references; no orphaned steps, rules, case evidence or relationships; supported scene/version combinations; exact source/status fields; and transactionally consistent current data, history and revision. Classify added, changed, removed, evidence-only and no-behavior-change results deliberately. A source change or a new inspected commit alone must not create a behavior change entry. Existing version-1 documents must remain readable after migration, including their optional presentation and historical snapshots. A conversion may add optional structure, but it must not silently reinterpret a booking threshold, an approval decision, a navigation outcome, or prior evidence.

The API should advertise the **actual accepted scene kinds, scene versions, contract extensions and presentation options** through a read-only supported-capabilities response. `GET /ready` returning `contractVersion: 1` only proves readiness for that contract; it does not prove a particular scene or optional presentation extension is accepted. `update-atlas` must inspect advertised support before preparing a write, and its portable API/art references and contract tests must change in the same task as the server contract. Never use a normal project write as a capability probe. Keep unsupported source behavior as an explicit renderer gap, not a forced navigation case.

Requests contain data, never SQL, JSX, arbitrary expressions or executable scene programs. Backend validation protects the normal API boundary; it does not make unreviewed source claims true. [T7]

## 6. Dynamic visuals without a generic game engine

The proposed authored-activity scene is a **reviewed, versioned composition** for a finite activity with recorded actors, steps, conditions, cases, outcome and reason. Its renderer can change a selected recorded case, highlight applicable steps/conditions and show the recorded consequence. It must not evaluate an arbitrary rule tree, invent an unrecorded outcome, fetch live product state, or generate UI from arbitrary JSON. Booking/approval/navigation can stay as existing specialized version-1 scenes; shared facts may become reusable records when migration and exact source meaning support that change.

Start Here uses curated essentials or honestly labelled unprioritized content. Feature Map groups and searches all recorded activities, with selective local relationships and stable routes. User Journeys follow authored order. Actors, Rules and Glossary read their own saved records and links. Recent Changes reads classified snapshot differences and opens the affected current or historical explanation. One record can appear in several destinations without conflicting copies of its facts. A new visual treatment is code-owned, reviewed, versioned and explicitly advertised before the portable updater may target it.

Project data can select supported art and accent choices and refer to registered images, but cannot provide JSX, JavaScript, MDX, HTML, raw SVG, CSS or unrestricted layout. Native controls and semantic text carry the meaning; art remains decorative or explanatory. Implement the packaged Penpot desktop style in the two-screen proof while preserving existing functional behavior. Tablet/mobile refinements are deferred while retaining the present usable responsive baseline. Add map pan/zoom only after a bounded interaction and accessibility check demonstrates that it helps; a package name alone does not establish the design. [T3][T4]

## 7. Loading, updates, and project selection

The current client selects a saved project, reads it through the API, and uses project-scoped hash routes, direct feature/case links and browser Back. Current views cover Start Here, Explore/feature detail and Changes. The proposed full guide keeps one stable seven-destination frame within a chosen project: Start Here, Feature Map, User Journeys, Actors, Rules, Glossary and Recent Changes. Feature-local tabs and filters do not become extra project destinations. Empty destinations need truthful states, not placeholder claims of completion.

A browser view must use one coherent loaded Atlas revision for its facts, cases, evidence and links. A successful API write needs a refetch/Refresh before an open browser reflects it; there is no live source sync. Preserve project/feature/case identity in navigation and cache state so switching projects cannot show stale content from another project. Handle empty storage, empty or partial projects, unknown outcomes, missing assets, retired features and API failure distinctly. Routes should remain directly loadable and Back should restore orientation.

The current document cap of 100 features and full-project reads/history are acceptable as a present constraint, not as a large-project answer. The desktop delivery roadmap targets a future test dataset of at least 160 features, above that cap; this fixture is not implemented yet. Before raising limits, create and measure that fixture through contract validation, storage read/write, history size, search and browser rendering. Then choose bounded page/section reads, targeted history, grouping and selective relationship expansion based on the measured bottleneck. Preserve complete reachability and revision consistency while avoiding a giant rendered graph. Do not add Redis, an ORM, vector search or separate databases ahead of that evidence. [T16]

## 8. Privacy, assets, and backups

The existing server binds loopback, checks Host/Origin, denies cross-site requests, requires a local write token and serves only registered images. Keep those checks with any new endpoints and never place the token in the frontend build, URL or logs. Private source context and assets remain outside `public/` and build artifacts. A static frontend host alone cannot serve the local knowledge store. [T5][T13][T17]

Back up SQLite **and** registered asset files. A database transaction does not include filesystem writes, so stage/verify an image before committing its registration and clean unreferenced leftovers separately. Before changing migrations, test a nonempty upgrade and backup/restore with the real SQLite binding, including version-1 documents and their history; a fresh empty database test is insufficient. Preserve historical asset references and reject incompatible future schema versions. [T7][T18]

The repository is public but all rights reserved; private local knowledge and credentials are not release artifacts. License choice and hosted sharing remain owner decisions, not consequences of this document.

## 9. First-build tests and acceptance

The existing platform and scenes have unit, API, storage and Playwright coverage. A future branch is ready only after the repository-required `format:check`, `lint`, `typecheck`, `test:unit`, `test:e2e` and `build` gates pass; the `validate` script also runs artifact and production restart/shutdown checks. Use temporary storage and the real production SQLite binding for backend integration tests. Do not infer source-product accuracy or owner approval from passing tests.

For the proposed expansion, test strict scene/version and capabilities discovery, legacy version-1 reads and nonempty migration/restore, cross-project reference rejection, stale revision and rollback, and exact classification of behavioral versus evidence-only changes. Test the authored case against its recorded outcome/reason and source reference without building a parallel rules engine. Browser checks should cover each implemented destination, direct links and Back, project isolation, selectable cases, keyboard focus and reduced motion. A large labelled fixture should exercise the 160+ feature boundary and measured read/history behavior. Check three genuinely distinct domains, including at least two authorized real-source contexts; use a clearly labelled synthetic domain only if needed to expose a renderer boundary. These are future acceptance targets, not results already observed.

## 10. Build order and remaining choices

The proposed sequence for owner review is:

1. **T007 — local Penpot design handoff:** preserve the approved native file at ignored `.local/design/atlas.penpot`. Record its identity, relevant boards and missing-file retrieval in the [design reference](../design-reference.md). Extract assets only as required by implementation tasks; no generated gallery or full export prerequisite.
2. **T008 — two-screen visual proof:** review the illustrated Start Here and one activity explanation in the current shared frame before expanding the guide.
3. **T009 — models, capabilities and authoring:** design and test the versioned authored-activity scene, supporting records, evidence granularity, migration and capabilities response; update `update-atlas` references/tests with the same contract change.
4. **T010 — desktop views and map:** implement the remaining seven-destination views, grouped map and relevant relationship exploration against saved data.
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
