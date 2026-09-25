# Atlas — Living Project Context

**Version:** 0.10\
**Last updated:** 2026-09-24  
**Owner:** Sayed  
**Stage:** Revised first-build handoff: a reusable, database-backed local Atlas application. The static frontend and labelled booking learning loop are delivered; database migration, dynamic multi-project reuse, real-source accuracy, and the independent skill still require implementation or validation.\
**Project name:** Atlas — confirmed by Sayed on 2026-09-24. Use Atlas in product titles, documentation, and future UI copy.

> **North star:** Make it enjoyable to understand and remember what I built, without making me read documentation.

This is a working record of the decisions, constraints, reasoning, V1 defaults, and prototype checks from the project conversation. It is not a transcript, a frozen specification, or an instruction to implement every idea below. The complete document is for preserving context; its length is not a template for the application's UI.

**Design companion:** [DESIGN.md](DESIGN.md) v0.9 records the V1 navigation, interactions, reading budget, and art-production defaults. Exact compositions and usability still need prototype review. This document continues to own product requirements and scope; a build default is not evidence of a validated experience.

**Technical companion:** [TECHNICAL.md](../technical/TECHNICAL.md) v0.6 records the React interface, small local backend, one SQLite database, validated data updates, and implementation checks. [README.md](../README.md) provides the shortest entry into this pack and states what has actually been reviewed.

---

## 1. Read this first

### The problem

Sayed builds software quickly with coding agents and Dark Factory, but struggles to retain what features exist, how they behave, and which product rules matter. He already stopped reading a skill's short PR summaries. More text is not the solution.

### The product

Atlas is a reusable, colorful, interactive guide to what web products do. One Atlas application renders separately stored project knowledge and visual settings. Adding a project or updating its facts does not require rebuilding the application.

**Feature list:** [MVP features](#mvp-features) owns the feature inventory; no separate FEATURES.md is needed.

### Requirements to preserve

- **Human understanding first:** enjoyable, visual-first, minimal text, precise behavior, and optional depth. Not a generated wiki or another agent manager.
- **Web apps first:** mostly greenfield and small existing codebases; no e-commerce-only assumptions. Terminal tools and libraries are outside the MVP.
- **Independent source preparation:** `fill-atlas` inspects authorized source evidence, writes standalone Markdown context, and stops. No downstream planner, database calls, implementation instructions, or Atlas dependency belongs in it.
- **Automatic new/existing handling is source-side:** scaffold-only sources produce honest limited context; existing sources get a bounded overview. Do not ask users to manually author their initial feature catalog.
- **Application code and project data are separate:** use **one SQLite database for all projects**, at `.local/atlas.sqlite` inside the Atlas repository. Git-ignore the entire `.local/` directory. No per-project source-code changes or authoritative project JSON files.
- **Ordinary local backend:** agents submit changes to Atlas's validated write API; the UI reads the saved data through that same backend. The checks are normal backend functions, not another agent or service.
- **Assets:** project-specific images can live in `.local/assets/`, with database references. Shared reusable art can be tracked with the application. No separate folder per project is required.
- **Creative but constrained rendering:** saved scene settings select supported, reusable compositions, illustrations, cases, and themes. A genuinely new interaction needs a reusable component—not executable code in a database field.
- **Keep it small:** no PostgreSQL/MongoDB, memory/RAG platform, runtime AI, automatic source watcher, full 3D world, or collaboration suite in V1.
- **Mockups are visual references, not feature requirements.** Never fabricate behavior, metrics, or live-sync status to fill them.

### Current workflow

```text
Independent source preparation:
source project / PR → fill-atlas → atlas-context.md → STOP

Separately, under the user's direction:
agent reads context + existing Atlas project data
  → submits a proposed data change to the local backend
  → validation + SQLite transaction
  → refresh/refetch in Atlas → updated visual guide
```

The second step is not embedded in the skill. Sayed chooses his development tools independently. The backend does not interpret Markdown or run a coding agent. JSON may carry API requests/responses; it is not a second saved project store.

**What changed from v0.9:** the handcrafted, frontend-only guide with facts compiled into TypeScript is superseded. Keep the React/art foundation; move each project's meaning, history, and visual configuration into SQLite. Routine data changes need no app rebuild. New reusable renderer code still does.

### First-build default

Preserve the delivered **Reschedule a booking** explanation while migrating its clearly labelled demo content through the validated database path. Then prove that a second project and an updated rule render in the **same unchanged application build**. Keep the familiar Start here / Explore / What changed experience. These are implementation targets, not completed tests.

---

## 2. How to interpret this document

These labels distinguish settled direction from optional suggestions and remaining work:

| Label | Meaning |
|---|---|
| **USER REQUIREMENT** | Explicitly requested or clarified by Sayed. Preserve unless he changes it. |
| **V1 DEFAULT** | Agreed starting decision for the prototype. Implement it first, then revise based on actual use; not a claim of validation. |
| **PROPOSED** | An additional recommendation not included in the settled V1 defaults. Not an implementation commitment. |
| **OPEN / DEFERRED** | Not decided, or deliberately outside the initial effort. |

When sources disagree, use this order:

1. Sayed's latest explicit instruction.
2. Current requirements and V1 defaults recorded here, corrected when needed.
3. Proposals that have not yet been accepted.
4. Mockup details and illustrative examples.

A newer generated image does not overrule an older explicit requirement. A feature that appears in an image is not approved just because Sayed liked the overall design.

This document preserves the relevant context available in the conversation. It does not claim to recover unavailable messages, every historical image version, or independently verified facts about a real repository. No repository has been audited for this project specification.

---

## 3. Why this project exists

### Personal workflow context

Sayed enjoys agentic coding: prompting agents, building product features, and developing workflows around implementation, testing, browser QA, reviews, and merging. His existing Dark Factory work addresses software execution. This project should not become Dark Factory 2, another reviewer, or a new agent-orchestration dashboard.

The gap is the human's product understanding after that fast execution. The key question is not “Which files changed?” but “What can the product do now, and what must I remember about it?”

### Desired experience

Returning to a project should feel like exploring an engaging explanation, not studying a generated wiki. A person should be able to start with the essentials, inspect a particular capability, and understand an important exception without reading pages of prose.

The developer is the primary user. The explanation should also be accessible to someone thinking at a product-manager or nontechnical product level. That does not make this a general PM tool or require targeting nontechnical customers.

### Secondary motivations

The project should be enjoyable to build, demonstrate meaningful engineering, and potentially support a strong CV story. Immediate revenue, enterprise selling, or large adoption are not prerequisites. Do not invent impact metrics or promise a job, revenue, or automatic learning benefit.

### What success is not

More documentation, more extracted records, prettier metadata dashboards, or a larger world are not sufficient. If Sayed stops consuming the output in the same way he stopped reading PR summaries, the central problem remains unsolved.

---

## 4. What the guide explains

**USER REQUIREMENT:** Explain what was built, not primarily how it was implemented.

The useful content includes:

- The product's purpose, where supported by evidence.
- What its users or operators can accomplish.
- Main activities and how they connect into journeys.
- The conditions that allow, block, or change an activity.
- Who is allowed to do what.
- Outcomes and important exceptions.
- Product terms that need explanation.
- What changed recently in that behavior.

Do not lead with frameworks, modules, service boundaries, file trees, infrastructure diagrams, or implementation details. Supporting code/test references may be available on demand without becoming the main explanation.

### Technical concepts can be product concepts

A terminal tool's sessions or a library's state model can be its user-facing domain. This distinction was explicitly recognized. Nevertheless, tools such as Warp, tmux, and React itself are outside the MVP. A web application built with React is in scope.

### Actual behavior versus intent

**V1 DEFAULT:** Distinguish behavior supported by the analyzed product from planned behavior or inferred rationale. Code may reveal a condition without establishing why a business chose it. Do not fabricate the reason, deployment status, or user benefit.

“Implemented in the analyzed repository” does not automatically mean “available in production.” Deployment, configuration, feature flags, and permissions can affect availability. Keep supported, planned, and uncertain behavior explicitly distinguishable; refine their visual treatment in the prototype.

---

## 5. Scope and boundaries

### MVP focus

**USER REQUIREMENT:** Web projects, mostly greenfield and small brownfield codebases.

**First-build default:** one local Atlas application and one SQLite database, able to hold multiple independent web projects for the same user. Begin with the booking demo, then a second small demo to verify separation and reuse. Local project selection is not multi-user tenancy; accounts, real-time collaboration, and public hosted access are not part of this first build.

The MVP should not bake in commerce-specific categories. A booking application, approval tool, or another web product should be explainable through its own vocabulary and activities.

### MVP features

This is the consolidated feature list for Atlas itself, not the features of the source app it explains. It reflects the reusable-platform correction; the learning experience itself is unchanged. **The static booking experience exists; stored projects, validated database writes, and dynamic multi-project behavior are planned, not implemented.** Use Start here / Explore / What changed as the V1 navigation. Refine exact visual treatments during the prototype; these defaults are not test results.

| Feature | What the user gets |
|---|---|
| **Stored projects** | Open a saved project from a small project list or switcher. Each project has its own facts, evidence, history, assets, and scene settings in the shared local database. |
| **Start here** | A small illustrated introduction to the product's main activities and essential concepts, not a literal 20% usage ranking. |
| **Explore a feature** | A visual explanation of who can do what, what happens, and the essential restrictions. Select recorded examples to understand the main case and important exceptions; no real business action is executed. |
| **Find and go deeper** | Search and grouped navigation to incorporated activities, with optional rules, clearly labelled relationships, and source evidence. Everything recorded remains reachable without drawing a giant graph. |
| **What changed** | Visual explanations of added, changed, or removed behavior. Show before/after only when supported. Updates appear after a validated database write and a refresh/refetch, not from a runtime PR feed or raw context-file import. |
| **Honest knowledge states** | An empty guide when no behavior has been incorporated, clear gaps for unknown/partial evidence, and honest no-result or unavailable-feature states. No fictional features or live-analysis indicators. |

**Separate source-preparation deliverable:** `fill-atlas` inspects an authorized source PR/range or small existing project, writes standalone context Markdown, and stops. It can recognize scaffold-only sources and describe existing behavior. It is not a feature of the running Atlas app and has no downstream planning or implementation dependency.

**First build, not the whole MVP at once:** demonstrate one illustrated activity, its saved cases, an important exception, evidence, and one visual change. Use the real validation/database path for the seeded demos; add a second project and change a rule without rebuilding the UI. Only enough project selection, overview, search, and navigation to test this loop is needed. See [DESIGN.md](DESIGN.md#8-next-design-checkpoint).

### Do not automatically add

- Task management, epics, sprints, roadmaps, OKRs, or planning ceremonies.
- Analytics integrations, business-value scores, criticality rankings, or feature-adoption dashboards.
- Comments, collaboration, user administration, enterprise permissions, or monetization.
- Another general chatbot, code reviewer, observability platform, benchmark product, or coding-agent manager.
- A full architecture explorer, universal code-to-business ontology, or enterprise graph database.
- Simulated shoppers, real payment processing, or autonomous production actions.
- A 3D navigation world, economy, XP, leaderboards, daily streaks, or compulsory quizzes.
- Automatic publication of private repository knowledge to public pages.

Some may become justified later. They are not necessary merely because they appeared in a brainstorming response or generated image.

### Large-scale requirement versus first delivery

Sayed wants the idea to remain usable with hundreds or thousands of features and dense relationships. Take that into account in navigation and data identity. Do not turn large-scale reverse engineering into a prerequisite for the first useful version.

---

## 6. Automatic project initialization

**USER REQUIREMENT:** infer new/existing behavior; do not ask Sayed to author initial product knowledge. The source-side skill performs this investigation. A runtime Atlas scanner is not required.

### Fresh source

When the inspected source contains only scaffolding, record that no implemented product capabilities were found in that scope. Do not invent features or demand seed content. Later PRs can supply context about actual capabilities.

### Small existing source

For a requested initial overview, inspect the small web app's available implementation, tests, docs, and relevant product context. Describe discovered activities, supported rules, and gaps. Do not require every integration or the entire historical PR archive. No previous Atlas files are needed.

Infer from source evidence, not repository age or absence of Atlas content. Several routes or PRs may contribute to one user activity; permissions and background behavior may not appear on screens. Large legacy analysis remains deferred.

### Independent output

Both paths end in a standalone Markdown context file. How that file is used afterward belongs outside this skill. Preparing it does not update the Atlas guide, execute an implementation workflow, or prove anything was deployed.

---

## 7. Learning from subsequent work

**USER REQUIREMENT:** the guide evolves with the source product, especially after merged PRs, but source preparation and saving Atlas data remain separate activities.

**The skill:** inspect a source PR/range or initial source, write factual context, stop. No database operations, render schema, downstream tool, or plan belongs in its output.

**Outside the skill:** the user's agent reads that context and the relevant current Atlas project data, then proposes a data update using Atlas's documented API. Ordinary backend code checks its structure, supported scene settings, project-scoped references, and expected current revision. A valid change is saved transactionally; an invalid or conflicting change leaves the existing data intact.

One source feature can span several PRs; one PR can affect several features. Updates can add, modify, retire, or leave behavior unchanged. Do not create a new feature for every PR. Do not erase unrelated facts when applying partial context or silently override a supported correction.

**Routine project updates change database rows, not application source.** The viewer sees committed changes after a refresh/refetch. Preserve the user's selected case until a coherent newer revision is loaded. No WebSocket, continuous polling, or forced animated update is necessary initially.

Keep prepared context, saved Atlas revision, application-code release, and source deployment distinct. An Atlas revision records incorporated knowledge, not proof of production availability. An asset or a rule change using an existing renderer needs no rebuild; a new reusable interaction component requires a normal application-code change.

---

## 8. Information design at small and large scales

### Simple mode

**USER REQUIREMENT:** Provide the smallest useful explanation of the product, with very little text and meaningful visuals.

The user called this the “20/80” mode: the important concepts that help explain most of the product. This is a learning goal, not a measured ratio or a requirement to display exactly 20% of features.

**V1 DEFAULT:** “Start here.” A short guided introduction based on primary activities, essential concepts, and important restrictions.

### Deeper exploration

**USER REQUIREMENT:** More complete knowledge should remain accessible when desired.

“Everything accessible” does not mean “everything drawn simultaneously.” A complete feature collection can be searchable and grouped, with scoped relationships and more detail on request. Completeness of the collection remains limited by what the system has actually discovered.

**V1 DEFAULT:** Start here / Explore / What changed, with feature cases and optional evidence inside the selected experience. Search provides direct access. Detailed category names and layout dimensions can follow the actual prototype content; no additional top-level modules are needed.

### Relationships

**V1 DEFAULT:** Preserve the meaning of a relationship: requires, triggers, blocks, used by, part of a journey, or another domain-appropriate connection. Do not reduce every relationship to an unlabeled bridge.

A feature may belong to more than one journey. Use one underlying record rather than duplicate its meaning. When exploring a feature, show its relevant neighborhood and offer expansion; do not generate an ever-growing global graph. An indirect path is not automatically a proven dependency.

No graph database is implied. SQLite records and project-scoped relationships are sufficient for V1; query the selected neighborhood rather than drawing the entire graph.

### Choosing essentials

**V1 DEFAULT:** Author the starting path from supported product purpose, main actors and journeys, prerequisites, and behavior-changing restrictions. Save that selection in the project database; no numerical 20% ranking or runtime ranking service. Correct it through the same validated data-update path. In-app pinning remains optional, not a V1 requirement. Do not use code size, PR count, or graph degree as a substitute for business importance.

Usage analytics could answer a different question later, but are not needed to start explaining the product.

### Text limits

Earlier suggestions included 5–7 overview items, one-sentence purposes, and about three visible rules before expansion. These are **PROPOSED design heuristics**, not accepted universal limits. Never hide a condition that makes the headline false simply to satisfy a numeric cap.

---

## 9. Visual and interaction direction

### What Sayed liked

**USER REQUIREMENT / PREFERENCE:** Colorful, creative, alive, playful, and enjoyable to explore. Avoid an engineering blueprint made of sharp boxes, lines, and dense text. He liked the illustrated restaurant-menu reference and several Atlas mockups with soft colors, hand-drawn-style accents, approachable icons, landscapes, and gentle visual hierarchy.

### What the visuals must accomplish

The math-book analogy matters: an inviting book must still preserve the actual equations. Similarly, the product can be artistic without losing precise behavior. A clear permissions table is better than a metaphor that hides permission differences.

The application must not become a cartoon picture book with little explanatory value, or a standard enterprise dashboard with decorative plants. The user has repeatedly raised both risks.

### Metaphors are optional

Islands were liked as art direction, but an island per feature does not scale and does not explain behavior. Keep the ability to use illustrations; do not impose one geography on every product or activity.

**V1 DEFAULT — choose the visual that explains the behavior:**

| Meaning to explain | Possible visual |
|---|---|
| Main activity | Short illustrated walkthrough/storyboard |
| State changes | Timeline or compact state illustration |
| Permissions | Small, readable matrix or role comparison |
| A rule or exception | Side-by-side documented cases |
| Product concept | Annotated illustration or screenshot |
| Recent change | Before/after or a short visual explanation |
| Relevant connections | Small, labeled local relationship view |

These are options for explaining content, not seven required separate modules.

### Gamification

**USER REQUIREMENT:** Make understanding fun.

**V1 DEFAULT:** Make discovery playful through selectable recorded cases and meaningful visual state changes. Favor curiosity and self-directed exploration. Do not assume it requires points, rewards, tests, avatars, or a game economy. A scenario viewer should not silently become a separate simulation engine that reimplements the product.

### Density and motion

**V1 DEFAULT:** Let the most important scene or question dominate a screen. Reveal more on interaction rather than surrounding it with many panels. Use brief, meaningful motion with a reduced-motion alternative. Use 2D or restrained 2.5D illustration; no full 3D engine in V1.

Start with the light, warm illustrated style in DESIGN.md. Tune the palette and actual assets in the first scene; alternate themes are not needed to begin.

---

## 10. V1 navigation and experience

The [MVP feature list](#mvp-features) owns scope. [DESIGN.md](DESIGN.md#2-v1-screens-and-interactions) owns the Start here / Explore / What changed navigation, shared layout, and interactions. Its section 8 supplies the first prototype brief.

A small project list/switcher selects the project; the three-place navigation stays inside it. Feature explanations and their scenarios stay within Explore; rules and evidence open as optional details, not new top-level pages. Source preparation happens outside Atlas; an empty or partial guide is a content state, not a new setup workflow. The references illustrate useful visual treatments, not an obligation to build their sidebar entries or metadata panels. Use the three-place navigation for V1 and refine only its responsive layout during implementation. No separate layout document is required.

---

## 11. Art production and implementation options

**USER REQUIREMENT:** Understand how the final visuals will actually be produced, especially when Codex implements the application.

### V1 art-production default

Separate structured product meaning from reusable presentation:

`Source evidence → standalone product context`

Separately: `context + existing project data → validated data update → SQLite → reusable renderer + project assets → visual explanation`

The separation is intentional: the context-producing skill does not prescribe the second stage. The running app need not import the file or invoke an agent. Reuse visual components and artwork rather than author a new mini-application per feature.

### Candidate art workflow

Use image generation to explore the house style and create references. Create or obtain a small, consistent collection of icons/illustrations, then assemble reusable components around them. SVG is a promising format for many interactive elements; complex texture or illustration does not necessarily need to be SVG.

**Important limitation:** A generated raster mockup is not automatically an editable, high-quality SVG component library. Rebuilding its appearance requires asset design, implementation, and visual review. Codex can assist; pixel-perfect conversion has not been demonstrated.

### Select during the first build

Use reusable React/SVG elements for changing states and a small reviewed illustration set for richer subjects or texture. Choose the actual assets and verify their licenses while implementing the first scene, not in another planning document. Refine component types, spacing, and animation against the running result. TECHNICAL.md supplies the client/backend/storage defaults; dependency versions still need an actual compatibility check. No full asset library or additional design tool is a prerequisite.

The visual baseline is React with SVG/normal UI components, a small stable illustration set, and Motion when it explains a change. Scene definitions live in application code; each project stores references, facts, and supported visual settings in SQLite. Mermaid, React Flow, full 3D, and layout engines were earlier candidates; none is required for V1. The reusable foundation must allow feature-specific compositions rather than force every feature into the same diagram.

Any external art/icon assets will need a checked license before use or redistribution. No external art package has been selected or licensed as part of this document.

---

## 12. Context artifacts, knowledge, and technical boundaries

**USER REQUIREMENT:** `fill-atlas` creates standalone context Markdown and stops. Its instructions and template stay independent of the consumer and storage format. `atlas-context.md` or a user-selected filename does not trigger anything automatically.

### One project knowledge store

| Item | Responsibility |
|---|---|
| Source-context Markdown | Bounded source facts and evidence. Preparation input, not the accumulated project database. |
| `.local/atlas.sqlite` | One SQLite database for all projects: features, rules, cases, relationships, evidence, incorporated revisions, history, and visual configuration. |
| `.local/assets/` | Project-specific image files, referenced by database records. These are binary assets, not a competing knowledge store. |
| Tracked Atlas source | UI, renderer patterns, strict request schemas, backend code, SQL migrations, and harmless demo seeds. No private project facts. |

The whole `.local/` directory is Git-ignored, including any database journal/sidecar files and local backups. It is not served as a static directory. No per-project `projects/` folder, saved project JSON document, TypeScript project-content module, or browser local-storage database is authoritative in V1. JSON may represent requests and validated visual configuration inside a database column; that does not create another database.

### What the backend does

The small local backend receives proposed updates, checks them, and saves them to SQLite. It also reads the selected project's data and serves approved assets to the UI. It is not an LLM, a planner, or a separate “writer” product. Direct model-authored SQL is not the normal update interface.

Validation covers types, required fields, supported scene kinds/settings, stable IDs, same-project references, and update revisions. SQLite constraints and transactions enforce persistence consistency. Neither layer can prove a business claim true; retain source evidence and uncertainty. Schemas, migrations, and validation tests are tracked application code, not something regenerated to accept every agent output.

### Dynamic rendering and customization

The frontend renders saved facts using a small registry of reviewed illustration/storyboard, comparison, and related patterns. Names, actors, cases, order, assets, and supported colors/layout settings are data. Refer to shared rule IDs instead of duplicating a threshold in visual prose.

Different projects can use different combinations and assets. A genuinely new interaction requires adding a reusable renderer component. Do not store or execute project-supplied React, JavaScript, arbitrary HTML/SVG markup, or generated expressions to fake unlimited customization. Recorded cases explain behavior; Atlas is not a copy of the source business engine.

### Scope, sharing, and privacy

One local user can keep several projects in the database. The public application repository can remain separate from the private database and assets. Choose the code license before public release; this pack does not grant or select one. Open-sourcing the code is not the same as publishing project data.

No cloud accounts, collaboration, public-link service, or automatic export is implied. A local route is not a portable share link. Sharing a particular project's data will need an explicit, reviewed mechanism later; do not distribute the whole database to share one project. Git-ignore is not encryption, access control, or backup. Safeguard private data and test a consistent database-plus-assets backup/restore before relying on it.

### Superseded directions

The earlier frontend-only, code-bundled project knowledge and rebuild-per-content-change plan is superseded. The short-lived per-project JSON-folder proposal and larger PostgreSQL platform proposal are also superseded by **one local SQLite database plus ordinary validated backend access**. Keep this history to prevent reintroducing contradictory instructions, not as parallel alternatives to implement.

Runtime model analysis, automatic Markdown ingestion, source watchers, memory services, arbitrary data-to-code execution, and coupling the context skill to a downstream workflow remain outside V1. [TECHNICAL.md](../technical/TECHNICAL.md) supplies implementation defaults and test gates.

### Cost, corrections, and freshness

Source preparation and agent-authored data updates use the user's separately chosen coding workflow. Browsing and switching saved cases require no model calls. The local backend reads saved data; it does not request a new analysis.

Fix facts through a validated database update with source evidence and a correction reason. A user-facing feedback editor is not required. Preserve old values only in labelled history, and preserve corrections when later evidence conflicts. Store coverage/revision at the affected-feature level; one recent PR cannot establish whole-project freshness.

---

## 13. Trust, completeness, and honest simplification

The product aims for simple explanations, not unsupported confidence.

**V1 quality checks — required behavior to verify, not completed test results:**

- Support important behavioral claims with identifiable project evidence.
- Distinguish inferred rationale from documented intent and observed behavior.
- Mark gaps or stale understanding instead of filling them with plausible text.
- Preserve essential conditions in the simplest view.
- Keep removed, planned, branch-only, and current implemented behavior distinguishable where relevant.
- Do not declare business completeness from a single scan.
- Keep confidential repository content private by default.

Illustrative e-commerce rules in the mockups are not universal facts. Cancellation timing, refunds, digital goods, permissions, email delivery, and partial fulfillment vary by product. Some generated screens contain oversimplifications or mutually inconsistent examples; they must not become the extracted knowledge model.

Benefits such as “reduces support tickets” should not be displayed as measured outcomes without evidence. Likewise, mockup statistics and success badges are not real measurements.

---

## 14. Decision history and superseded directions

| Conversation development | Current interpretation |
|---|---|
| Initial search for a project after Dark Factory | Background motivation only; do not reopen generic project ideation unless asked. |
| Sayed identified forgetting business/features after fast agentic development | This became the central problem. |
| Initial “Product Brain” proposal with extensive knowledge entities | Useful context, but must not grow into a generic memory/knowledge platform. |
| Restaurant-menu reference and request for colorful, low-text visuals | Strong visual direction and preference to preserve. |
| Early islands for every feature | Art was liked; literal one-island-per-feature and huge maps were challenged. |
| Discussion of 1,000+ features and dense relations | Preserve navigability and deeper access; do not require global graph rendering. |
| User emphasized the math-book balance | Preserve exact behavior and useful meaning, not decorative simplification. |
| Existing short PR-summary skill was abandoned by the user | Another textual summary stream is not an adequate answer. |
| Tools/frameworks such as Warp, tmux, React discussed | Technical concepts can be product concepts, but web apps remain MVP scope. |
| Early greenfield setup wizard | Superseded: do not ask the user to author initial product knowledge. |
| Latest greenfield/brownfield clarification | Infer strategy; initialize existing products, grow fresh ones from merged PRs. |
| Generated screenshots show manual setup choices or optional seed forms | Those image details do not override the clarification. |
| Art production discussion suggested reusable SVG/UI with AI meaning extraction | Working technical proposal, not a locked production pipeline. |
| User asks whether to keep a living document now | Maintain current decisions plus relevant background; avoid relying on a final conversation dump. |
| User asks what is missing and whether to add a layout document | Refine layout and interactions inside DESIGN.md; test one learning loop rather than add documents. |
| Skill clarification | Source investigation ends in standalone Markdown; implementation is a separate activity chosen by the user. |
| User rejects downstream-tool coupling in the skill | No Superpowers references, downstream instructions, or consumer dependency in the skill, template, or generated context. |
| Earlier frontend-only phase | Superseded: it produced a handcrafted guide rather than the reusable platform. Keep the visual direction, not project facts compiled into app source. |
| User requests a reviewed downloadable handoff | Add the technical baseline, reconcile existing documents, and verify package integrity; do not claim the application or skill has been field-tested. |
| User asks for only useful build material and a clear feature list | Remove superseded image experiments and the optional checksum file from the pack; consolidate MVP features in section 5 rather than create FEATURES.md. |
| User finalizes the project name | Atlas is the official name. Feature Atlas and Visual Product Memory were earlier working names, retained only as historical context. The independent skill remains `fill-atlas`. |
| Open-question cleanup | Sayed approved replacing already-answered questions with V1 defaults; practical tests remain necessary. |
| Reusable platform and data separation | Store independent projects separately from public application code and dynamically render them with the same application build. |
| Storage clarification | One SQLite database at `.local/atlas.sqlite`, inside the repo but Git-ignored. Optional project assets sit alongside it; no authoritative JSON project files or per-project folders. |
| Strict input clarification | Ordinary backend validation and transactions gate agent-proposed data changes. No extra agent, arbitrary SQL, or coupling of fill-atlas to storage. |

Earlier rejected projects—benchmarks, patch optimizers, synthetic customers, autonomous product experimentation, and additional review layers—are not pending features of Atlas.

---

## 15. Visual-reference guide

This planning context retains **13 visual references** in `business/references/inspiration/` and `business/references/concepts/`. The links below resolve in this repository. Superseded onboarding, scanner, dark-UI, and visual-engine experiments are not included in this build pack.

**These are style and explanation references, not a production asset library or an approved page inventory.** Their example business rules, statistics, extra controls, and older branding are not requirements. Use **Atlas** in implemented UI copy. Pick one main visual reference for a scene instead of combining every pictured style or widget.

### Overview and visual tone

- [Annotated menu](references/inspiration/annotated-menu.png): recognizable subjects, brief annotations, and whitespace; inspiration only.
- [Original product map](references/concepts/original-overview.png): the inviting art direction, not one island per feature.
- [Illustrated overview](references/concepts/illustrated-overview.png): soft colors and useful grouping, without hard-coded commerce categories.
- [Core overview](references/concepts/core-overview.png): a small introduction; its 20% label is not a measured statistic.

### Feature explanations and journeys

- [Orders detail](references/concepts/orders-detail.png): a selected-feature treatment, not a required separate dashboard.
- [Account detail](references/concepts/account-detail.png): another subject treatment within the same style.
- [Cancel-order explanation](references/concepts/cancel-order.png): illustrated behavior and conditions; its fictional rules and panel density still need review.
- [Journey map](references/concepts/journey-map.png): a possible sequence treatment, not a universal product flow.
- [Customer journey](references/concepts/customer-journey.png): subject-to-subject storytelling with domain-specific vocabulary.

### Discovery, deeper access, and change

- [Feature catalog](references/concepts/feature-catalog.png): a grouped-navigation sketch; ranks, statistics, and every filter are not required.
- [Checkout relationships](references/concepts/checkout-relationships.png): local connections; do not inherit dense metadata or analytics panels.
- [Deeper exploration](references/concepts/deeper-exploration.png): optional detail, without adding API/Tech tabs, comments, or analytics.
- [Changes](references/concepts/changes.png): explain a change in behavior, not an unread PR-summary feed or live analysis dashboard.

---

## 16. V1 defaults and prototype checks

The previously open design questions now have starting decisions. Build these defaults; do not restart discovery or add features to resolve them. They establish a first version, not proven usability or source accuracy.

### Settled for the first build

| Area | V1 default |
|---|---|
| First interaction | Open a visual feature explanation, select an important alternate case, and see why its outcome changes. A before/after example explains one change. No mandatory quiz or slideshow. |
| Navigation | Choose a saved project, then **Start here / Explore / What changed.** Cases and evidence stay within the selected experience. Search, cache keys, and return paths retain project identity. |
| Visual grammar | Illustrated actions and walkthroughs for behavior; timelines for sequences; comparisons for conditions; compact tables for permissions. Only show scoped relationships that help the selected question. |
| Test content | Use the clearly labelled **Reschedule a booking** fixture in DESIGN.md, including its saved cases and 48-to-24-hour change. This is demo content, not a real product claim or a booking-only scope. |
| Knowledge and evidence | One SQLite database, separate from app source. Strict backend writes preserve shared facts, project-scoped relationships, source/revision references, and labelled history. Unknown remains unknown. |
| Platform/storage | React UI + a small local backend. All projects in `.local/atlas.sqlite`; assets in `.local/assets/`; `.local/` is ignored and not statically served. No project JSON files or app rebuild for ordinary data updates. |
| Essentials | Introduce supported product purpose, main user journeys, prerequisites, and essential restrictions. Save the selection with its project; no literal top-20% ranking or usage analytics. |
| Artwork and renderer | Reuse a small art kit with React/SVG and meaningful Motion transitions. Rich illustration may be raster. Choose and license-check actual assets while building the first scene; no full 3D or per-feature painting service. |
| Evaluation | Check understanding, voluntary return, visual usability, and a correct before/after. Test source-context accuracy separately against real evidence and observe actual development cost; do not add a benchmark platform. |

### Still to select or test—not missing product features

**Select later:** one small authorized source repository and PR for the independent skill test. None has been selected. This does not block the database-seeded visual prototype, but real source evidence is required before claiming source accuracy.

**Resolve during implementation:** exact assets and their rights, compatible dependency versions, and the initial database/request schema. Implement the agreed local backend and SQLite boundary; do not add a memory service, raw-context interpreter, enterprise platform, or another specification document.

**Validate in use:** whether Sayed understands the behavior and wants to return, whether the reusable artwork works in a browser, and whether the skill produces accurate standalone context. None is established by the documents or mockups. Detailed checks remain in [section 17](#17-how-we-should-evaluate-the-first-version) and [DESIGN.md](DESIGN.md#what-to-check-before-building-more).

A large brownfield engine, full 3D, cross-project enterprise search, multi-user governance, and analytics-driven ranking remain deferred. These deferred items do not block the first local prototype. The project picker and database path implement the explicitly requested reusable-platform correction.

---

## 17. How we should evaluate the first version

**Prototype checks, not completed results or fixed numeric promises:**

- Can Sayed explain what a selected feature does, who uses it, and its most important limitation without opening the code?
- Does he willingly revisit the visual explanation after building something?
- Can a new user distinguish the main path from an important exception?
- Does a separately submitted data update change the correct explanation without rebuilding the application, contradicting current rules, or duplicating features?
- Can the same unchanged build display two projects without leaking one project's features, relationships, assets, or navigation state into the other?
- Do invalid/stale writes roll back cleanly, and can database data plus assets be restored after a backup?
- Does fill-atlas stop at factual context without downstream instructions or application changes?
- Does a non-commerce web example still make sense without a new custom interface?
- Can a crowded dataset be navigated without drawing everything at once?
- Are the extraction and update costs acceptable in practice?

Synthetic feature records can test navigation and rendering. A real small codebase is needed to test whether the system understands actual behavior. Neither test alone proves the other.

---

## 18. Instructions for continuing the project

### For future conversations and coding agents

Start with this context README.md, this section 1, the [V1 defaults](#16-v1-defaults-and-prototype-checks), DESIGN.md section 8, and TECHNICAL.md for a build. Read deeper context only for the question at hand. A source-side fill-atlas invocation needs only its standalone skill and source evidence, not this entire application handoff.

Preserve the user's constraints. Do not silently promote a proposal, mockup widget, or plausible product convention into a requirement. Ask about consequential unresolved choices when necessary rather than filling them with enterprise defaults.

Do not start by building all the screens in the reference pack. The priority is an experience that makes product understanding enjoyable, then the smallest reliable mechanism to keep it current.

### Updating this document

After an agreed change:

1. Update the current section in place so it remains readable and accurate.
2. Keep a short explanation of significant superseded decisions where future agents could otherwise repeat them.
3. Label any new suggestion as proposed until accepted.
4. Update the version/date and add a compact change-log entry. Keep PROJECT.md responsible for scope, DESIGN.md for experience, and TECHNICAL.md for implementation; do not duplicate whole sections.
5. Keep this repository planning context current. Regenerate a downloadable context pack only when a separate distribution is requested.

Do not append every message or keep conflicting versions of the current requirements. Use normal repository history/versioned copies later rather than growing an endless transcript inside this file.

### Portability

This file is the portable project record, not a promise that a chat session will retain all project state. Keep the latest downloaded version. A downloaded Markdown file or ZIP is a snapshot; editing a working copy here does not automatically modify a previously downloaded copy or a user's repository.

For another conversation or a coding session, supply the latest document and the relevant visual references. Confirm any missing files or conflicting decisions instead of claiming to remember unavailable context.

### Change log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-24 | Initial consolidated context from the project discussion; separated user requirements, proposals, open questions, and superseded mockup behavior; packaged the available visual references. |
| 0.2 | 2026-09-24 | Added DESIGN.md v0.1 as a proposed experience/visual-design companion and linked its candidate navigation. Existing product requirements are unchanged; the new design is not yet approved. |
| 0.3 | 2026-09-24 | Linked DESIGN.md v0.2 review: layout/navigation, concrete prototype behavior, art feasibility, and future evidence/update checks. Preserved requirements and reference status; all new design choices remain proposals. |
| 0.4 | 2026-09-24 | Recorded the independent context-only fill-atlas boundary and the user's rejection of downstream coupling. Reframed initialization and visual updates as separate concerns; added draft skill/template. No runtime importer, backend, named planner dependency, or completed skill test is claimed. |
| 0.5 | 2026-09-24 | Consolidated frontend-only Atlas and repository-backed knowledge; added TECHNICAL.md v0.1, clarified briefs versus accumulated knowledge and explicit development updates, retained all 20 references, and recorded handoff review limits. |
| 0.6 | 2026-09-24 | Finalized Atlas as the official project name; aligned document titles and current naming, updated companion versions, and preserved earlier names only as history. No product, stack, skill, or reference-image behavior changed. |
| 0.7 | 2026-09-24 | Packaging-only cleanup: one atlas/ root, documents in docs/, grouped and renamed visual references, updated links, and regenerated checksums. All project requirements, reference-image bytes, and the independent skill/template are preserved. |
| 0.8 | 2026-09-24 | Removed superseded mockup files and the optional package checksum file; consolidated existing MVP features in section 5; linked design details instead of repeating a second feature inventory; retained the independent skill unchanged. |
| 0.9 | 2026-09-24 | Replaced the open-question list with agreed V1 defaults and prototype checks; historical frontend-only baseline. |
| 0.10 | 2026-09-24 | Replaced code-bundled project knowledge with one Git-ignored SQLite database, validated local backend writes, and data-driven rendering across projects. Preserved the visual experience, context-only skill, and 13 references. No application implementation or tests claimed. |

---

**Final guardrail:** Build something that makes Sayed want to understand his product. Do not let the documentation, data model, or artwork become a substitute for that outcome.
