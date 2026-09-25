# T005 — first real-source guide

Status: runtime and local incorporation implemented; human comprehension and voluntary-return evaluation pending. This is not a claim of production deployment or broad source-extraction accuracy.

## What was evaluated

The owner selected Atlas itself. Its reader changed from a single saved booking guide to project selection and project-scoped exploration. The guide explains Atlas navigation; the booking fixture is not evidence of a real booking service.

| Source evidence | Incorporation decision |
|---|---|
| `f7810fd20099ffcb99dad5f0efcb070fe4593eb5`, `src/App.tsx`, `KnowledgeProvider`, `GuidePages` | Baseline: one “Explore a saved activity” activity describing the single-guide reader. |
| `f08ef7c97ae57ef1cb5dd3b9a0dc0974a3b55492`, `src/App.tsx`, `ProjectPicker`, `GuidePages`, `FeaturePage`, `KnowledgeProvider` | Update exploration to the selected-project behavior; add “Choose a saved project.” No invented picker before-state. |
| `f7810fd..f08ef7c`, scoped to `shared/booking.ts` | Type-only `Feature` → `BookingFeature` change; no booking-rule update. The broader range does change navigation. |
| `f08ef7c..86362e2a6f695aba6d33c5447cdbdd411f25a50f` | Skill/documentation changes, no reader-runtime update. |

The standalone repository `fill-atlas` skill produced context-only Markdown from committed source. A separate agent prepared API payloads from that context and the strict contracts. The implementing agent reviewed the claims against the committed routes, provider, picker, search, and scoped diffs before writing. Source extraction read code; it did not execute source scripts. Subsequent browser checks verify this local reader, not deployment of the historical revisions.

## Reader support

A versioned `navigation` scene records authored starting points, actions, results, reasons, and available/unavailable/unknown outcomes. It is needed because booking and approval rules cannot represent navigation honestly. It does not execute the described actions or calculate new outcomes. Saved-case controls, native evidence disclosure, scoped URLs, Back, overview/search, and historical snapshots use the existing reader structure. No SQL migration or automatic Markdown importer was added.

This first non-commerce source required one new scene. It therefore proves reuse within that bounded scene, not that arbitrary web applications need no UI changes.

## Private incorporation and repeat procedure

Local guide: `http://127.0.0.1:5173/#/projects/atlas-reader-guide`.

Context, `baseline.json`, `update.json`, payload hashes, API observations, and screenshots are under ignored `.local/t005/`; persistent knowledge remains in the configured private SQLite store. None is bundled into the frontend or tracked as a source-data fixture. Tracked `fixtures/navigation.ts` is explicitly synthetic test data.

1. Review authorized source context against exact source revisions; keep missing evidence explicit.
2. Have a separate agent prepare a strict create or scoped update payload. Validate both shape and meaning. An update includes the expected current Atlas revision; omitted activities remain intact.
3. Start the loopback API and frontend using the private local configuration. Read the target project before writing; an existing identity must be reconciled rather than overwritten.
4. Submit authenticated `POST /api/v1/projects` for a new guide, then scoped `POST /api/v1/projects/:id/changes` for reviewed changes. Use the local write credential without displaying or committing it. Do not write SQL directly or replay this evaluation's create against an existing guide.
5. Read the current document and `/history`, compare every submitted feature and its evidence, and verify the baseline remains unchanged. A rejected stale/invalid update must not create a history entry.
6. For no relevant source behavior change, record the scoped decision and make no write. Check that current revision/history remain unchanged.
7. Inspect the real current guide and historical explanation in the browser; collect human understanding separately from automated assertions.

Observed on 2026-09-25: initial GET returned 404; create produced Atlas revision 1; update produced revision 2 with exactly two activities. Read-back matched submitted features/evidence, history contained exactly two snapshots, and the baseline was unchanged. Both no-change decisions made zero POSTs and left revision/history unchanged. Source commit IDs, Atlas storage revisions, and deployment status are separate concepts.

## Verification and effort

- Strict contract tests reject unsupported versions, mixed-scene fields, and invalid outcomes. Real SQLite tests cover restart persistence, immutable history, preservation of unrelated scenes, and stale/invalid-write rollback.
- Browser tests exercise case selection, direct links, Back/search restoration, unknown and missing cases, empty cases, evidence, current/history outcomes, and keyboard/mobile use. Existing booking/approval coverage stays active.
- Local real-guide checks cover both activities, source evidence, changed exploration snapshots, and an added picker without a fabricated before snapshot. Desktop/mobile screenshots are private.
- Required validation: 43 unit/integration tests, 26 browser tests, formatting, lint, typecheck, frontend/backend builds, artifact privacy checks, and production restart/shutdown smoke.
- The separate payload preparation took approximately two minutes. The two local writes plus read-back checks took about 0.1 seconds (recorded at 16:47:06 UTC). These exclude source extraction, manual review, scene implementation, browser QA, and retries; they are not an end-to-end cost benchmark. This run required a new scene, so routine content-update effort is still unproven.

## Human evaluation still needed

The owner was invited to explore the running guide and explain what changed about project selection and search. No answer has yet been recorded. Comprehension, recognition of the important exception, and willingness to return are unknown. A stated intention to return is not observed voluntary return; that needs a later actual visit. Automated navigation and screenshots cannot answer those questions.

T005 remains unchecked until these evaluation outcomes are recorded. The implementation is available for review on its feature branch; this record does not claim a T005 merge or release.
