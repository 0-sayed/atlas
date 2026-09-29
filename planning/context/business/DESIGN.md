# Atlas — Experience & Visual Design

**Version:** 0.12\
**Updated:** 2026-09-28\
**Status:** Seven-destination desktop direction approved and reviewed in Penpot. T006 is a committed, limited application foundation; full destination support, browser visual acceptance and human usefulness remain pending. This architecture refresh is proposed for owner review, not implementation authorization.\
**Scope:** A reusable visual guide for saved web projects, rendered from SQLite through a small local backend; source context is prepared independently.

**Penpot lookup:** [Design reference](../design-reference.md) contains verified page/board links, shared component IDs, task mappings and export status. Start there to inspect the actual design; this document owns experience rules.

**Product name:** Atlas. Use this name in implemented UI copy; older branding in reference images is historical.

> Make understanding the product feel like exploring a clear, engaging explanation—not reading a generated wiki.

## Read this first

[PROJECT.md](PROJECT.md) owns the problem, requirements, scope, reasoning, and decision history; its [MVP features](PROJECT.md#mvp-features) section is the consolidated feature inventory. This file records the V1 defaults for turning that direction into an experience. It does not replace the project context or approve everything in the mockups.

**Inherited requirements:** visual-first, minimal text, precise behavior, source-side automatic initialization, evolving with source changes, and optional deeper exploration. No product-definition wizard, full 3D requirement, or giant graph by default.

**Clarified boundary:** `fill-atlas` inspects source evidence and creates a standalone context file only. No downstream tool, planner, or implementation instruction belongs in that skill or its output. Separately, the user's agent can turn that context into validated Atlas data updates. The file is not automatically interpreted or imported by the app; the skill never calls the database/API.

**The fixed seven-destination frame is the approved direction.** Case switching remains a useful feature interaction. The booking fixture is optional historical test content. See [V1 defaults and prototype checks](PROJECT.md#16-v1-defaults-and-prototype-checks). The API, SQLite platform, project-scoped exploration and source skill exist. T006 adds a limited shared visual foundation, while the reviewed desktop Penpot design is a reference rather than working application behavior. [TECHNICAL.md](../technical/TECHNICAL.md) owns the backend baseline.

### Shared frame, project-specific explanation

Atlas starts with no projects. The target design keeps seven sidebar destinations, design tokens, reusable components and interaction rules consistent. Saved project titles, activities, authored steps, actor participation, identifiable rules, cases/outcomes, typed evidenced relationships, explicit journeys, glossary entries and artwork choices vary through the API. The desktop sidebar holds project navigation. Feature-local tabs belong to the selected explanation; search filters and grouping derive from saved project data. Neither changes the seven destinations. No project-specific navigation is invented when no project is selected. Tablet and mobile design completion is deferred; existing responsive behavior must not regress.

The overview curates saved essentials in an illustrated landscape, with all activities reachable through Feature Map. Without an authored selection, show a stable unprioritized subset and label it honestly. Grouping and responsive layout set visible complexity; there is no universal island count or page size. Terrain is a reusable visual surface, not a claim that each feature is an isolated island or that decorative paths imply dependencies. Actual relationships retain explicit saved meanings.

Optional feature `presentation` selects `calendar`, `document`, `compass`, `parcel` or `people` and `sky`, `sage` or `peach`. Absent settings use scene defaults, so older knowledge stays readable. These settings change artwork, not facts or behavior. `assetIds` still attach supporting registered artwork; they do not replace scene controls or act as a full-screen page. Arbitrary layouts, JSX, SVG markup and executable configuration are not stored in the database.

The companion `update-atlas` skill owns preparation and incorporation under the user's instruction. Its present API/art references explain source-fit checks, supported artwork, image provenance, registration, scoped revision-checked updates and browser verification. T009 proposes extending its capability checks alongside new contracts; until then it must report unsupported source behavior explicitly. It does not expand `fill-atlas` or promise arbitrary scenes without application work.

### The design in one glance

| Place | The question it answers |
|---|---|
| **Start Here** | What does this product let people accomplish? |
| **Feature Map** | Which activities are recorded, and how are they related? |
| **User Journeys** | What authored sequence helps someone reach a goal? |
| **Actors** | Who participates in recorded activities? |
| **Rules** | Which identifiable conditions govern behavior? |
| **Glossary** | What do recorded product terms mean? |
| **Recent Changes** | What can the product do differently now? |

Source access and discovery happen outside Atlas. Use a saved-project list or header switcher, then keep these seven destinations inside the chosen project. Each destination has an honest empty state when its facts are absent. Feature details retain local tabs/cases and evidence; the map can use project-driven grouping and filters. Project selection must not require writing product descriptions manually.

---

## 1. The first interaction to prototype

A person returns after building a feature. Instead of receiving another PR-summary paragraph, they encounter a small visual explanation of the changed behavior. They can inspect an example, compare an important exception, and return to the product overview.

`Notice a change → see the behavior → inspect a condition → understand its consequence`

Exploration must be optional and self-directed. Do not require a quiz, complete a lesson, or earn points to access information. A walkthrough explains recorded behavior; it does not operate the real application or simulate its entire business.

**V1 core interaction:** select a documented case, see its conditions and outcome change in the same scene, and optionally inspect the reason. Clicking should reveal a consequence, not just open another prose card. A Next/Back control can step through an explanation, but the outcome and essential restrictions are available immediately; no compulsory slideshow.

Use recognizable subjects, short action labels, and stable positions. Recognition cues can help people find familiar information without recalling exact feature names [R3]. This is a design rationale, not evidence that our particular illustrations improve retention.

### Illustrative walkthrough—not a chosen MVP domain

**Demo feature: Reschedule a booking.** These are invented prototype rules, not extracted facts:

- A customer may move their own confirmed booking.
- At least 24 hours must remain before the original start time.
- The replacement slot must be available.

The default scene shows **your confirmed booking → choose a free slot → booking moved**, with the time restriction visible beside the action. Selecting another documented case changes the explanation:

| Example case | Outcome shown |
|---|---|
| Exactly 24 hours remain; replacement slot is free | Rescheduling allowed |
| Less than 24 hours remain | Rescheduling blocked by the time restriction |
| Replacement slot is occupied | Choose another slot |
| Booking belongs to someone else | This customer cannot reschedule it |

The first three cases assume the customer owns a confirmed booking; the last case varies ownership while the time and availability checks pass. Keep other conditions fixed when explaining one difference.

**Illustrative update:** a prototype fixture changes the required notice from **48 hours to 24 hours**. With the same owned, confirmed booking, a free replacement slot, and **36 hours remaining**, show **Previously blocked → Now allowed**. Label both fixture versions. This supplies a precise before/after without inventing measured business impact.

Do not shorten the headline to “Move any booking.” Do not invent an exception just to fill a visual template. Prototype fixtures may be curated for testing; that does **not** become manual onboarding for the end user.

---

## 2. V1 screens and interactions

### Start here

Show a one-sentence product purpose, where known, and an authored selection of meaningful activities in a continuous illustrated landscape. Use live, clickable labels; keep the full collection reachable through Feature Map.

Clicking an activity opens its explanation. Only authored journeys get ordered arrows; decorative paths must not imply product flow. Users can skip directly to any feature through search. Returning should preserve orientation rather than move all the artwork after each update.

“Start here” is a learning introduction, not a claim that 20% of features account for 80% of usage. Propose essentials from the product's purpose, main journeys, prerequisites, and important restrictions. Do not fabricate usage rankings.

### Feature Map and feature explanation

Lead with a grouped, searchable collection of user activities. Opening a feature focuses the view on one explanation: **what you can do, who can do it, what happens, and what matters most**.

Use a scene, walkthrough, comparison, or small table according to the content. Selectable cases expose exceptions without filling the default screen with every rule. Essential restrictions remain visible in the initial explanation.

Offer a secondary **More detail** action for further recorded rules, related behavior, and supporting evidence. Terms can be explained inline in feature details; the fixed Glossary destination indexes saved definitions when present and shows an honest empty state otherwise.

A relationship needs a meaning: “requires,” “is blocked by,” or “triggers.” A bridge should not imply a relationship that the data does not establish.

### User Journeys, Actors, Rules, and Glossary

User Journeys display authored ordered steps and goals, never inferred dependency chains. Actors show recorded participation without invented biographies or permissions. Rules form a searchable index of identifiable, evidenced conditions linked to affected features and cases. Glossary entries provide saved definitions and relevant links when known; no entry is required to fill a screen. Optional domains may group a large project without imposing a universal taxonomy. These sections belong to the full desktop product after the two-screen visual proof; the current booking, approval and navigation scene types are not a universal web-app model.

### Recent Changes

Show meaningful product changes as visual differences or short behavior stories—not one decorated card for every PR. Where the behavior changed, show the relevant before/after. Where a capability is new, explain the new action and its important condition.

Opening the change takes the user to the affected feature or scenario. PR and commit details remain secondary evidence. A refactor with no product-level behavior change need not create a learning item.

The same database-backed facts supply Feature Map and Recent Changes. Historical comparisons retain explicit old snapshots. A separate validated data update changes the guide; a new source-context file alone does not. Refresh/refetch the selected project to load a coherent revision without rebuilding the app. “Merged” is not automatically “deployed.”

### Shared layout and navigation

**V1 layout default, not a pixel-perfect specification:** keep layout here rather than introduce a second `LAYOUT.md` that repeats the screen descriptions. Split the file only if a later design genuinely needs independent maintenance.

| Region | Default behavior |
|---|---|
| Shared frame | Atlas home and saved-project selection; no implied live source connection |
| Primary navigation | Fixed seven project destinations in the desktop sidebar; compact navigation on small screens. Feature-local tabs and data-driven map filters remain separate controls. |
| Focus area | One selected activity or a small overview; its illustration, action label, and essential conditions dominate |
| Case controls | Clearly labelled alternatives adjacent to the affected scene; selecting one replaces the scenario, not the whole page |
| Optional detail | One drawer or detail view for supporting rules, evidence, or scoped relationships; closed by default |
| Return path | Breadcrumb/back action that restores the originating selection, search, and position |

On a wide desktop, center the explanation with comfortable whitespace. Open a single side drawer only while enough space remains for a legible scene. Existing narrow-screen behavior should keep content and controls usable while the tablet and mobile designs are deferred. Exact dimensions and breakpoints should be checked in the running app rather than treated as product rules.

Keep feature and case identity stable during navigation. Opening evidence must not reset the chosen case. Closing a detail panel restores focus to its trigger. Expose a direct route to an activity from search; do not require traversal of every category or island. Minimize nested disclosure levels: progressive disclosure can become difficult to navigate when taken too far [R2].

### Arrival and return

Use Start Here as the ordinary entry. Direct feature/case links open the selected explanation; Recent Changes remains directly reachable. A changed-behavior preview can be tried in the prototype, but do not force a tutorial, invent a live notification, or require visit tracking to begin.

For the prototype, show one illustrative change. For later real updates, group related work by affected behavior since the prior visit rather than forcing one item per PR. A lightweight local last-visited/version marker is a possible implementation, not an analytics platform. Opening an item means **seen**, not **learned**; do not invent mastery scores or a backlog the user must clear.

---

## 3. Initialization, gaps, and update states

The independent source skill identifies existing behavior and writes context. A separate agent-authored, backend-validated write populates or updates SQLite. The UI does not scan a repository, interpret context Markdown, or run an agent.

| Situation | What to show |
|---|---|
| No projects saved | An honest empty state; no invented capabilities or manual product-definition wizard. The local data API is the preparation route, not an “Analyze now” button. |
| Project saved with scaffolding-only evidence | A selected project with no implemented features found in the stated scope. |
| Project data loading | A brief loading state distinct from “empty”; do not flash another project's cached content. |
| Existing facts loaded | Activities at their incorporated source revisions, with scope limits. |
| Partial/conflicting evidence | Known conditions plus explicit uncertainty near the affected claim. |
| No matching activity | Keep the query and a clear return path within the project. |
| Saved data has changed | A refresh loads the new coherent revision; ordinary data changes require no app rebuild. No push notifications are required. |
| Save rejected or backend unavailable | Do not claim success. A failed write preserves the old database state. Keep already-loaded content available as last loaded, with retry when appropriate. |
| Unknown project, retired feature, or missing asset | Explain what is unavailable; do not substitute another project's data or invent a result. |

Project ID, feature ID, and selected revision belong in navigation/cache identity. Switching projects must not carry a prior project's case or evidence into the next scene. While exploring, hold one consistent loaded revision; do not mix old cases with newly fetched rules. A simple Refresh is sufficient initially.

Fixtures stay labelled. Corrections go through the same validated data-write path, retaining evidence and a reason. A manual feedback form, complete editing suite, and live source synchronization remain out of scope.

---

## 4. Visual grammar and information density

### Pick the visual for the question

| Question | Default explanation pattern |
|---|---|
| What can I do? | An illustrated action with a short caption |
| What happens next? | A short step-by-step scene or status sequence |
| When does this behave differently? | A selectable or side-by-side case comparison |
| Who is allowed? | A compact role comparison or permissions table |
| What changed? | Before/after behavior with the changed condition highlighted |

These are reusable patterns, not separate application modules. Islands may provide an attractive overview treatment; they are not the required shape of every feature.

### Reading budget

Aim for one main subject per view, short labels, a one-sentence purpose, and only the essential visible conditions. A handful of overview items and a few visible rules are **layout starting points, not universal limits**.

Never truncate away a condition that changes the meaning. Group or recompose the explanation rather than replacing precise behavior with a vague caption. More detail stays available without becoming the default experience.

Avoid repeated descriptions in the title, subtitle, sidebar, and footer. Avoid decorative statistics, metadata grids, and inspirational slogans that compete with the explanation.

### House style to try first

Use a light, warm, colorful illustrated style with soft shapes and generous space. Keep hand-drawn accents mainly in headings and illustrations; ordinary labels and rules should remain highly readable.

Use 2D or restrained 2.5D composition. Motion should reveal a state transition, focus attention, or preserve orientation—not make the user navigate a game world. No full 3D engine is required for this draft.

Color supplements labels and symbols; it must not be the only way to understand a state. Interactions should support keyboard use, visible focus, reduced motion, and an optional concise text equivalent. A usable small-screen arrangement should prioritize the selected explanation over surrounding scenery.

Prefer brief, user-triggered motion that reveals a meaningful state change over constant moving scenery [R4]. Offer the same outcome immediately with reduced motion; W3C guidance explicitly addresses disabling nonessential interaction-triggered motion [R5]. Decorative assets should not create extra focus stops or imply actions/relationships that do not exist.

---

## 5. Depth without a wall of text

**Inherited requirement:** Essentials first; more complete discovered knowledge remains accessible.

For hundreds or thousands of features, group by meaningful activities, make search direct, and expose one area or feature at a time. A feature shared across journeys points to one record, not several conflicting descriptions.

Advanced exploration means more questions and details are reachable—not all nodes, panels, and edges appearing at once. Expand a feature's relevant connections selectively. Show the existence of additional recorded relationships and allow access to them; do not silently discard them.

Keep a navigation trail, stable feature identity, and a straightforward way back. Bound relationship expansion so a cycle does not create an endless map. Only render the portion currently being explored.

Do not label the discovered collection “everything in the business” unless that completeness can actually be established. Important uncertainty belongs near the affected statement; evidence and version detail can otherwise stay behind an optional action.

---

## 6. How Codex would build the visuals

**V1 production approach:** separate meaning, presentation, and artwork.

`Saved project facts + supported scene settings + asset references → reusable React/SVG components → visual explanation`

The context skill does not specify or invoke the separate data-preparation process. Its Markdown is not the render schema. The running interface displays the selected project from the API, not its context file as a documentation panel.

The implementation should assemble a small set of consistent components. Product names, rules, captions, controls, and evidence links remain real interface content—not text baked into a generated full-screen image.

Keep current facts in SQLite and pass validated API data to scenes. The proposed authored activity records a stable identity and purpose; actors and participation; ordered behavior steps; identifiable rules and conditions; recorded cases and outcomes; typed, evidenced relationships; and optional journey, term and artwork references. Absence remains absence. Short and long collections must reflow without a fixed three-item cap or a per-project code edit. Save supported presentation choices and bindings to fact/case IDs; do not repeat the same rule in several pieces of visual prose. Compose a small set of reviewed patterns rather than force every feature into identical cards. A timeline and a permissions comparison can have distinct compositions with the same navigation, typography, art vocabulary, and controls. A new kind of interaction needs a reusable component and a declared authoring capability.

This is a bounded, domain-neutral explanation model, not an arbitrary UI language or source-product simulator. A saved case reports an evidenced outcome under its recorded conditions; Atlas does not calculate unseen outcomes. If a source activity cannot be expressed accurately by a supported pattern, authoring reports the gap and the guide shows only supported facts. There is no guarantee that every web app fits the initial pattern set.

| Layer | V1 approach |
|---|---|
| Meaningful controls, labels, layouts | Shared Atlas components with native controls and visible focus |
| Icons, simple diagrams, animated states | Reusable SVG/vector components where suitable |
| Rich illustration, texture, visual atmosphere | A small stable asset collection; raster art is acceptable where useful |

Use image generation to explore style and, possibly, create selected stable production assets. Codex can implement components around reviewed assets and references; a PNG mockup is **not** automatically converted into a clean SVG library.

Choose or create the initial art collection once, check external asset licenses, and reuse it. Do not require a model to paint each feature again after every merge. An unfamiliar concept can fall back to a clear label and generic subject rather than a misleading invented icon.

Update project facts and supported visual settings through the backend; new project assets can be registered separately. None of those routine changes rebuilds Atlas. Only a new shared renderer or other application behavior requires development. Keep the React/SVG illustrated art direction and reduced-motion-safe behavior; Motion is not a selected new dependency. Do not add runtime model calls, a painting service, arbitrary markup, or a drag-and-drop editing suite. Actual assets and their rights still need review.

The desktop Penpot file supplies the reviewed visual reference: fixed navigation, typography and color tokens, reusable controls, layout patterns, illustration vocabulary and usage rules. Implement them as one Atlas design system. Prefer native buttons, links and inputs for simple interactions. Use Radix primitives selectively when a complex focus-managed widget needs them; style any primitive with Atlas tokens and test its keyboard behavior. shadcn is not an application baseline or a replacement for these rules. The present React/Tailwind code does not establish Radix or shadcn as installed dependencies. Preserve visible focus, clear unavailable states and reduced-motion-safe transitions.

### Compact, content-driven component rules

- Cards contain their title, body and actions; height follows actual content plus shared padding. Keep related content close without clipping text or crowding controls. Equal-height comparison rows and map canvases can retain purposeful space.
- Buttons and badges fit their labels and padding instead of stretching across unused space. Group related actions with a consistent gap; let long labels wrap and controls grow while preserving usable targets and visible focus.
- Align icons with their text and center standalone icon captions beneath the artwork. Keep decorative arrows out of button labels. Use directional connectors only for recorded flows or relationships, centered in the gap between the connected items.
- Verify short, long and absent optional content in the running composition. In the legacy Penpot Section component, body content is a scene sibling outside the linked header/background master: auto-sizing that master alone does not contain the body. Restructure and verify the whole composition before changing shared sizing; runtime cards must own all their content.

### Prove the art in code before scaling

For the separately authorized T008 proof, refine the existing Publishing Studio overview and one supported navigation-feature explanation with a **small reusable asset set**. Use the approved local Penpot snapshot identified by the [design reference](../design-reference.md) and only facts supported by the existing dataset and contract. The booking art proof was historical; it is not the next screen to build.

Compare the running result with the approved visual qualities—warmth, legibility, meaningful subjects, restrained texture—not every pixel of a generated screenshot. Critical text and controls stay in the UI; stable raster illustration can provide texture, while SVG/HTML/CSS can express changing elements. Keep an external-asset license record when choosing real assets.

The historical second-fixture check is not the final generality gate; T011 requires three distinct domains, including at least two reviewed real-source projects. Reusing templates does not mean forcing every behavior into the same diagram. If the selected pattern cannot express an important condition, use an honest compact comparison or another reviewed pattern rather than hide it. No runtime painting service, universal scene generator, or new diagram framework is required for this proof.

---

## 7. Use the references selectively

The visual links resolve within this planning context; this file does not embed the images.

| Reference | Borrow | Do not inherit |
|---|---|---|
| [Menu inspiration](references/inspiration/annotated-menu.png) | Recognizable subject, brief annotations, whitespace | A fixed restaurant/menu layout for every feature |
| [Original product map](references/concepts/original-overview.png) | Color, softness, inviting art direction | One island per feature or unlabeled relationships |
| [Feature explanation](references/concepts/cancel-order.png) | Illustrated steps and concrete conditions | Fictional rules, duplicated panels, or the full screen density |
| [Change visualization](references/concepts/changes.png) | The connection between work and new product meaning | Another PR feed, fake update timings, or inferred business benefits |

The retained reference guide is in [PROJECT.md](PROJECT.md#15-visual-reference-guide). Superseded onboarding and scanner mockups are no longer packaged. No screenshot adds an unapproved feature or changes the source-context-only skill boundary.

---

## 8. Next design checkpoint

**Review verdict:** the desktop Penpot reference has been reviewed, including final cleanup and interaction checks. Its static compositions do not prove that arbitrary short, long or missing project content reflows in the application. T006 remains a limited foundation (commit `ac10c83`); the running two-screen visual proof and seven working destinations remain to be accepted.

GOV.UK's design guidance recommends prototypes before committing to a full build and identifies coded prototypes as useful for realistic interaction testing [R1]. For Atlas, T008's next proof is **a running illustrated Start Here overview and one feature explanation using the existing API and SQLite path**, checked against the reviewed desktop design. The seven destinations are the full-product direction; this proof does not mean all seven views or their contracts are complete.

### Historical booking learning loop and current visual proof

The illustrative **Reschedule a booking** fixture above was the earlier end-to-end behavior test. It is not a real source repository or a narrowed product market. Keep it explicitly labelled as fixture content.

`Start Here → select a documented feature → inspect a case → open/close a reason → return`

The booking loop remains a historical fixture test. T006 uses labelled Publishing Studio demo data for the overview and navigation-feature explanation. T008 must evaluate these running screens against the reviewed desktop design. Additional destinations may have honest empty states until their authored data and views are implemented. No real booking or publishing action occurs in Atlas.

The historical booking fixture demonstrates allowed, time-blocked, occupied-slot and ownership cases from section 1; one uncertain outcome; and the 48-to-24-hour rule update. The explanation displays recorded examples, not computed booking outcomes. Empty, partial, no-result and unknown states must never imply a live source connection.

### Internal explanation content—not a skill output contract

The context skill outputs ordinary Markdown for independent use. Atlas stores accumulated knowledge in SQLite, not in source-code content modules or a pile of PR briefs. The table below describes data the backend must store/validate; it is not the skill's output contract. Refine the actual tables and request schema during implementation. The explanation needs enough information for:

| Content | Purpose |
|---|---|
| Stable activity ID, title, actor, purpose | Identify the activity and explain the allowed action |
| Cases with conditions, steps, outcome, essential restrictions | Select precise documented behavior and render it consistently |
| Source references and evidence status | Distinguish supported knowledge, fixtures, and uncertainty |
| Revision and before/after references | Show a change without mixing historical and current behavior |
| Typed links to relevant activities | Permit local exploration without a global graph |
| Authored behavior steps, actor participation, identifiable rules | Explain varied web-app activities without squeezing every fact into the current three scene kinds |
| Explicit journeys, glossary, optional domains | Support the other project destinations only where reviewed knowledge exists |

This describes meaning, not a demand for one SQL table per noun. Persist identity/relationships explicitly and validate nested presentation settings. Seed labelled prototype examples into the database; do not execute source-context content as code or evaluate arbitrary generated expressions to decide outcomes. Normal reviewed scene code can select explicit saved cases; it does not reimplement the source business engine. Both the simple view and optional detail consume the same facts. The activity's fixture source must be labelled as a fixture, not disguised as a real PR or test result.

### What to check before building more

| Check | What would count as a useful result |
|---|---|
| Meaning | Sayed can describe who may reschedule, the time restriction, and a blocked case without opening code |
| Interaction | A selected condition visibly changes the explanation; back/search/evidence do not lose his place |
| Return value | Revisiting a changed rule is appealing and useful, not another obligation to read a feed |
| Honesty | Unknown remains unknown; a demo or repository revision is not labelled as deployed production behavior |
| Production art | A reusable implementation captures the desired style without per-feature paintings or text baked into images |
| Usability | Core interactions work with keyboard and reduced motion; narrow layouts remain readable |
| Reuse | The same unchanged application build displays three distinct domain datasets; at least two come from reviewed authorized real sources. No per-project code changes, invented facts or cross-project leakage. |
| Variable content | Short and long collections, missing optional journeys/terms/art and unsupported activity patterns remain legible and explicitly identified. |
| Persistence | A valid rule update appears after refresh without rebuilding; an invalid update leaves the prior explanation intact. |

Test by asking someone to accomplish a believable task, not leading them through predetermined button presses; this follows moderated usability-testing guidance [R6]. An informal comprehension check is for evaluating the prototype, not a compulsory in-app quiz. Returning later and observing actual use is more meaningful for this personal goal than simply liking the first screenshot. No improvement percentage or guaranteed learning outcome is established yet.

### After the interaction works

Use at least two reviewed, authorized real-source projects to test **evidence → accurate standalone context → validated Atlas update → same-build guide**. The independent `fill-atlas` skill stops at context; the separate capability-aware `update-atlas` workflow may incorporate reviewed knowledge. Keep source access bounded, exclude secrets, and label analyzed revisions. A third distinct domain may be synthetic and must be labelled. Fixtures validate rendering, not source-understanding accuracy.

Check one change that affects a rule, one that adds/removes behavior, and one refactor with no product effect. The refactor must not invent a new learning item. Preserve the existing explanation on extraction failure and avoid publishing conflicting versions.

[TECHNICAL.md](../technical/TECHNICAL.md) supplies the revised defaults: the existing visual frontend, a small local backend, one SQLite database, strict writes, and reusable data-bound components. No internal analysis agent, source watcher, raw-context interpreter, separate writer service, independent layout document, or tool-coupled handoff protocol is needed.

### Proposed desktop sequence

T007 reconciles the handoff and acceptance boundaries. T008 verifies the two-screen visual proof in the browser. T009 extends strict project knowledge, presentation capabilities and `update-atlas` together. T010 completes the remaining desktop destinations and map. T011 runs the three-domain same-build acceptance above. This sequence is for owner review; it does not authorize implementation. Tablet and mobile design completion remains deferred, while existing responsive checks must continue passing. Enjoyment, comprehension and source accuracy remain unproven until exercised. Large-repository discovery and broad integrations remain deferred.

## 9. Research informing this review

Accessed 2026-09-24. These sources support design/testing principles, not a claim that Atlas has been validated. The sources support the design principles, not our particular mockups. The V1 defaults above were settled in discussion; exact art and effectiveness still require testing.

- **[R1]** GOV.UK, [Making prototypes](https://www.gov.uk/service-manual/design/making-prototypes): test ideas and realistic interactions before committing to the service implementation.
- **[R2]** Nielsen Norman Group, [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): separate essential from optional detail and avoid excessive navigation depth.
- **[R3]** Nielsen Norman Group, [Memory Recognition and Recall in User Interfaces](https://www.nngroup.com/articles/recognition-and-recall/): use visible context and recognizable choices rather than requiring exact recall.
- **[R4]** Nielsen Norman Group, [The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/): use restrained motion for feedback and state changes, rather than distracting animation.
- **[R5]** W3C, [Understanding SC 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): nonessential interaction-triggered animation should be disableable; this is Level AAA guidance, not a claim that our prototype is WCAG-conformant.
- **[R6]** GOV.UK, [Using moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing): test believable tasks with neutral instructions; distinguish dummy-data insights from real-context evidence.

### Change log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-24 | Initial proposed experience and visual-design companion; separated inherited requirements from candidate screens, interactions, and art choices. |
| 0.2 | 2026-09-24 | Reviewed documents and selected mockups; proposed a shared layout, concrete case/change interaction, minimal fixture contract, art proof, and staged prototype checks. Added source-backed rationale. No new product requirements approved; no prototype built. |
| 0.3 | 2026-09-24 | Separated standalone source-context generation from visual implementation. Removed required runtime scanning/import assumptions; context skill and template contain no downstream workflow dependency. The design remains a proposal. |
| 0.4 | 2026-09-24 | Reconciled the experience with frontend-only Atlas, explicit development updates, shared repository-backed facts, current/history separation, and reusable but non-rigid scenes. Linked the technical baseline; no application test is claimed. |
| 0.5 | 2026-09-24 | Aligned the document and future UI naming with the confirmed project name Atlas. Historical mockups remain unchanged; visual direction and scope are unchanged. |
| 0.6 | 2026-09-24 | Packaging-only cleanup: moved this document to docs/ and updated links to grouped reference images. Design behavior and reference status are unchanged. |
| 0.7 | 2026-09-24 | Linked the consolidated MVP inventory and aligned reference guidance with removal of superseded mockups. Design behavior is unchanged. |
| 0.8 | 2026-09-24 | Historical: settled the three-place navigation, recorded-case interaction, booking fixture, and reusable visual approach as V1 defaults; navigation was superseded in v0.11. |
| 0.9 | 2026-09-24 | Aligned the visual experience with saved project selection, SQLite-backed facts, validated updates, and no-rebuild rendering. Replaced obsolete frontend-only assumptions without changing the art direction or independent skill. |
| 0.11 | 2026-09-25 | Superseded the earlier three-place recommendation with seven fixed project destinations; defined the first two-screen visual proof and deferred full-view contracts and visual acceptance. |
| 0.12 | 2026-09-28 | Distinguished T006, reviewed desktop Penpot and target behavior; specified bounded authored activities, design-system choices and T007–T011 acceptance. Documentation proposal only. |
