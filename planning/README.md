# Start here: Atlas delivery context

**Updated:** 2026-09-28. This folder is the shared product specification and delivery roadmap. The owner approved preparing this documentation; implementation of the new desktop roadmap has not started. This refresh updates project context and roadmap only. Future feature implementation requires a separate task instruction; roadmap entries do not authorize execution.

## What we are building

Atlas explains reviewed behavior from different web projects through one illustrated application. The frame and visual language stay consistent; saved project knowledge supplies activities, actors, rules, journeys, terms, relationships, evidence, and supported artwork. Adding another supported project changes data, not frontend code. A finite set of renderers does not guarantee coverage of every possible web application.

The pipeline is source evidence → `fill-atlas` context → reviewed `update-atlas` incorporation → local API/SQLite → reusable frontend. The guide does not execute the source product's business actions or call an AI model at browse time.

## Read in this order

1. [Product requirements](context/business/PROJECT.md), especially MVP features and evaluation.
2. [Design specification](context/business/DESIGN.md) for shared composition and dynamic-content behavior, then [Penpot design reference](context/design-reference.md) for exact boards, components, exports and task mapping.
3. [Technical specification](context/technical/TECHNICAL.md), distinguishing implemented capabilities from targets.
4. [Desktop delivery brief](roadmap/desktop-delivery.md), then [tasks](roadmap/tasks.md) and [dependencies](roadmap/dependencies.mmd).
5. The relevant task's validation record and any separately authorized implementation instructions. Read root `AGENTS.md` before editing.

For installation, local startup, the current API and backup/restore, use the [root README](../README.md); do not reconstruct operational steps from historical bootstrap checklists.

## Verified status, not inferred completion

| Work | Status at this refresh |
| --- | --- |
| T000–T004 | Delivered historical foundation; see task outcome records. |
| T005 | Runtime committed at `5be0184`. Isolated validation rerun on 2026-09-28 passed 44 unit/integration and 28 browser tests plus the remaining validation gates. Human understanding and voluntary return remain pending; task stays unchecked. |
| T006 | Visual/authoring foundation committed at `ac10c83`. Historical checks are recorded in [T006 validation](roadmap/t006-validation.md); these do not prove the final desktop design is implemented. |
| Penpot desktop/system | Designed and audited separately from the running application. A synchronized implementation package remains T007. |
| T007–T011 | Planned and unchecked. No application implementation or release is claimed by this documentation update. |

The inspected branch was `feat/t006-visual-authoring-foundation`, based on the same `5be0184` commit as `feat/t005-real-source-guide`, with subsequent T006 implementation committed at `ac10c83`. Recheck Git status before continuing. Preserve those changes; do not stash, reset, switch, commit, or publish simply to align with a proposed branch name.

## Decisions to carry forward

- Keep React/TypeScript/Vite/Router/Tailwind and one NestJS API with SQLite, `better-sqlite3`, tracked SQL migrations, and shared strict Zod schemas.
- Build Atlas components from the Penpot design system. Native controls first; use Radix primitives for complex focus/keyboard interactions when required. Neither Radix nor shadcn is currently installed; a shadcn baseline is not selected.
- Add a bounded, versioned authored-activity explanation for common cross-domain behavior. Keep reviewed specialized scenes where useful. Do not accept executable layouts or build a universal rules engine.
- Complete the fixed seven destinations using explicit saved knowledge. Missing facts produce honest empty/gap states; a mockup never establishes a source fact.
- Desktop is the delivery focus. Mobile/tablet design expansion is deferred; preserve existing basic responsiveness, keyboard navigation, and reduced-motion behavior.
- Keep `fill-atlas` independent. Update API capabilities, `update-atlas` references, and their verification together when supported content expands.

## Before the next execution session

T007's desktop baseline is the next recorded roadmap outcome. The delivery brief defines its scope and exit gate. This context refresh does not start T007 or require creating feature implementation plans. Select future feature work through a separate task instruction; do not improvise application changes from roadmap titles.

The task table is authoritative for completion; the Mermaid DAG must match its rows, dependencies, and colors. A checked task means its stated outcome was verified, not that it was merged or released. Validation records distinguish those states. Historical bootstrap and evaluation records remain evidence rather than current setup instructions.

## Authoring reference alignment

The portable [update-atlas API reference](../.agents/skills/update-atlas/references/api.md) matches the current overview: all selected essentials, or all activities ordered by ID without a selection, revealed six at a time. The stale three-item limit was corrected on 2026-09-28. Display batches must not limit recorded knowledge.
