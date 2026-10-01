# Start here: Atlas delivery context

**Updated:** 2026-10-01. Project context lives in `planning/context/`; `planning/roadmap/` contains the task list and dependency graph. T009 and T010 implementation merged in PR #13 (`f7bc975`). T011 cross-domain acceptance is next; T005 human evaluation remains open. Future implementation requires a separate task instruction.

## What we are building

Atlas explains reviewed behavior from different web projects through one illustrated application. The frame and visual language stay consistent; saved project knowledge supplies activities, actors, rules, journeys, terms, relationships, evidence, and supported artwork. Adding another supported project changes data, not frontend code. A finite set of renderers does not guarantee coverage of every possible web application.

The pipeline is source evidence → `fill-atlas` context → reviewed `update-atlas` incorporation → local API/SQLite → reusable frontend. The guide does not execute the source product's business actions or call an AI model at browse time.

## Read in this order

1. [Product requirements](context/business/PROJECT.md), especially MVP features and evaluation.
2. [Design specification](context/business/DESIGN.md) for shared composition and dynamic-content behavior, then [Penpot design reference](context/design-reference.md) for the approved local file, relevant boards, components and task mapping.
3. [Technical specification](context/technical/TECHNICAL.md), distinguishing implemented capabilities from targets.
4. [Desktop delivery brief](context/desktop-delivery.md), then [tasks](roadmap/tasks.md) and [dependencies](roadmap/dependencies.mmd).
5. [Delivery evidence](context/delivery-evidence.md) and any separately authorized implementation instructions. Read root `AGENTS.md` before editing.

For installation, local startup, the current API and backup/restore, use the [root README](../README.md); do not reconstruct operational steps from historical bootstrap checklists.

## Verified status, not inferred completion

| Work | Status at this refresh |
| --- | --- |
| T000–T004 | Delivered historical foundation; see task outcome records. |
| T005 | Runtime committed at `5be0184`. Isolated validation rerun on 2026-09-28 passed 44 unit/integration and 28 browser tests plus the remaining validation gates. Human understanding and voluntary return remain pending; task stays unchecked. |
| T006 | Visual/authoring foundation committed at `ac10c83`. Historical checks are recorded in [T006 validation](context/delivery-evidence.md#t006--shared-frame-and-authoring); these do not prove the final desktop design is implemented. |
| Penpot desktop/system | Designed and audited separately from the running application. The approved local native file is identified in the [design reference](context/design-reference.md). |
| T007 | Local native design handoff verified. See [validation](context/delivery-evidence.md#t007--native-design-handoff). |
| T008 | Implemented and merged via [PR #11](https://github.com/0-sayed/atlas/pull/11) (`0681fef`); owner accepted the running Start Here and feature explanation on 2026-09-30. See [validation](context/delivery-evidence.md#t008--desktop-visual-proof). |
| T009 | Authored contract v2, schema 4, capabilities and portable authoring delivered in [PR #13](https://github.com/0-sayed/atlas/pull/13). |
| T010 | Six desktop destinations, feature details and interactive map delivered in PR #13. Broad cross-domain visual acceptance remains T011. |
| T011 | Pending: three domains, at least two authorized real-source projects, one unchanged build, and desktop/source review. |

The merged implementation baseline is `f7bc975` on `main`; owner approval of T008's two-screen design remains separately recorded at `0681fef`. Check Git for later work before continuing. Earlier evidence describes dated snapshots.

## Decisions to carry forward

- Keep React/TypeScript/Vite/Router/Tailwind and one NestJS API with SQLite, `better-sqlite3`, tracked SQL migrations, and shared strict Zod schemas.
- Build Atlas components from the Penpot design system. Native controls first; use Radix primitives for complex focus/keyboard interactions when required. Neither Radix nor shadcn is currently installed; a shadcn baseline is not selected.
- Preserve the delivered bounded authored-activity scene and specialized scenes. Do not accept executable layouts or build a universal rules engine.
- The fixed six destinations read explicit saved current knowledge. Missing facts produce honest empty/gap states; a mockup never establishes a source fact.
- Desktop is the delivery focus. Mobile/tablet design expansion is deferred; preserve existing basic responsiveness, keyboard navigation, and reduced-motion behavior.
- Keep `fill-atlas` independent. Update API capabilities, `update-atlas` references, and their verification together when supported content expands.

## Before the next execution session

**T011 — same-build and authoring acceptance — is next. T009 and T010 are merged; do not restart them.** Use `.local/design/atlas.penpot` through the [design reference](context/design-reference.md), extracting only what the task needs. The delivery specification defines the remaining source-coverage and desktop review gates. Select future work through a separate task instruction.

The task table is authoritative for completion; the Mermaid DAG must match its rows, dependencies, and colors. A checked task means its stated outcome was verified, not that it was merged or released. Validation records distinguish those states. Historical bootstrap and evaluation records remain evidence rather than current setup instructions.

## Authoring reference alignment

The portable [update-atlas API reference](../.agents/skills/update-atlas/references/api.md) matches the current overview: all selected essentials, or all activities ordered by ID without a selection, revealed six at a time. The stale three-item limit was corrected on 2026-09-28. Display batches must not limit recorded knowledge.
