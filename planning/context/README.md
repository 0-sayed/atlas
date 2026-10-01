# Atlas planning context

**Updated:** 2026-10-01\
**Current state:** T009 and T010 merged in PR #13 (`f7bc975`): authored contract v2, SQLite schema 4, capability-aware authoring, six desktop destinations and the interactive map. T008's two-screen visual approval is recorded separately. T011 cross-domain/source/desktop acceptance is next; T005 human evaluation remains open.

## Start here

Start with [the planning entry point](../README.md), then read these documents in order:

| File | Purpose |
|---|---|
| [PROJECT.md](business/PROJECT.md) | Product purpose, six destinations, dynamic reuse, scope, and human evaluation. |
| [Design reference](design-reference.md) | Approved local Penpot file, shared component IDs, task mapping and missing-file retrieval instructions. |
| [DESIGN.md](business/DESIGN.md) | Illustrated desktop composition, shared components, content sizing, interactions, and honest knowledge states. |
| [TECHNICAL.md](technical/TECHNICAL.md) | Implemented architecture, proposed contract/rendering extensions, library choices, and technical acceptance. |
| [Desktop delivery brief](desktop-delivery.md) | T007–T011 deliverables, prerequisites, acceptance gates, and handoff requirements. |
| [Delivery evidence](delivery-evidence.md) | Concise delivery findings, merged implementation evidence, and remaining evaluation limits. |
| [Bootstrap evidence](bootstrap.md) | Historical T000/T002 foundation checklist; use the root README for current setup. |
| [Task graph](../roadmap/tasks.md) | Task completion, dependencies, and historical verification boundaries. |

## Runtime and authoring boundaries

`fill-atlas` is a portable, context-only skill bundled in `.agents/skills/fill-atlas/`. It inspects authorized source evidence, writes standalone Markdown, and stops. The separate `.agents/skills/update-atlas/` workflow incorporates reviewed context through the local API. Neither runs while a person browses Atlas.

One local SQLite database stores all projects; private registered image files live alongside it. The frontend reads validated saved knowledge. Normal storage starts empty; fixtures and Penpot examples are explicitly illustrative. Ordinary supported project additions and fact/art updates must work without changing or rebuilding the app. Unsupported semantics require a reviewed reusable contract/renderer addition.

The running model accepts booking, approval, navigation and authored scenes. It reads contract v2 and accepts version-1 and version-2 writes. Explicit purpose, actors, rules, areas, journeys, glossary and evidence records support the six views. Capabilities and limits are advertised by the API. Automated checks establish these bounded features, not arbitrary-project coverage or source truth.

## Source material and freshness

Keep project specifications, design guidance, and delivery evidence in `planning/context/`. The roadmap contains only the task list and dependency graph, which link to this context rather than duplicating it. Maintain delivery findings in the existing evidence document instead of creating separate task reports or a validation folder.

The v0.10 pack was incorporated into this folder; maintain these files instead of a second context pack. Keep the [13 original references](business/PROJECT.md#15-visual-reference-guide) as planning assets only. They are not runtime screenshots, source-product facts, or licensed production artwork.

The older local, untracked `docs/superpowers/specs/2026-09-25-reference-experience-correction-design.md` records the earlier reference correction. This refreshed context and the delivery brief supersede its conflicting status, scope, and library assumptions. The private `.local/handoffs/2026-09-27-atlas-design-session-handoff.md` contains historical design-session detail; it is supplementary and is not required to understand the public plan. Do not copy its embedded conversation or private content into tracked documentation.

T007 establishes the approved native file at ignored `.local/design/atlas.penpot` and the tracked design reference. If absent, ask the owner for its path. No gallery or bulk export is required; extract only what the selected task needs. Mobile/tablet design work remains deferred.
