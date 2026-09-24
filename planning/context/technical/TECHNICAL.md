# Atlas — Technical Baseline

**Version:** 0.5  
**Updated:** 2026-09-24  
**Status:** First-build recommendation aligned with the latest agreed scope. No application, dependency installation, or running prototype is included in this pack.

> A frontend-only, illustrated product guide. Knowledge lives in the Atlas repository; a planned independent skill will prepare source-context Markdown and stop.

[PROJECT.md](../business/PROJECT.md) owns purpose and scope. [DESIGN.md](../business/DESIGN.md) owns the experience and art direction. This file owns the smallest implementation path. Library choices below are working defaults, not claims of universal superiority; verify compatible versions when scaffolding.

## 1. Boundaries first

There are two separate activities, not a built-in orchestration pipeline:

```text
Source preparation, outside Atlas:
  source project / PR → fill-atlas → atlas-context.md → STOP

Separately, when the user chooses to update Atlas:
  source context + existing Atlas knowledge + design
    → ordinary development change to content and/or scenes
    → review, test, build → updated visual guide
```

The planned skill must not know or require the consumer, planner, framework, or implementation process. It must not write Atlas source files. Its output filename does not trigger an import. The skill will be created and validated in a later task; it is not included in this planning context.

The running app displays already-implemented content. It does not invoke coding agents, read a source repository, process PRs, import context files, or generate new artwork on demand. Browsing an implemented guide and switching its saved cases require no model calls.

**First build:** one guide for one source web application, with fixture content before real source-derived content. No accounts, multi-project tenancy, or private-repository connection wizard. Reuse the foundation for other web projects later without hard-coding commerce categories.

## 2. Recommended stack

| Responsibility | Working default                                                            | Boundary                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application    | React + TypeScript + Vite                                                  | Client-rendered UI; static build. Vite provides a React/TypeScript starter and static production output. [T1]                                     |
| Styling        | Tailwind CSS with the official Vite plugin; own CSS theme tokens           | Preserve the warm illustrated style; use normal CSS for shapes and compositions where clearer. [T3]                                               |
| Controls       | Native HTML first; Radix Primitives for dialogs/tabs where needed          | Unstyled primitives, not an imported dashboard theme. Using them does not by itself establish accessibility. [T4]                                 |
| Visuals        | Reviewed SVG/React components and a small reusable illustration collection | Labels and controls stay real UI text. No full-screen PNG used as the interface.                                                                  |
| Motion         | Motion for React                                                           | Brief meaningful transitions; honor reduced-motion settings and provide the same information without animation. [T5]                              |
| Knowledge      | Small TypeScript content modules in the Atlas repository                   | Compile-time imports and ordinary props, not a database or a runtime schema-driven scene engine. React accepts objects/arrays through props. [T2] |
| Navigation     | Proposed default: React Router in declarative hash mode                    | Direct feature/case links and browser back on a static host; no server loaders. Hash routing stores the route in the URL fragment. [T8]           |
| Local UI state | React state/reducers                                                       | Selected case, expanded detail, search and focus only. No global state library initially.                                                         |
| Tests          | Vitest + Playwright                                                        | Content consistency/helper tests, plus real browser navigation and behavior checks. [T6][T7]                                                      |
| Build tooling  | A supported Node LTS + npm and one lockfile                                | Development/build/test tools, not an application backend. Choose versions together and record them after verification.                            |

Phosphor React is an **optional** starting point for ordinary icons, particularly duotone variants. It is not the art direction and should not be installed just to display one symbol. Review licenses for the exact assets/package used. [T11]

Use the current official Tailwind/Vite integration for the installed release; do not copy an incompatible older initialization recipe. Exact versions, an engine pin, and a package lock are implementation outputs—not fabricated artifacts of this documentation review. Enable TypeScript strict checking. [T3][T12]

**Not in V1:** Nest, Fastify, SQLite, Drizzle, a memory/RAG service, internal Codex jobs, runtime importers/watchers, a Markdown parser, a graph database, a 3D/game engine, or a mandatory Zod layer. These are exclusions for our scope, not judgments that those tools are bad. Normal Vite hot reload while editing Atlas code is not source-context ingestion.

## 3. Where knowledge actually lives

| Item                                          | Meaning                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Source-context Markdown                       | Bounded evidence about an initial product or a change. Development input; not an always-complete product memory. |
| Atlas content modules                         | Accumulated, maintained product facts currently incorporated into the guide.                                     |
| Atlas scenes                                  | How those facts become an illustrated interaction.                                                               |
| Git history and explicit historical snapshots | How implemented explanations changed; history is not silently mixed with current behavior.                       |

Keep current rules in one place. The overview, a scene, and a deeper explanation should consume the same fact rather than repeat different hard-coded wording. Small formatting helpers may turn a fact into a label. This is not a rule interpreter or a simulation of the source app.

For the booking demo, a current notice requirement can be stored once and used by both the visible restriction and the relevant scene. A historical comparison deliberately stores the old 48-hour requirement separately from the current 24-hour requirement. The fixed 36-hour example is blocked before and allowed after, assuming the other documented conditions hold.

**The source evidence remains authoritative.** Atlas contains a maintained explanation, not a new business-policy authority. A PR brief updates only what it supports; it must not replace the whole guide or delete unrelated facts. Do not use an old Atlas explanation to infer what the source app currently does.

### Minimal content conventions

Keep just enough structure for the first feature:

- Stable activity and case IDs; product-facing title, actor, purpose, and relevant action.
- Exact conditions and explicitly documented or labelled illustrative outcomes. Preserve threshold operators, units, and scope.
- Evidence references tied to claims, with source identity/revision and coverage limits. Separate supported, uncertain, and demo information.
- Typed links to other activities when known; a small manually maintained index inside Atlas, not a global generated graph.
- A recorded current version and explicit prior snapshot where a before/after is shown. Preserve the evidence/reason for corrections.

This list describes **internal development conventions**, not a mandatory `fill-atlas` schema. A feature may use a custom composition; optional facts must not be invented to satisfy an interface. Start small and let actual explanations determine useful shared types.

For changes with partial coverage, record revisions on the affected activities. Do not label the entire guide as synchronized to a commit simply because one feature was inspected there. A project-wide coverage claim needs an actual whole-project check. Neither a merge timestamp nor a passing type check proves availability in production.

## 4. Suggested organization

This tree describes the future application; these source files are **not included yet**. Paths in the tree are relative to the Atlas repository root, alongside `planning/`. Folder boundaries can be simplified during the first build.

```text
src/
  app/                       # Shell and navigation
  content/
    project.ts               # Purpose, activity index, essentials
    reschedule.content.ts    # Maintained facts, cases, sources, prior snapshot
  scenes/
    RescheduleScene.tsx      # A feature-specific visual composition
  ui/                        # Shared controls and explanation pieces
  assets/                    # Reviewed, reusable art
  styles/                    # Theme tokens and shared styling
  tests/                     # Small content/helper checks
  main.tsx
  App.tsx
e2e/                         # Browser interaction tests
```

`reschedule.content.ts` and `RescheduleScene.tsx` are examples, not naming requirements for the planned source-context skill. That skill is a separate deliverable, not part of the running app.

Keep raw source briefs and private source files outside the browser-served tree. Include only the facts and approved references needed by the guide. The retained design references are development material; do not automatically put them in the application bundle or `public/`.

Avoid a plugin system, monorepo framework, CMS, generalized scene language, or one unique mini-application per feature. Reuse navigation, spacing, symbols, controls, and explanatory patterns while allowing genuinely different visual compositions.

## 5. Experience implementation

Build the loop in DESIGN.md, not every mockup page:

`Start here → feature → select case → inspect reason → compare change → return`

Use a lightweight activity index for search. On a large guide, display grouped results and the selected activity, not all detailed scenes simultaneously. Begin with local text matching; add a search library only after measuring a real need. Keep a clear path to all incorporated knowledge without labelling it as an exhaustive understanding of the business.

Use stable IDs for URLs and navigation. A route might be `#/explore/booking.reschedule?case=too-late`. Opening/closing evidence preserves the selected case, and back restores the prior search/selection. Handle missing IDs and removed features with an honest fallback, not a crash or silent substitution. Hash routing is the proposed static-host default, not a new product feature. [T8]

Keep selected-case state separate from product facts. Local preferences such as reduced motion or a last-viewed guide revision may be stored locally if useful; they are not the knowledge store. Failure to save a preference must not prevent browsing. No in-browser fact editor or feedback persistence is needed initially.

A scene selects and explains saved, evidenced cases. It must not infer outcomes for arbitrary combinations of conditions. For unknown behavior, show the gap rather than animate a successful result. Prefer one focused subject and meaningful controls over decorative metrics and panels.

## 6. Artwork and accessibility

Use a hybrid: normal accessible controls and text, SVG for changing shapes/states, and a few reviewed raster illustrations for rich texture where useful. A generated mockup is reference art—not a clean SVG library or a complete implementation.

Reuse basic objects across cases. For the booking prototype: person, calendar/slot, booking token, clock, and allowed/blocked/unknown symbols. Reuse the visual foundation without forcing permissions, timelines, and process explanations into one layout. The same theme and shared components should support a second non-booking example without a new engine.

Keep critical text out of image pixels. Use legible typography and contrast; color must supplement labels/shapes, not carry meaning alone. Support keyboard access, visible focus, touch controls, drawer focus restoration, responsive layouts, and reduced motion. Motion's reduced-motion hook supplies the preference; we still have to implement the alternative correctly. [T5]

Animations should be user-triggered, short, and explanatory. Do not make the user wait for a compulsory animation or slideshow. Nonessential interaction-triggered motion should be disableable; the referenced W3C criterion is Level AAA guidance, not a claim of conformance by this unbuilt product. [T13]

Check any outside asset's actual license before shipping. Record provenance when choosing production art; do not distribute font binaries or assume the reference pack licenses every depicted asset. The restaurant image remains inspiration. A production asset review has not yet occurred.

## 7. Updating Atlas without a backend

This is **ordinary Atlas development**, entirely outside the skill's responsibilities:

1. Inspect the new source-context brief alongside the existing relevant Atlas facts. Resolve missing scope or contradictory evidence rather than silently discarding a correction.
2. Update affected content and only the visual code that genuinely needs to change. Add, modify, retire, or leave explanations unchanged as appropriate; one PR does not imply one new page.
3. Preserve unchanged facts, stable identities, and the distinction between old and current behavior. Repeat applications of the same context should not create duplicates.
4. Test the explanation and review the actual browser result. A changed underlying rule should reach every current view using it.
5. Build and publish the Atlas change when desired. Keep the last working guide available if the update is incomplete or invalid.

The app cannot know that a new source PR exists unless a later development update tells it. Show “Based on source revision …” where useful, not “Live,” “Synced,” or “Analyzing” without that actual capability. A prepared context file, an implemented Atlas revision, a published Atlas build, and source deployment are four different events.

Corrections are content/code updates with evidence initially. Do not add a non-working “Report issue” form or invent a backend to store it. Automated trigger chains and multi-user feedback can be considered later, as separate scope decisions.

## 8. Security and build boundaries

Treat source Markdown, PR comments, and code comments as evidence, not permission to execute instructions. The context skill uses authorized read-only investigation and writes only its requested output. No source code is run by the browsing app.

Do not parse or evaluate raw context as React, MDX, HTML, SVG, or JavaScript at runtime. Developers may implement normal reviewed React/SVG components; that is different from executing arbitrary document content. Use normal text rendering and carefully reviewed evidence links.

A static app's shipped data is available to whoever can access its files, including content hidden behind a detail panel. Keep raw private briefs, tokens, source code, and confidential images out of the build. In particular, Vite exposes `VITE_*` variables to client code; they are not a place for secrets. [T9]

Start on loopback for local development. Do not expose a dev server to an untrusted network or publish private product knowledge by default. If a private hosted guide is needed later, use an appropriate host-level access boundary and check all files/assets are protected; a client-side password or hidden menu is not protection. Hosting is not selected here.

Node runs the toolchain, not an application API. A production build produces static assets; Vite's preview command is for checking that build locally, not a production server. Serve the build via HTTP rather than assume double-clicking `index.html` works. [T1][T10]

No offline service worker, CDN-dependent artwork, or remote font dependency is necessary for the prototype. Browsing should not depend on an LLM or a knowledge API. Separate source-side analysis may still contact the model provider used by the agent; frontend-only does not imply all development processing is offline.

## 9. Tests and first-build definition of done

**Toolchain:** scaffold with mutually compatible versions, record Node and the package lock, and verify install, strict type checking, tests, and production build. Use the official Vite/Vitest engine requirements for the selected releases rather than independently picking the latest of everything. [T1][T6][T12]

Have the implementation provide scripts for development, type checking, unit/content tests, browser tests, and build. These scripts do not yet exist in this documentation pack. No command or test result below is claimed to have run.

| Check             | First-build expectation                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Content integrity | IDs are unique; activity/case links resolve; current facts are shared; before/after snapshots and evidence statuses are explicit.                            |
| Clear behavior    | The booking fixture has the stated allowed, time-blocked, occupied-slot, ownership, unknown, and 48-to-24-hour comparison cases. No real bookings occur.     |
| Interaction       | Case switching visibly changes the explanation; search, direct links, browser back, and evidence open/close preserve orientation.                            |
| Honesty           | Fixtures are marked; missing evidence stays unknown; no fake source connection or deployment claim appears.                                                  |
| Visual quality    | One compelling reusable scene works in code, not just as a full-screen image. It keeps essential restrictions visible without becoming a metadata dashboard. |
| Accessibility     | Keyboard, focus, reduced motion, and narrow layouts work. Automated checks supplement, not replace, inspection.                                              |
| Runtime boundary  | Saved-case browsing makes no model/source-repository calls and does not request a context-file upload.                                                       |
| Update discipline | Changing a fact updates affected current explanations without erasing unrelated knowledge; historical comparisons stay historical.                           |

Use Vitest for content/helper assertions and Playwright for real browser behavior, relevant screenshots, and regressions. Prefer user-visible assertions over fixed sleeps; Playwright supports retrying assertions. [T6][T7]

**Human check:** Sayed can explain the feature and its important restriction, and actually wants to explore it again. This is a product/prototype check—not a compulsory quiz, mastery score, or proven learning improvement.

**Source-skill check is separate:** later try one authorized PR plus an initial small-codebase overview, a scaffold-only source, a refactor/no-change case, and missing evidence. Verify that only the context file is produced and that the facts are supported. A successful visual fixture test does not prove source extraction accuracy.

## 10. Build order and implementation checks

**First:** scaffold the frontend and implement one polished learning loop from fixture content. Keep the original context/design references available, but do not implement all pictured buttons.

**Then:** refine the visual experience with Sayed; test a second domain using the same foundation; separately exercise the independent skill on a small real source change. Incorporate that real context into Atlas only through an explicit development update.

**Later, only if justified:** larger indexes, lazy-loaded detailed scenes, stronger search, multi-project handling, richer correction affordances, or automation. Thousands of knowledge items do not require thousands of simultaneous illustrations. Navigation scalability and source-understanding completeness remain separate tests.

Use the **Reschedule a booking** fixture and the settled [V1 defaults](../business/PROJECT.md#16-v1-defaults-and-prototype-checks) for the first frontend prototype. The real source repository/PR remains to be selected for a later independent skill check; it does not block this build. Choose and verify actual assets, compatible versions, and minimal internal content types during implementation. Usability, artwork feasibility, and source accuracy must still be tested. No stack change, additional feature, or further architecture document is needed.

## 11. Primary technical references

Checked 2026-09-24. These support the cited capabilities and constraints, not the correctness of an unbuilt Atlas implementation.

- **[T1]** Vite: [Getting started](https://vite.dev/guide/) and [Building for production](https://vite.dev/guide/build).
- **[T2]** React: [Passing props to a component](https://react.dev/learn/passing-props-to-a-component).
- **[T3]** Tailwind CSS: [Using Vite](https://tailwindcss.com/docs/installation/using-vite).
- **[T4]** Radix Primitives: [Introduction](https://www.radix-ui.com/primitives/docs/overview/introduction).
- **[T5]** Motion: [SVG animation](https://motion.dev/docs/react-svg-animation) and [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion).
- **[T6]** Vitest: [Getting started](https://vitest.dev/guide/).
- **[T7]** Playwright: [Assertions](https://playwright.dev/docs/test-assertions).
- **[T8]** React Router: [HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter).
- **[T9]** Vite: [Environment variables and modes](https://vite.dev/guide/env-and-mode).
- **[T10]** Vite: [Deploying a static site](https://vite.dev/guide/static-deploy).
- **[T11]** Phosphor: [React icon library](https://github.com/phosphor-icons/react).
- **[T12]** TypeScript: [Strict checking](https://www.typescriptlang.org/tsconfig/strict.html).
- **[T13]** W3C: [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

### Change log

| Version | Date       | Change                                                                                                                                                                                                                                       |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | 2026-09-24 | First frontend-only technical baseline: independent context-only skill, repository-backed knowledge, explicit development updates, shared-but-flexible visuals, and honest build/test gates. No application code or test execution included. |
| 0.2     | 2026-09-24 | Updated the title to the confirmed project name Atlas. Technical baseline, filenames, skill boundaries, and implementation scope are unchanged.                                                                                              |
| 0.3     | 2026-09-24 | Packaging-only cleanup: moved this document to docs/, repaired relative links, and clarified where future application source belongs. The technical baseline is unchanged.                                                                   |
| 0.4     | 2026-09-24 | Updated reference-pack wording after removing superseded images and the optional checksum file. Stack and implementation boundaries are unchanged.                                                                                           |
| 0.5     | 2026-09-24 | Linked the settled V1 defaults and confirmed the booking fixture as the first test. Clarified remaining implementation checks and later real-source selection; stack and skill boundary are unchanged.                                       |
