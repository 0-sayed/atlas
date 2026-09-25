# Atlas planning context

**Updated:** 2026-09-24\
**Current state:** The static React app and labelled booking learning loop from T000/T001 are delivered. The reusable database-backed Atlas canvas in v0.10 is the next implementation target, not a current runtime capability.

## Start here

Read [MVP features](business/PROJECT.md#mvp-features) for the product scope, [V1 defaults](business/PROJECT.md#16-v1-defaults-and-prototype-checks) for settled choices, and the [task graph](../roadmap/tasks.md) for implementation status.

| File | Purpose |
|---|---|
| [PROJECT.md](business/PROJECT.md) | Product requirements, source-preparation boundary, and decision history. |
| [DESIGN.md](business/DESIGN.md) | Navigation, cases, visual style, and the booking experience. |
| [TECHNICAL.md](technical/TECHNICAL.md) | Target local API, SQLite store, validation, assets, and acceptance checks. |
| [Visual references](business/PROJECT.md#15-visual-reference-guide) | Guide to the 13 retained design images in `business/references/`. |

## Boundary

The independent `fill-atlas` skill is a later deliverable **outside this repository**. It reads authorized source evidence, produces standalone source-context Markdown, and stops. Separately, an agent may interpret that context and submit data through Atlas's future validated local API. The app renders prepared project knowledge; it does not interpret raw source context or run an agent at browse time.

One local SQLite database will hold all projects, with registered image assets in a private local directory. Ordinary project additions and fact updates must render in the same application build. New reusable renderer behavior still requires reviewed application code.

The existing booking app is a labelled fixture experience. Its current TypeScript content and static deployment are historical T001 implementation, not evidence that the v0.10 backend exists. T002 migrates it; T003 proves dynamic reuse with a second distinct project. Source-skill validation and real-source evaluation follow separately.

Keep the 13 reference images as planning assets. They are not runtime product facts, licensed production art, or a promise to implement every depicted control.
