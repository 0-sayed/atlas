# Dynamic desktop delivery specification

**Date:** 2026-10-01\
**Stage:** T007 and T008 are complete; T009 and T010 implementation merged via PR #13 (`f7bc975`). T008's owner visual acceptance remains the two-screen proof. T011 cross-domain and broader desktop acceptance is next. This document records scope and remaining gates; it does not authorize future implementation.

Read [PROJECT](business/PROJECT.md), [DESIGN](business/DESIGN.md), and [TECHNICAL](technical/TECHNICAL.md) together. This brief owns task boundaries; those documents own product, visual, and architecture decisions respectively.

Use the [Penpot design reference and task mapping](design-reference.md#task-to-design-mapping) to locate the exact system and desktop boards. The approved native file is available under ignored `.local/design/atlas.penpot`; the reference records its identity and retrieval instructions.

## Acceptance contract

- One unchanged frontend/backend build displays different supported projects from API data. No project-name switches, per-project routes/components, or fixture imports in browser runtime.
- The shared frame contains six project destinations: Start Here, Feature Map, User Journeys, Actors, Rules, and Glossary. Each destination uses saved current facts or an honest empty state. Feature details and cases remain project-scoped and directly linkable.
- Common activities use reviewed authored steps, conditions, cases, outcomes, and evidence. Atlas displays recorded outcomes; it does not execute source actions or infer unseen business outcomes.
- Layout fits content: short/long/absent optional text, many items, multiple actors, long names, absent art, and sparse projects must remain readable. No fixed card height that strands body content outside its surface.
- Demonstrate three distinct domain datasets, including at least two authorized real-source projects. The third may be explicitly synthetic. Evidence accuracy and automated UI behavior are evaluated separately; do not fabricate source access to meet this gate.
- Known renderer gaps remain visible and must not be recast as navigation examples. Capability negotiation prevents the portable authoring skill from submitting content a target cannot render.
- Source truth, storage revision, deployment, visual acceptance, and human usefulness are separate claims. No passing test or design screenshot establishes the others.

## T007 — local Penpot design handoff

**Depends on:** T006. **Outcome:** an approved local native design file and a small tracked agent reference.

Keep the approved `.penpot` file at `.local/design/atlas.penpot`. The [design reference](design-reference.md) records its identity, task-to-board mapping, dynamic-content boundaries and access instructions. On a fresh clone, ask the owner for the file path when absent. Extract only the assets/reference views needed during each implementation task; no offline gallery, mass screen export or duplicated generated library is required.

**Exit gate:** the native archive opens and its recorded identity matches; a new agent can locate the relevant design without old chat context, knows how to request a missing file, and distinguishes visual examples from reviewed product facts. Carry forward the [compact component rules](business/DESIGN.md#compact-content-driven-component-rules), including complete card containment when Penpot bodies/actions are scene siblings. Mobile/tablet remains excluded.

## T008 — shared components and two-screen visual proof

**Depends on:** T007. **Status:** complete; merged in PR #11 (`0681fef`) and accepted by the owner on 2026-09-30. See [validation](delivery-evidence.md#t008--desktop-visual-proof). **Outcome:** approved Start Here and one feature explanation in the running shared frame.

Implement semantic tokens and the small set of shared controls/layouts needed by these screens. Keep appearance aligned with the approved local Penpot snapshot. Use native controls and selective Radix primitives where composite behavior needs them; install only dependencies required by the proof. Preserve current project and feature navigation.

Use an isolated, labelled existing Publishing Studio dataset and a supported navigation activity to prove the visual composition. Do not invent unsupported commerce behavior or add fields rejected by the current contract to match a design example. The proof can display only the facts its source dataset actually supplies. Other routes retain their existing behavior; unfinished destinations must not appear complete.

**Exit gate:** owner reviews the running two-screen composition, not just a build result. Compare it against the exact approved boards and record loaded Penpot-derived artwork/icons, Kalam/Patrick Hand/Nunito roles, and any content-driven adaptations; retaining the old prototype styling is not an adaptation. Verify short/long/missing content, focus/keyboard, reduced motion, registered-art failure, direct links/Back, and containment. No fixture data is bundled into the browser. Document which shared components now exist and which full-product capabilities remain for T009/T010.

## T009 — cross-domain knowledge, capabilities, and authoring

**Depends on:** T008. **Status:** delivered in PR #13 (`f7bc975`); see [implementation evidence](delivery-evidence.md#t009-and-t010--merged-implementation). **Outcome:** validated, persisted knowledge and a working authored-activity renderer that explains supported activities across domains.

Introduce a bounded versioned authored-activity contract for ordered steps, participating actors, explicit conditions, recorded cases, outcomes/reasons, and scoped evidence. Preserve specialized booking/approval/navigation support. Add explicit records/references for project purpose, meaningful areas, actors/participation, identifiable rules, journeys, glossary, and typed relationships only as required by the six destinations. Authored journey order cannot be inferred from arbitrary relationship edges.

Define exact schema/version transitions and SQL migration needs in the implementation plan after checking the existing storage. Preserve omitted records, same-project references, registered assets, conflict detection, atomic current-data updates, and rollback. Test upgrades with nonempty data plus backup/restore. A format upgrade must not appear as a source behavior change.

Advertise supported contracts, scene versions, and visual capabilities through a documented read-only API response. Update the portable `update-atlas` reference, renderer-fit preflight, examples, and tests in the same deliverable. Keep `fill-atlas` context-only; add optional evidence-backed context prompts only where needed for the new facts, without making extraction depend on Atlas's schema. The portable reference now matches the current overview: all selected essentials (or all features ordered by ID without a selection), revealed six at a time. These are implementation details, not universal product rules. T009 must preserve agreement between the portable reference and supported behavior.

Replace the current total 100-feature constraint with a deliberate tested capacity/read strategy for the planned map. Separate write-batch limits from total project capacity. Preserve bounded requests; include current-project transfer costs. Determine measured performance budgets and supported limits in the scoped implementation plan, using at least a 160-feature dataset, rather than promising unlimited scale.

**Exit gate:** API plus the reusable activity view round-trip supported cross-domain facts and art without per-project code. A copied authoring skill operates against an isolated instance using its advertised capabilities. Old supported records still load; unknown versions and unsupported capabilities fail clearly before writes; stale/invalid requests leave no partial revision. Domain facts remain explicit when missing or contradictory.

## T010 — complete desktop destinations and Feature Map

**Depends on:** T009. **Status:** delivered in PR #13 (`f7bc975`); broader cross-domain desktop acceptance remains T011. See [implementation evidence](delivery-evidence.md#t009-and-t010--merged-implementation). **Outcome:** the six desktop destinations and feature details work against persisted current project data.

Build the remaining views from the shared components and selectors. Actors show explicit participation, Rules show referenced conditions, Glossary shows saved definitions, and Journeys show authored ordered paths. Complete supported current evidence presentations. Keep truthful no-data, partial, unknown, conflict, no-results, and unavailable states. Treat design examples as reference compositions, never source data.

Implement the illustrated map as reusable scenery plus accessible text/nodes/relationship layers. Provide meaningful grouping, list/search access, progressive detail, pan/zoom/Fit, a useful minimap, keyboard operation, and location restoration after detail/Back. Persisted project facts do not contain arbitrary coordinates, HTML, JSX, CSS, or executable scene programs. Camera/UI state must not create knowledge revisions. A stable derived layout keeps ordinary data updates from unnecessarily moving everything.

The bounded integration check selected pinned `react-zoom-pan-pinch` 4.2.0 for camera transforms. The decision is recorded in TECHNICAL. Retain regression coverage for selected-node clicks versus dragging, keyboard focus, Fit/minimap bounds, reduced motion and dense/long-label datasets.

**Exit gate:** every implemented destination has a valid saved-data case and an honest empty case. Direct URLs, browser Back, search/group/case state, and project switching do not leak state across projects. Desktop screenshots match the captured design intent with actual long content. Large-map validation uses at least 160 features and the T009 supported data boundary. An isolated map implementation is not completion of the other destinations.

## T011 — same-build and authoring acceptance

**Depends on:** T010. **Outcome:** documented evidence for dynamic reuse and desktop quality.

Build once, then incorporate three distinct domain datasets through the API: at least two from authorized reviewed real-source evidence and at most one synthetic stand-in. Select source projects with genuinely different actors, rules, journeys, and exceptions. Record inspected revisions and coverage. If required source access is missing, record this gate as blocked rather than treating a fixture as real-source validation.

Demonstrate additions, changes, explicit removals, evidence corrections, supporting-art updates, and a reviewed no-behavior-change scope. Check unaffected current records remain, no-op preparation makes no POST, failed writes roll back, and switching projects preserves scope. A newly unsupported activity must produce a recorded capability gap without misleading content or per-project UI edits.

Exercise sparse content, no facts, absent optional art, multiple actors, long names/text, changed/deleted links, conflicting evidence, and the dense map. Run `npm run validate` in isolated test storage, plus a desktop visual/accessibility review against the approved local Penpot design. Retain existing automated responsive checks while further mobile/tablet design remains deferred. Verify normal startup still has no demo knowledge and build artifacts contain no private material.

**Exit gate:** update the existing [delivery evidence](delivery-evidence.md) with build revision, source coverage, dataset labels, checks and outcomes, remaining gaps, and actual end-to-end authoring effort. Keep project context in this folder rather than creating task reports under the roadmap. Private payloads and source data stay private. This technical gate does not close T005's human comprehension/voluntary-return evaluation; collect that evidence separately.

## Sequencing and handoff

The implementation sequence is T006 → T007 → T008 → T009 → T010 → T011. T005 remains a separate pending evaluation, not a prerequisite that blocks the desktop work. The dependencies express deliverables, not permission to merge unfinished branches. Recheck the working tree and preserve the existing T005/T006 work before executing any new task.

When a future task is separately selected for implementation, determine its exact files, interfaces, tests, upgrade implications where relevant, and verification gates using the applicable workflow. This outcome brief records context and roadmap acceptance; it does not start feature planning or execution. Only mark a task complete after its own exit gate is met, and update both `tasks.md` and `dependencies.mmd` together.
