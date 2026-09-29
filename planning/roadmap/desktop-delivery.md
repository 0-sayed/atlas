# Dynamic desktop delivery specification

**Date:** 2026-09-29\
**Stage:** Written specification for owner review. The direction is agreed; this document defines delivery outcomes and acceptance, not permission to start application changes. This refresh updates project context and roadmap only. Future feature implementation requires a separate task instruction; roadmap entries do not authorize execution.

Read [PROJECT](../context/business/PROJECT.md), [DESIGN](../context/business/DESIGN.md), and [TECHNICAL](../context/technical/TECHNICAL.md) together. This brief owns task boundaries; those documents own product, visual, and architecture decisions respectively.

Use the [Penpot design reference and task mapping](../context/design-reference.md#task-to-design-mapping) to locate the exact system and desktop boards. The approved native file is available under ignored `.local/design/atlas.penpot`; the reference records its identity and retrieval instructions.

## Acceptance contract

- One unchanged frontend/backend build displays different supported projects from API data. No project-name switches, per-project routes/components, or fixture imports in browser runtime.
- The shared frame contains Start Here, Feature Map, User Journeys, Actors, Rules, Glossary, and Recent Changes. Each destination uses saved facts or an honest empty state. Feature details and cases remain project-scoped and directly linkable.
- Common activities use reviewed authored steps, conditions, cases, outcomes, and evidence. Atlas displays recorded outcomes; it does not execute source actions or infer unseen business outcomes.
- Layout fits content: short/long/absent optional text, many items, multiple actors, long names, absent art, and sparse projects must remain readable. No fixed card height that strands body content outside its surface.
- Demonstrate three distinct domain datasets, including at least two authorized real-source projects. The third may be explicitly synthetic. Evidence accuracy and automated UI behavior are evaluated separately; do not fabricate source access to meet this gate.
- Known renderer gaps remain visible and must not be recast as navigation examples. Capability negotiation prevents the portable authoring skill from submitting content a target cannot render.
- Source truth, storage revision, deployment, visual acceptance, and human usefulness are separate claims. No passing test or design screenshot establishes the others.

## T007 — local Penpot design handoff

**Depends on:** T006. **Outcome:** an approved local native design file and a small tracked agent reference.

Keep the approved `.penpot` file at `.local/design/atlas.penpot`. The [design reference](../context/design-reference.md) records its identity, task-to-board mapping, dynamic-content boundaries and access instructions. On a fresh clone, ask the owner for the file path when absent. Extract only the assets/reference views needed during each implementation task; no offline gallery, mass screen export or duplicated generated library is required.

**Exit gate:** the native archive opens and its recorded identity matches; a new agent can locate the relevant design without old chat context, knows how to request a missing file, and distinguishes visual examples from reviewed product facts. Carry forward the [compact component rules](../context/business/DESIGN.md#compact-content-driven-component-rules), including complete card containment when Penpot bodies/actions are scene siblings. Mobile/tablet remains excluded.

## T008 — shared components and two-screen visual proof

**Depends on:** T007. **Outcome:** approved Start Here and one feature explanation in the running shared frame.

Implement semantic tokens and the small set of shared controls/layouts needed by these screens. Keep appearance aligned with the approved local Penpot snapshot. Use native controls and selective Radix primitives where composite behavior needs them; install only dependencies required by the proof. Preserve the existing routes and API behavior.

Use an isolated, labelled existing Publishing Studio dataset and a supported navigation activity to prove the visual composition. Do not invent unsupported commerce behavior or add fields rejected by the current contract to match a design example. The proof can display only the facts its source dataset actually supplies. Other routes retain their existing behavior; unfinished destinations must not appear complete.

**Exit gate:** owner reviews the running two-screen composition, not just a build result. Verify short/long/missing content, focus/keyboard, reduced motion, registered-art failure, direct links/Back, and containment. No fixture data is bundled into the browser. Document which shared components now exist and which full-product capabilities remain for T009/T010.

## T009 — cross-domain knowledge, capabilities, and authoring

**Depends on:** T008. **Outcome:** validated, persisted knowledge and a working authored-activity renderer that explains supported activities across domains.

Introduce a bounded versioned authored-activity contract for ordered steps, participating actors, explicit conditions, recorded cases, outcomes/reasons, and scoped evidence. Preserve specialized booking/approval/navigation support and existing saved history. Add explicit records/references for project purpose, meaningful areas, actors/participation, identifiable rules, journeys, glossary, and typed relationships only as required by the seven destinations. Authored journey order cannot be inferred from arbitrary relationship edges.

Define exact schema/version transitions and SQL migration needs in the implementation plan after checking the existing storage. Preserve omitted records, same-project references, registered assets, conflict detection, atomic history, and rollback. Test upgrades with nonempty data plus backup/restore. Old snapshots remain historically honest; a format upgrade must not appear as a source behavior change. Define history handling for each new record type and for evidence-only/presentation-only changes.

Advertise supported contracts, scene versions, and visual capabilities through a documented read-only API response. Update the portable `update-atlas` reference, renderer-fit preflight, examples, and tests in the same deliverable. Keep `fill-atlas` context-only; add optional evidence-backed context prompts only where needed for the new facts, without making extraction depend on Atlas's schema. The portable reference now matches the current overview: all selected essentials (or all features ordered by ID without a selection), revealed six at a time. These are implementation details, not universal product rules. T009 must preserve agreement between the portable reference and supported behavior.

Replace the current total 100-feature constraint with a deliberate tested capacity/read strategy for the planned map. Separate write-batch limits from total project capacity. Preserve bounded requests; include current-project and history transfer costs. Determine measured performance budgets and supported limits in the scoped implementation plan, using at least a 160-feature dataset, rather than promising unlimited scale.

**Exit gate:** API plus the reusable activity view round-trip supported cross-domain facts and art without per-project code. A copied authoring skill operates against an isolated instance using its advertised capabilities. Old supported records still load; unknown versions and unsupported capabilities fail clearly before writes; stale/invalid requests leave no partial revision. Domain facts remain explicit when missing or contradictory.

## T010 — complete desktop destinations and Feature Map

**Depends on:** T009. **Outcome:** the seven desktop destinations and feature details work against persisted project data.

Build the remaining views from the shared components and selectors. Actors show explicit participation, Rules show referenced conditions, Glossary shows saved definitions, and Journeys show authored ordered paths. Complete supported current/history and evidence presentations. Keep truthful no-data, partial, unknown, conflict, no-results, and unavailable states. Treat design examples as reference compositions, never source data.

Implement the illustrated map as reusable scenery plus accessible text/nodes/relationship layers. Provide meaningful grouping, list/search access, progressive detail, pan/zoom/Fit, a useful minimap, keyboard operation, and location restoration after detail/Back. Persisted project facts do not contain arbitrary coordinates, HTML, JSX, CSS, or executable scene programs. Camera/UI state must not create knowledge revisions. A stable derived layout keeps ordinary data updates from unnecessarily moving everything.

Run a bounded integration check of the `react-zoom-pan-pinch` candidate before adopting it: selected-node clicks must coexist with dragging, keyboard focus must stay usable, Fit and minimap must agree with bounds, reduced motion must work, and dense/long-label datasets must remain readable. Record the choice in TECHNICAL; the candidate is not yet an installed dependency or a proven solution.

**Exit gate:** every implemented destination has a valid saved-data case and an honest empty case. Direct URLs, browser Back, search/group/case state, and project switching do not leak state across projects. Desktop screenshots match the captured design intent with actual long content. Large-map validation uses at least 160 features and the T009 supported data boundary. An isolated map implementation is not completion of the other destinations.

## T011 — same-build and authoring acceptance

**Depends on:** T010. **Outcome:** documented evidence for dynamic reuse and desktop quality.

Build once, then incorporate three distinct domain datasets through the API: at least two from authorized reviewed real-source evidence and at most one synthetic stand-in. Select source projects with genuinely different actors, rules, journeys, and exceptions. Record inspected revisions and coverage. If required source access is missing, record this gate as blocked rather than treating a fixture as real-source validation.

Demonstrate additions, changes, explicit removals, evidence corrections, supporting-art updates, and a reviewed no-behavior-change scope. Check unaffected records remain, no-op preparation makes no POST, history retains the correct prior facts, failed writes roll back, and switching projects preserves scope. A newly unsupported activity must produce a recorded capability gap without misleading content or per-project UI edits.

Exercise sparse content, no facts, absent optional art, multiple actors, long names/text, changed/deleted links, conflicting evidence, and the dense map. Run `npm run validate` in isolated test storage, plus a desktop visual/accessibility review against the approved local Penpot design. Retain existing automated responsive checks while further mobile/tablet design remains deferred. Verify normal startup still has no demo knowledge and build artifacts contain no private material.

**Exit gate:** a concise tracked validation report identifies build revision, source coverage, dataset labels, checks and outcomes, remaining gaps, and actual end-to-end authoring effort. Private payloads and source data stay private. This technical gate does not close T005's human comprehension/voluntary-return evaluation; collect that evidence separately.

## Sequencing and handoff

The implementation sequence is T006 → T007 → T008 → T009 → T010 → T011. T005 remains a separate pending evaluation, not a prerequisite that blocks the desktop work. The dependencies express deliverables, not permission to merge unfinished branches. Recheck the working tree and preserve the existing T005/T006 work before executing any new task.

When a future task is separately selected for implementation, determine its exact files, interfaces, tests, upgrade implications where relevant, and verification gates using the applicable workflow. This outcome brief records context and roadmap acceptance; it does not start feature planning or execution. Only mark a task complete after its own exit gate is met, and update both `tasks.md` and `dependencies.mmd` together.
