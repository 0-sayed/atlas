# T006 visual and authoring foundation

Implemented on `feat/t006-visual-authoring-foundation`, based on the existing T005 work. This task establishes the reusable application frame and incorporation workflow; it does not complete T005's human comprehension evaluation.

**Historical snapshot:** This record describes the 2026-09-25 validation. Subsequent local overview changes select all authored essentials, or all features ordered by ID when no selection exists, and reveal six at a time. The three-item behavior below is historical, not the current renderer contract. These later changes were inspected on 2026-09-28; this note does not claim a fresh application test run.

## Delivered boundary

- Shared responsive sidebar and original illustrated activity components. Titles, activities, cases, evidence and supported artwork selections come from saved project data. An explicitly selected starting path takes precedence; older documents without a selection retain their first three activities by ID.
- Optional strict `presentation` settings persist through the existing feature storage. Historical documents remain unchanged; artwork-only edits do not appear as product behavior changes. No database migration or dependency was added.
- Portable `update-atlas` skill with API and artwork references. `fill-atlas` remains independent and unchanged. Unsupported behavior is recorded as a gap, not converted into invented navigation examples.
- Normal storage remains empty. Examples are optional separate seeds; implementation tests use temporary storage. No automatic PR watcher, runtime model call, arbitrary UI generator, or global skill installation is included.

## Authoring evaluation

A fresh worker used a copied skill folder and synthetic source context without inspecting Atlas source. In an isolated API instance it read project revision 7, registered a supporting image at revision 8, and incorporated one navigation activity at revision 9. Both existing activities and relations were preserved exactly. Generated payloads passed the shared strict schemas; read-back, immutable history, image bytes, direct links, saved outcomes and browser Back were checked.

The synthetic helper refactor generated no additional update. Checkout/payment behavior remained an explicit unsupported gap. The supplied one-pixel PNG was malformed; the worker replaced it with a valid transparent test image and recorded that fact in provenance. This exercises registration, not production artwork quality or source accuracy.

The baseline worker already found the correct protocol by reading the repository. No baseline failure is claimed. The companion skill's demonstrated value is carrying the necessary instructions outside the repository. The evaluation used a fresh Codex worker, not a live Claude Code installation.

Private preparation, payloads, screenshots and the incorporation record are under ignored `.local/visual-foundation/`. They are not product data or release artifacts.

## Final validation

`npm run validate` passed on 2026-09-25: formatting, lint, TypeScript, 48 unit/integration tests, 32 browser tests, frontend/backend builds, artifact boundary checks and production restart/shutdown smoke. Browser coverage includes live artwork changes without rebuild, separate project identities, 375px width with 100 activities and long labels, intentional starting-path selection, empty states, unavailable assets, direct links and Back. Desktop/mobile screenshots were inspected. The restarted normal API and Vite proxy both returned zero projects; the browser showed the shared empty frame.

Two bounded review passes led to an explicit scene-fit gate, corrected authoring documentation and a fix ensuring selected essentials take precedence. Changes remain local and uncommitted.

## Acceptance limits

Functional validation does not establish the owner's visual approval, source-product truth, voluntary return, or deployment. Booking, approval and navigation are the current supported interaction types. A genuinely new interaction still requires separately scoped reusable scene code.

## Verification refresh — 2026-09-28

The current working tree passed the full `npm run validate`: formatting, lint, TypeScript, 60 unit/integration tests, 33 browser tests, frontend/backend builds, artifact checks and production restart/shutdown smoke. Local Serena tooling is excluded from formatting. Independent T005 and T006 acceptance reviews found no concrete implementation gaps; T005 human comprehension, voluntary return and routine update effort remain unestablished. The portable authoring exercise above remains historical evidence, not a newly repeated exercise.

The branch was renamed from `feat/visual-authoring-foundation` to `feat/t006-visual-authoring-foundation`. The implementation is committed at `ac10c83`; no merge or deployment is claimed.
