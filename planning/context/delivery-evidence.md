# Delivery evidence

These are dated delivery findings, consolidated in one context document. They explain what was verified and what remains unproven. Consult the [task graph](../roadmap/tasks.md) for completion status, [desktop delivery specification](desktop-delivery.md) for task scope, and [design reference](design-reference.md) for the approved visual source. Earlier test results do not establish the state of the current working tree.

## T004 — independent source skill

The repository-maintained [fill-atlas skill](../../.agents/skills/fill-atlas/SKILL.md) writes standalone source-context Markdown and stops. It does not execute source scripts, populate Atlas, call its API, or invoke a planner. Generated source context stays private.

The 2026-09-25 evaluation inspected Atlas at `f7810fd20099ffcb99dad5f0efcb070fe4593eb5`, with a change range starting at `81d892bd3ff8cec32c3f931a7bf079fe15ed14c3`. Additional synthetic cases covered scaffold-only source, a behavior-neutral refactor, missing evidence, preserving an existing output, and ignoring instructions embedded in source notes. A separate refactor probe identified changed short-circuit evaluation rather than asserting universal equivalence.

Source review corrected one generated claim: create rejects `expectedRevision`, while update and asset registration require it. Reviewed output is required before incorporation. One available revision for a requested change was not separately evaluated; arbitrary-repository accuracy remains unproven. A minor sample wording issue about derived versus recorded outcomes was deferred.

Recorded regression checks: full validation passed with 33 unit/integration tests and 16 browser tests. Those checks establish that snapshot's regression status, not source-context accuracy. Private evaluation inputs and outputs were retained separately in the owner's application-data directory under `atlas-t004-validation`.

## T005 — real-source evaluation

Atlas itself supplied the authorized source. The evaluated guide explained the transition from a single saved guide to project selection and project-scoped exploration. The booking fixture was never evidence of a real booking service.

Reviewed evidence used `f7810fd`, `f08ef7c`, and `86362e2a6f695aba6d33c5447cdbdd411f25a50f`. The scoped booking type rename and subsequent skill/documentation-only changes required no product-knowledge write. A separate agent prepared strict API payloads; claims were reviewed against committed routes, loading, selection, search, and diffs before authenticated local incorporation and read-back.

Review corrected an incomplete starting condition: at the initial source revision, saving a document alone was insufficient because the reader also required a feature with ID `booking`. A scoped evidence correction preserved the unrelated picker activity. The first non-commerce guide required a navigation scene, so this exercise does not establish reuse for arbitrary applications without renderer work.

Recorded checks passed with 44 unit/integration tests and 28 browser tests. Private context, payloads, hashes, API observations, and screenshots remain under ignored `.local/t005/`. Earlier snapshot/comparison behavior has been removed from Atlas and is not a current requirement or API procedure.

Human comprehension, recognition of the important exception, voluntary return, and routine end-to-end update effort remain unestablished. The owner's response showed that the initial evaluation prompt was unclear; automated checks cannot substitute for those outcomes. T005 therefore remains open.

## T006 — shared frame and authoring

Delivered the reusable application frame, data-driven labels and supported artwork choices, and the portable `update-atlas` workflow. Normal storage starts empty; demonstrations use separate seeds and tests use temporary storage. Unsupported source behavior remains an explicit renderer gap. The current overview contract selects authored essentials, or features ordered by ID if none are selected, and reveals six at a time; the earlier three-item limit is superseded.

A fresh worker used a copied skill folder and synthetic context without inspecting Atlas source. In an isolated API it registered artwork and incorporated one navigation activity while preserving existing activities and relationships. Shared-schema validation, read-back, image bytes, direct links, saved outcomes, and Back were checked. The malformed supplied one-pixel image was replaced with a valid test image and recorded in provenance. This proves a bounded portable workflow, not source accuracy or production artwork quality. Private evidence is under `.local/visual-foundation/`.

Full validation passed on 2026-09-25 with 48 unit/integration tests and 32 browser tests; the 2026-09-28 refresh passed with 60 and 33 respectively. The implementation was committed at `ac10c83`. These results do not establish T005's human evaluation, deployment, or final Penpot fidelity.

## T007 — native design handoff

The handoff uses the ignored native `.local/design/atlas.penpot` and tracked [design reference](design-reference.md). If the native file is missing, request its path from the owner. Extract only assets needed by the selected task; a generated gallery or bulk export is not a prerequisite.

On 2026-09-29, the initial revision 227 archive passed ZIP integrity, byte/hash comparison, and source-entry checks. Its original and the previous export package were preserved privately. Full validation passed with 60 unit/integration tests and 38 browser tests. This was a documentation/source handoff, not application visual acceptance.

The owner's subsequent revision 235 download replaced the approved native file and superseded revision 227. Current identity, integrity details, retrieval instructions, and task mappings live in the design reference; use that document rather than the old archive as the visual source.

## T008 — desktop visual proof

Merged via [PR #11](https://github.com/0-sayed/atlas/pull/11), commit `0681fef`. The owner accepted the running Start Here and feature explanation on 2026-09-30 after rebuilding the isolated Publishing Studio showcase from main.

The initial implementation retained prototype assets and typography; the first repair still retained old page compositions. Behavioral tests and asset hashes had not established visual fidelity. Subsequent visual comparison and independent review corrected the feature hero, island/water/label composition, font roles, containment, and accessible case descriptions. Approved native artwork and vector masters have provenance in `public/art/penpot/PROVENANCE.md`; Kalam, Patrick Hand, and Nunito sources are recorded in `public/fonts/SOURCES.md`. Retired prototype images and handwritten React illustrations were removed.

Proof data used isolated temporary storage. Product labels, actors, rules, groups, outcomes, revisions, and evidence come from saved knowledge; Penpot commerce examples do not supply product facts. Existing supported desktop routes were checked against named reference boards. Private screenshots and side-by-side comparisons remain under `.local/t008/composition-rebuild/`, with baseline evidence under `.local/t008/composition-review/`.

Final current-state-only validation passed with 54 unit tests, 45 browser tests, formatting, lint, type checks, builds, artifact checks, and production restart/shutdown smoke. Upgrade tests preserved current knowledge and revision conflicts while removing stored snapshots. Removed history routes and requests were checked. The refreshed native revision 235 passed integrity checks and removed retired history boards, decorative step arrows, and the visible sidebar tagline.

This acceptance covers T008's shared components and two-screen visual proof. Subsequent T009/T010 implementation is recorded below; T011 cross-domain acceptance and T005 human evaluation remain separate. Mobile/tablet redesign remains deferred.

## T009 and T010 — merged implementation

Merged on 2026-09-30 via [PR #13](https://github.com/0-sayed/atlas/pull/13), commit `f7bc975`. The implementation was delivered together on `feat/t010-desktop-experience`; the older T009 branch name does not identify a separate implementation commit.

T009 delivers read contract v2, compatible version-1/version-2 writes, SQLite schema 4, authored activities with explicit cases/outcomes, shared actors/rules/areas/journeys/glossary/evidence, scoped relationships, and a read-only capabilities endpoint. API tests cover rollback, reference validation, nonempty upgrades, backup/restore and the independently copied authoring preflight against advertised capabilities. The specialized booking/approval/navigation scenes remain supported.

T010 delivers all six desktop destinations, project-scoped feature details, search and current source disclosures, plus the interactive map with pan/zoom/Fit, minimap, keyboard navigation, dense-data coverage and camera restoration. The map dependency is pinned `react-zoom-pan-pinch` 4.2.0. Project data remains separate from camera state and browser runtime does not import fixtures.

The exact PR snapshot's recorded full validation passed 86 unit/API tests and 71 Chromium tests, plus formatting, lint, type checks, builds, artifact privacy and production restart/shutdown smoke. GitHub CI, dependency and secret checks were green before merge. These results establish the merged implementation's bounded automated acceptance.

T011 remains open: three distinct domains, at least two authorized reviewed real-source projects in one unchanged build, broader desktop/source review and actual end-to-end authoring effort. Synthetic QA datasets do not satisfy real-source coverage and stay outside the single Publishing Studio owner preview. T005's human comprehension and voluntary-return outcomes are still unestablished.

## Showcase and context cleanup — 2026-10-01

The owner preview retains exactly one fictional Publishing Studio project in disposable storage. Its five activities now supply authored allowed/blocked/unknown/conflicting cases, four actors, eight rules, two areas, one ordered journey and three glossary entries. Browser coverage verifies populated supporting destinations, map/detail/Back and all four recorded outcome states. QA fixtures remain isolated from this preview and normal storage.

Full `npm run validate` passed on the cleanup working tree based on `f7bc975`: 87 unit/API tests and 71 Chromium tests, formatting, lint, type checks, builds, artifact privacy and production restart/shutdown smoke. Planning file links and task/DAG status were checked separately. Project context and evidence were consolidated here; the roadmap now holds only tasks and dependencies. These maintenance checks do not close T011 or T005.
