# Atlas planning context

**Updated:** 2026-09-28\
**Current state:** React/TypeScript/Vite, the local NestJS API, SQLite persistence, project-scoped exploration, and the source-context skill are implemented. The current working foundation is not the final Penpot desktop experience. Broader knowledge contracts and the remaining desktop views are planned work.

## Start here

Start with [the planning entry point](../README.md), then read these documents in order:

| File | Purpose |
|---|---|
| [PROJECT.md](business/PROJECT.md) | Product purpose, seven destinations, dynamic reuse, scope, and human evaluation. |
| [Design reference](design-reference.md) | Verified Penpot board links, shared component IDs, task mapping, access instructions and export freshness. |
| [DESIGN.md](business/DESIGN.md) | Illustrated desktop composition, shared components, content sizing, interactions, and honest knowledge states. |
| [TECHNICAL.md](technical/TECHNICAL.md) | Implemented architecture, proposed contract/rendering extensions, library choices, and technical acceptance. |
| [Desktop delivery brief](../roadmap/desktop-delivery.md) | T007–T011 deliverables, prerequisites, acceptance gates, and handoff requirements. |
| [Task graph](../roadmap/tasks.md) | Task completion, dependencies, and historical verification boundaries. |

## Runtime and authoring boundaries

`fill-atlas` is a portable, context-only skill bundled in `.agents/skills/fill-atlas/`. It inspects authorized source evidence, writes standalone Markdown, and stops. The separate `.agents/skills/update-atlas/` workflow incorporates reviewed context through the local API. Neither runs while a person browses Atlas.

One local SQLite database stores all projects; private registered image files live alongside it. The frontend reads validated saved knowledge. Normal storage starts empty; fixtures and Penpot examples are explicitly illustrative. Ordinary supported project additions and fact/art updates must work without changing or rebuilding the app. Unsupported semantics require a reviewed reusable contract/renderer addition.

The running model currently accepts booking, approval, and navigation scenes. The domain-neutral authored activity, full seven-view knowledge model, and capability-aware authoring described in the refreshed specification are **targets**, not installed capabilities.

## Source material and freshness

The v0.10 pack was incorporated into this folder; maintain these files instead of a second context pack. Keep the [13 original references](business/PROJECT.md#15-visual-reference-guide) as planning assets only. They are not runtime screenshots, source-product facts, or licensed production artwork.

The older local, untracked `docs/superpowers/specs/2026-09-25-reference-experience-correction-design.md` records the earlier reference correction. This refreshed context and the delivery brief supersede its conflicting status, scope, and library assumptions. The private `.local/handoffs/2026-09-27-atlas-design-session-handoff.md` contains historical design-session detail; it is supplementary and is not required to understand the public plan. Do not copy its embedded conversation or private content into tracked documentation.

T007 must capture one synchronized final desktop design package. Mixed-date local exports and a list of passed visual audits do not constitute that package. Mobile/tablet design work remains deferred.
