# Atlas — Experience & Visual Design

**Version:** 0.9\
**Updated:** 2026-09-24\
**Status:** V1 design defaults settled for the first build; exact artwork, interaction quality, and learning value still require prototype validation.  
**Scope:** A reusable visual guide for saved web projects, rendered from SQLite through a small local backend; source context is prepared independently.

**Product name:** Atlas. Use this name in implemented UI copy; older branding in reference images is historical.

> Make understanding the product feel like exploring a clear, engaging explanation—not reading a generated wiki.

## Read this first

[PROJECT.md](PROJECT.md) owns the problem, requirements, scope, reasoning, and decision history; its [MVP features](PROJECT.md#mvp-features) section is the consolidated feature inventory. This file records the V1 defaults for turning that direction into an experience. It does not replace the project context or approve everything in the mockups.

**Inherited requirements:** visual-first, minimal text, precise behavior, source-side automatic initialization, evolving with source changes, and optional deeper exploration. No product-definition wizard, full 3D requirement, or giant graph by default.

**Clarified boundary:** `fill-atlas` inspects source evidence and creates a standalone context file only. No downstream tool, planner, or implementation instruction belongs in that skill or its output. Separately, the user's agent can turn that context into validated Atlas data updates. The file is not automatically interpreted or imported by the app; the skill never calls the database/API.

**V1 navigation, the case-switching interaction, and the booking fixture are starting decisions, not unanswered questions.** See [V1 defaults and prototype checks](PROJECT.md#16-v1-defaults-and-prototype-checks). Refine exact art, dimensions, and animation against the prototype instead of treating every screenshot detail as a requirement. [TECHNICAL.md](../technical/TECHNICAL.md) owns the build defaults; the repository already contains the static booking prototype; the source skill and database-backed platform remain unbuilt.

### The design in one glance

| Place | The question it answers |
|---|---|
| **Start here** | What does this product let people accomplish? |
| **Explore** | What does this particular activity do, and under what conditions? |
| **What changed** | What can the product do differently now? |

Source access and discovery happen outside Atlas. Use a small saved-project list or header switcher, then keep the three-place navigation inside the chosen project. This is not a connection wizard or multi-user workspace. Feature details, journeys, rules, and evidence stay within Explore. Project selection must not require writing product descriptions manually.

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

Show a one-sentence product purpose, where known, and a small selection of meaningful activities. Use illustrated subjects with short action labels—not a landscape of every feature.

Clicking an activity opens its explanation. A gentle guided path may connect the main activities, but users can skip directly to any feature through search. Returning should preserve orientation rather than move all the artwork after each update.

“Start here” is a learning introduction, not a claim that 20% of features account for 80% of usage. Propose essentials from the product's purpose, main journeys, prerequisites, and important restrictions. Do not fabricate usage rankings.

### Explore

Lead with a grouped, searchable collection of user activities. Opening a feature focuses the view on one explanation: **what you can do, who can do it, what happens, and what matters most**.

Use a scene, walkthrough, comparison, or small table according to the content. Selectable cases expose exceptions without filling the default screen with every rule. Essential restrictions remain visible in the initial explanation.

Offer a secondary **More detail** action for further recorded rules, related behavior, and supporting evidence. Terms can be explained inline; a separate glossary screen is not necessary initially.

A relationship needs a meaning: “requires,” “is blocked by,” or “triggers.” A bridge should not imply a relationship that the data does not establish.

### What changed

Show meaningful product changes as visual differences or short behavior stories—not one decorated card for every PR. Where the behavior changed, show the relevant before/after. Where a capability is new, explain the new action and its important condition.

Opening the change takes the user to the affected feature or scenario. PR and commit details remain secondary evidence. A refactor with no product-level behavior change need not create a learning item.

The same database-backed facts supply Explore and What changed. Historical comparisons retain explicit old snapshots. A separate validated data update changes the guide; a new source-context file alone does not. Refresh/refetch the selected project to load a coherent revision without rebuilding the app. “Merged” is not automatically “deployed.”

### Shared layout and navigation

**V1 layout default, not a pixel-perfect specification:** keep layout here rather than introduce a second `LAYOUT.md` that repeats the screen descriptions. Split the file only if a later design genuinely needs independent maintenance.

| Region | Default behavior |
|---|---|
| Compact header | Saved-project selection, project-scoped search, and optional incorporated-source revision; no implied live source connection |
| Primary navigation | Start here / Explore / What changed; no separate permanent Actors, Rules, Glossary, Analytics, or Visual Engine modules |
| Focus area | One selected activity or a small overview; its illustration, action label, and essential conditions dominate |
| Case controls | Clearly labelled alternatives adjacent to the affected scene; selecting one replaces the scenario, not the whole page |
| Optional detail | One drawer or detail view for supporting rules, evidence, or scoped relationships; closed by default |
| Return path | Breadcrumb/back action that restores the originating selection, search, and position |

On a wide desktop, center the explanation with comfortable whitespace. Open a single side drawer only while enough space remains for a legible scene. On narrower screens, details replace the focus area or flow below it; do not squeeze a sidebar, canvas, inspector, and metadata table into the viewport. Mobile uses a vertical sequence, not a shrunken desktop painting. Exact dimensions and breakpoints should be checked in the prototype rather than treated as product rules.

Keep feature and case identity stable during navigation. Opening evidence must not reset the chosen case. Closing a detail panel restores focus to its trigger. Expose a direct route to an activity from search; do not require traversal of every category or island. Minimize nested disclosure levels: progressive disclosure can become difficult to navigate when taken too far [R2].

### Arrival and return

Use Start here as the ordinary entry. Direct feature/case links open the selected explanation; What changed remains directly reachable. A changed-behavior preview can be tried in the prototype, but do not force a tutorial, invent a live notification, or require visit tracking to begin.

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

Keep current facts in SQLite and pass validated API data to scenes. Save supported scene kinds, layout/theme choices, asset references, and bindings to fact/case IDs; do not repeat the same rule in several pieces of visual prose. Compose a small set of reviewed patterns rather than force every feature into identical cards. A timeline and a permissions comparison can have distinct compositions with the same navigation, typography, art vocabulary, and controls. A new kind of interaction needs a reusable component—not arbitrary code stored with a project.

| Layer | V1 approach |
|---|---|
| Meaningful controls, labels, layouts | Normal accessible UI components |
| Icons, simple diagrams, animated states | Reusable SVG/vector components where suitable |
| Rich illustration, texture, visual atmosphere | A small stable asset collection; raster art is acceptable where useful |

Use image generation to explore style and, possibly, create selected stable production assets. Codex can implement components around reviewed assets and references; a PNG mockup is **not** automatically converted into a clean SVG library.

Choose or create the initial art collection once, check external asset licenses, and reuse it. Do not require a model to paint each feature again after every merge. An unfamiliar concept can fall back to a clear label and generic subject rather than a misleading invented icon.

Update project facts and supported visual settings through the backend; new project assets can be registered separately. None of those routine changes rebuilds Atlas. Only a new shared renderer or other application behavior requires development. Keep the React/SVG/Motion art direction. Do not add runtime model calls, a painting service, arbitrary markup, or a drag-and-drop editing suite. Actual assets and their rights still need review.

### Prove the art in code before scaling

Build one complete, attractive explanation with a **small reusable asset set**, not an entire illustration library. For the booking fixture this could use a customer, calendar/slot, booking token, clock, and distinct allowed/blocked/unknown states. Reuse those parts across cases.

Compare the running result with the approved visual qualities—warmth, legibility, meaningful subjects, restrained texture—not every pixel of a generated screenshot. Critical text and controls stay in the UI; stable raster illustration can provide texture, while SVG/HTML/CSS can express changing elements. Keep an external-asset license record when choosing real assets.

Test the same explanation component with a second, non-booking fixture before claiming generality. Reusing templates does not mean forcing every behavior into the same diagram. If the selected pattern cannot express an important condition, use an honest compact comparison or another reviewed pattern rather than hide it. No runtime painting service, universal scene generator, or new diagram framework is required for this proof.

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

**Review verdict:** the requirements and art direction are sufficient to begin a bounded interactive prototype. They are not a validated interaction design or a tested source-understanding skill. Most missing pieces are decisions to test, not new documents to write.

GOV.UK's design guidance recommends prototypes before committing to a full build and identifies coded prototypes as useful for realistic interaction testing [R1]. For Atlas, the first-build default is **high visual fidelity for one small experience, backed by the minimal real API and SQLite data path**. Do not build a larger platform around it.

### First prototype: one learning loop

Seed the illustrative **Reschedule a booking** fixture above into SQLite through the validated write path for the first end-to-end test. It is the selected demo, not a real source repository or a narrowed product market. Keep it explicitly labelled as fixture content.

`Start here → select Reschedule → inspect a case → open/close a reason → compare a change → return`

Implement enough of Explore/search and What changed to exercise this route. Do not create non-working menus for every reference-screen widget. Clearly label fixture data; no real booking action or repository connection occurs in this prototype.

Demonstrate the allowed, time-blocked, occupied-slot, and ownership cases from section 1; one uncertain outcome; and the 48-to-24-hour rule update. The explanation should display recorded examples, not attempt to compute every possible booking outcome. A development-only state selector can exercise an empty guide, partial knowledge, no search result, and unknown outcome without implying a real source connection.

### Internal explanation content—not a skill output contract

The context skill outputs ordinary Markdown for independent use. Atlas stores accumulated knowledge in SQLite, not in source-code content modules or a pile of PR briefs. The table below describes data the backend must store/validate; it is not the skill's output contract. Refine the actual tables and request schema during implementation. The explanation needs enough information for:

| Content | Purpose |
|---|---|
| Stable activity ID, title, actor, purpose | Identify the activity and explain the allowed action |
| Cases with conditions, steps, outcome, essential restrictions | Select precise documented behavior and render it consistently |
| Source references and evidence status | Distinguish supported knowledge, fixtures, and uncertainty |
| Revision and before/after references | Show a change without mixing historical and current behavior |
| Typed links to relevant activities | Permit local exploration without a global graph |

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
| Reuse | The same unchanged application build displays two saved projects with different content/settings. |
| Persistence | A valid rule update appears after refresh without rebuilding; an invalid update leaves the prior explanation intact. |

Test by asking someone to accomplish a believable task, not leading them through predetermined button presses; this follows moderated usability-testing guidance [R6]. An informal comprehension check is for evaluating the prototype, not a compulsory in-app quiz. Returning later and observing actual use is more meaningful for this personal goal than simply liking the first screenshot. No improvement percentage or guaranteed learning outcome is established yet.

### After the interaction works

Use one authorized small source PR to test **evidence → accurate standalone context**. Separately test whether an agent can use that context to submit an accurate, validated database update, which the unchanged Atlas app renders. The skill must not require Atlas access or contain downstream workflow instructions. Keep source access bounded, exclude secrets, and label the analyzed revision. Fixtures validate rendering, not source-understanding accuracy.

Check one change that affects a rule, one that adds/removes behavior, and one refactor with no product effect. The refactor must not invent a new learning item. Preserve the existing explanation on extraction failure and avoid publishing conflicting versions.

[TECHNICAL.md](../technical/TECHNICAL.md) supplies the revised defaults: the existing visual frontend, a small local backend, one SQLite database, strict writes, and reusable data-bound components. No internal analysis agent, source watcher, raw-context interpreter, separate writer service, independent layout document, or tool-coupled handoff protocol is needed.

### Prototype checks, not unresolved scope

The navigation, learning loop, and booking fixture are selected. Implement and test them. Choose actual assets and refine layout dimensions while building; verify their rights and the browser result. Select one real repository/PR later for the separate skill test. Enjoyment, comprehension, reuse across another domain, and source accuracy remain unproven until exercised. Large-repository discovery and broad integrations remain deferred. No new planning document is needed.

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
| 0.8 | 2026-09-24 | Settled the three-place navigation, recorded-case interaction, booking fixture, and reusable visual approach as V1 defaults. Replaced stale open questions with implementation and prototype checks; no new product features or completed tests. |
| 0.9 | 2026-09-24 | Aligned the visual experience with saved project selection, SQLite-backed facts, validated updates, and no-rebuild rendering. Replaced obsolete frontend-only assumptions without changing the art direction or independent skill. |
