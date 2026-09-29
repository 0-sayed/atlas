# T008 validation — desktop composition repair

Date: 2026-09-29. Branch: `feat/t008-desktop-visual-proof`, based on `c88cc62`. Changes remain uncommitted. Owner visual approval is pending; T008 remains unchecked. This records the pre-current-state-only implementation; its history/comparison checks do not define the current product contract or prove the later removal.

## What went wrong

The initial implementation retained prototype artwork and typography. The first repair replaced those assets but retained several old page compositions, so its claim of visual completion was too strong. Passing behavioral tests and checking asset hashes did not establish that pages matched Penpot. This record supersedes those earlier completion claims.

## Source and rendered comparisons

The authoritative source is the private native `.local/design/atlas.penpot`, revision 227, file ID `a5ac146a-5787-80fa-8008-b2b1c7b55d1f`, SHA-256 `c2473a7f266e70f028e469f00694a9b2ddc200434cd00e28a1d3d3c7380d11f1`.

Reference board IDs below share the prefix `b06c7e1e-1498-8079-8008-`:

| Implemented surface | Reference suffix | Composition checked |
| --- | --- | --- |
| Start Here | `b2c9e7249565`, `b3121fb1c099` | Panorama, islands on water, gold labels, separate summary; compact three-area arrangement |
| Feature explanation | `b2c9eb5d45b2` | Illustrated hero, section controls, three metadata cards, explanation/rules/examples/relationships panels |
| Browse/filter | `b2e873bd238d`, `b2e87acb501a` | Search icon field, group badges, compact two-column icon cards |
| No results | `b2e8704f1306` | Centered island, aligned explanation and search recovery |
| Empty workspace | `b2d567b47fe3` | Header-only frame and centered island/copy/action |
| Empty saved guide | `b2e8b09b15ee` | Explicit absence of implemented behavior, centered illustration and next-state explanation |
| Booking/approval cases | `b2e88138fe53`, `b2e88833902c` | Left case selection; right outcome, condition, recorded facts and contained evidence |
| Changes/comparison | `b2d4ac16080a`, `b2e88f8ba4eb`, `b2e894b252b0`, `b2e89a2ac97c` | Card-to-island scene and separate historical detail; added/removed/no-change disclosures |
| Loading/failure | `b2e86517f59d`, `b2e867ea2eff` | Shared frame, static loading skeleton, compact failure panel and Retry |

Runtime artwork uses native embedded island/panorama images and approved vector masters, with hashes in `public/art/penpot/PROVENANCE.md`. Typography uses Kalam headings, Patrick Hand labels and Nunito body text; sources and notices are in `public/fonts/SOURCES.md`. Retired prototype PNGs and hand-drawn React SVG illustrations are removed. The decorative water pattern is an interface primitive following the reference, not a project fact.

## Dynamic adaptations and scope

- Labels, actors, rules, groups, outcomes, revisions and evidence come from saved project knowledge. Penpot's commerce facts are not imported. The three saved essential activities use the approved compact arrangement; this does not invent map relationships.
- Feature hero scenery uses the approved neutral island and the saved presentation icon. Domain-specific commerce hero art is not substituted for an unrelated project. Metadata shows the actual actor, evidence status and revision. Section controls focus existing content; they do not imply new routed tab views.
- Case panels grow with saved cases and explanations. Booking and approval calculations, query selection, browser Back, evidence, registered art and explicit unknown outcomes remain intact. Case outcomes are exposed as accessible button descriptions.
- Saved change selection lives in the URL and survives reload, browser Back and the activity's explicit return link. Historical snapshots remain separate from current behavior. A single saved change renders one row; absent impact commentary is not invented.
- The project picker and missing-route recovery compose existing shared controls. Empty storage stays empty; Refresh does not pretend to create a project. Loading never borrows another project's facts; refresh failures disclose retained knowledge inside the shared frame.
- Existing supported destinations remain reachable. This expanded cleanup covers existing desktop routes; it does not implement T010's six current destinations or interactive Feature Map. No backend/schema/migration/dependency changes were made. Mobile/tablet redesign remains deferred; existing narrow-width tests only guard regressions.

Proof data uses isolated temporary storage. Fixtures remain explicitly labelled and are not evidence of a real source product.

## Verification and independent review

Final `npm run validate` passed after all source changes: formatting, lint, typecheck, 60 unit/integration tests, 48 browser tests, production build, artifact isolation and production restart/shutdown smoke checks. `git diff --check` also passed.

Initial browser failures came from assumptions about the replaced layout and a duplicate fixture title. Assertions now exercise the selected historical detail, native scrolling to moved controls, current accessible headings and both empty-state images while retaining the underlying behavior checks. A new regression covers history selection through a related activity and explicit return.

Independent visual review caught the missing feature hero/top composition, thumbnail-only change scene, missing water/label styling and incorrect case-heading font. Independent code review caught lost change selection and inaccessible case status descriptions. Those findings were addressed before the final verification pass. A second independent visual review of Start Here, feature, changes, comparison, cases, browse and empty workspace found no remaining material mismatch against their named r227 references. This is supported-route desktop fidelity, not a claim that future destinations exist.

Local evidence is under `.local/t008/composition-rebuild/`: validation log, 18 desktop route/state screenshots, capture scripts and `comparison.html` with reference and implementation side by side. Baseline screenshots remain in `.local/t008/composition-review/`. These private inspection artifacts are not runtime assets. Tests cover loaded fonts/art, card containment, two-column geometry, centered empty states, loading/failure frame, selected outcomes, query/reload/Back, keyboard and long/sparse data. Visual comparison remains necessary alongside tests.

## Owner review and remaining roadmap

- [Start Here](http://127.0.0.1:4176/#/projects/publishing-studio)
- [Feature explanation](http://127.0.0.1:4176/#/projects/publishing-studio/explore/prepare-article?case=draft-complete&from=start)
- [Browse](http://127.0.0.1:4176/#/projects/publishing-studio/explore)
- [Recorded cases](http://127.0.0.1:4176/#/projects/publishing-studio/explore/approve-article?case=one-review)

Links require the isolated local proof process to remain running. Owner visual acceptance remains outstanding. T009 retains authored knowledge, compatible storage/API, capability discovery and authoring-skill work. T010 retains the six current desktop destinations and interactive Feature Map. This repair does not claim those capabilities or full-product completion.


## Current-state-only removal verification — 2026-09-29

`npm run validate` passed: formatting, lint, typecheck, 54 unit tests, 45 browser tests, build, artifact checks and production restart/shutdown smoke. Schema 1 and 2 upgrade tests preserve current knowledge and revision conflicts while removing snapshots. The obsolete changes route is unavailable and the browser makes no history request.

The isolated Publishing Studio preview was restarted with current code; overview and approval screenshots were visually inspected, with no browser errors or history navigation. Live Penpot revision 232 has no visible retired history labels or links to removed boards across its three pages. Start Here and Review Workspace were visually inspected. Native export fails with `No matching clause`; the local r227 file remains stale for retired history content and must be refreshed before claiming the full design handoff complete. Owner visual acceptance remains pending.


### Local design handoff refreshed — 2026-09-29

The owner-provided `New File 1 (3).penpot` is verified as revision 235 of the same design file. It replaces `.local/design/atlas.penpot` and is extracted under `.local/design/extracted/`. ZIP integrity, matching SHA-256, removed history boards and decorative step arrows, and absence of the visible sidebar tagline were checked. The old r227 copy is archived privately and superseded. The native-export blocker is resolved.
