# Atlas — Living Project Context

**Version:** 0.9  
**Last updated:** 2026-09-24  
**Owner:** Sayed  
**Stage:** V1 defaults settled for the first build. The application, artwork, learning experience, and source-context skill still need implementation or real-use testing.  
**Project name:** Atlas — confirmed by Sayed on 2026-09-24. Use Atlas in product titles, documentation, and future UI copy.

> **North star:** Make it enjoyable to understand and remember what I built, without making me read documentation.

This is a working record of the decisions, constraints, reasoning, V1 defaults, and prototype checks from the project conversation. It is not a transcript, a frozen specification, or an instruction to implement every idea below. The complete document is for preserving context; its length is not a template for the application's UI.

**Design companion:** [DESIGN.md](DESIGN.md) v0.8 records the V1 navigation, interactions, reading budget, and art-production defaults. Exact compositions and usability still need prototype review. This document continues to own product requirements and scope; a build default is not evidence of a validated experience.

**Technical companion:** [TECHNICAL.md](../technical/TECHNICAL.md) v0.5 records the frontend-only build baseline, repository-backed knowledge, component boundaries, and implementation checks. [README.md](../README.md) provides the shortest entry into this pack and states what has actually been reviewed.

---

## 1. Read this first

### The problem

Sayed can build software quickly with coding agents and his Dark Factory workflow, but struggles to retain the product knowledge: what features exist, what they do, how they behave, and which rules matter. He already tried a skill that produced a few lines per PR and stopped reading those summaries. More generated text does not solve the problem.

### The product

A visual, playful guide to a software product's capabilities and behavior, maintained through explicit Atlas development updates as the source product evolves. It should help someone explore what users can do, what happens, and the important conditions—without first understanding the code or architecture.

**Feature list:** [MVP features](#mvp-features) is the single place to see what Atlas will include. It consolidates the existing direction; no separate FEATURES.md is needed.

### Requirements to preserve

- **Human understanding comes first.** Helping coding agents retrieve context is not the central product goal.
- **Visual-first and enjoyable, with minimal text.** Art must explain meaning, not just decorate a conventional documentation dashboard.
- **Web applications first.** No terminal tools, frameworks, or libraries in the MVP; no e-commerce-only assumptions either.
- **No manual product-definition onboarding.** Point the source-side agent at the repository; it infers the appropriate preparation scope. No mandatory runtime connection/scanner UI is implied.
- **Greenfield:** start with actual known behavior and prepare context from subsequent merged work. The guide changes when that context is separately implemented in Atlas; no purpose, actor, feature, or glossary forms are required.
- **Brownfield:** the planned source-side skill will prepare context from the existing product; that context can inform the initial guide. Small codebases are sufficient initially; large legacy discovery is deferred.
- **Two depths:** a simple introduction to the essentials and optional access to more complete discovered knowledge. Never draw the entire product graph by default.
- **Frontend-only first.** Atlas is an interactive product guide. Its maintained knowledge lives in the Atlas repository; there is no application backend, runtime AI, or automatic context importer in V1.
- **Avoid overengineering.** No mandatory knowledge-graph platform, memory service, vector database, PM suite, or full 3D world.
- **Generated mockups are references, not requirements.** Their example rules, statistics, buttons, and extra screens are not automatically approved.

### Current implementation direction

**USER CLARIFICATION:** the planned `fill-atlas` skill must examine source product evidence, create a standalone Markdown context file, and stop. It must not reference or require a downstream planner, framework, or agent workflow.

`Source project / PR → fill-atlas → product context Markdown → stop`

Separately, Sayed can use that context to plan and implement a visual explanation inside Atlas with his chosen development tools. He has mentioned Superpowers for that separate work, but it is **not part of the skill, its template, its output, or a required dependency of Atlas**.

The context file is development input, not automatically imported by the running application. **The current direction is frontend-only Atlas.** Keep the maintained product facts in small repository-backed content modules and their presentation in visual components. This is not a generic content engine or a required output format for the skill.

[TECHNICAL.md](../technical/TECHNICAL.md) recommends React + TypeScript + Vite, Tailwind, SVG/illustration assets, Motion, and appropriate controls/tests. Exact dependency versions must be selected and verified during scaffolding; no install or build has been performed for this pack. No internal analysis service, database, live source synchronization, or backend belongs in V1.

The `fill-atlas` skill is planned, not included in this repository. It will be created and tested against real source evidence separately from the frontend prototype.

### Immediate design priority

Build the small visual experience defined in [V1 defaults and prototype checks](#16-v1-defaults-and-prototype-checks). Do not replace it with a large schema or integration platform.

**First-build default:** use the labelled **Reschedule a booking** fixture in DESIGN.md with the frontend-only baseline in TECHNICAL.md. Open the activity, switch a saved case, inspect its reason, and compare the before/after change. Test whether this is enjoyable and understandable; do not claim that it already works.

---

## 2. How to interpret this document

These labels distinguish settled direction from optional suggestions and remaining work:

| Label                | Meaning                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **USER REQUIREMENT** | Explicitly requested or clarified by Sayed. Preserve unless he changes it.                                                  |
| **V1 DEFAULT**       | Agreed starting decision for the prototype. Implement it first, then revise based on actual use; not a claim of validation. |
| **PROPOSED**         | An additional recommendation not included in the settled V1 defaults. Not an implementation commitment.                     |
| **OPEN / DEFERRED**  | Not decided, or deliberately outside the initial effort.                                                                    |

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

**First-build default:** one Atlas frontend guide explaining one source web application. Context preparation happens in the source-side workflow; Atlas is a separate development artifact. Use fixture data for the first visual test, then a small authorized real source project. Do not add multi-project tenancy, accounts, or integrations to begin.

The MVP should not bake in commerce-specific categories. A booking application, approval tool, or another web product should be explainable through its own vocabulary and activities.

### MVP features

This is the consolidated feature list for Atlas itself, not the features of the source app it explains. It summarizes the existing scope rather than adding new capabilities. **These are planned capabilities, not implemented features.** Use Start here / Explore / What changed as the V1 navigation. Refine exact visual treatments during the prototype; these defaults are not test results.

| Feature                     | What the user gets                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start here**              | A small illustrated introduction to the product's main activities and essential concepts, not a literal 20% usage ranking.                                                                                 |
| **Explore a feature**       | A visual explanation of who can do what, what happens, and the essential restrictions. Select recorded examples to understand the main case and important exceptions; no real business action is executed. |
| **Find and go deeper**      | Search and grouped navigation to incorporated activities, with optional rules, clearly labelled relationships, and source evidence. Everything recorded remains reachable without drawing a giant graph.   |
| **What changed**            | Visual explanations of added, changed, or removed behavior. Show before/after only when supported. Updates arrive through an explicit Atlas development change, not a runtime PR feed or importer.         |
| **Honest knowledge states** | An empty guide when no behavior has been incorporated, clear gaps for unknown/partial evidence, and honest no-result or unavailable-feature states. No fictional features or live-analysis indicators.     |

**Separate source-preparation deliverable:** the planned `fill-atlas` skill will inspect an authorized source PR/range or small existing project, write standalone context Markdown, and stop. It should recognize scaffold-only sources and describe existing behavior. It is not a feature of the running Atlas app and has no downstream planning or implementation dependency.

**First build, not the whole MVP at once:** demonstrate one illustrated activity, its saved cases, an important exception, a source/reason detail, and one visual change. Add only enough overview, search, and navigation to exercise that loop. The booking fixture and checks are in [DESIGN.md](DESIGN.md#8-next-design-checkpoint); wider coverage follows the first working scene.

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

**USER REQUIREMENT:** infer new/existing behavior; do not ask Sayed to author initial product knowledge. The planned source-side skill will perform this investigation. A runtime Atlas scanner is not required.

### Fresh source

When the inspected source contains only scaffolding, record that no implemented product capabilities were found in that scope. Do not invent features or demand seed content. Later PRs can supply context about actual capabilities.

### Small existing source

For a requested initial overview, inspect the small web app's available implementation, tests, docs, and relevant product context. Describe discovered activities, supported rules, and gaps. Do not require every integration or the entire historical PR archive. No previous Atlas files are needed.

Infer from source evidence, not repository age or absence of Atlas content. Several routes or PRs may contribute to one user activity; permissions and background behavior may not appear on screens. Large legacy analysis remains deferred.

### Independent output

Both paths end in a standalone Markdown context file. How that file is used afterward belongs outside this skill. Preparing it does not update the Atlas guide, execute an implementation workflow, or prove anything was deployed.

---

## 7. Learning from subsequent work

**USER REQUIREMENT:** the visual guide evolves with the source product, especially after merged PRs. The latest clarification separates context creation from implementation.

**The skill:** inspect a source PR/range and relevant surrounding behavior, write the context file, stop. The file records facts, conditions, sources, differences, and unknowns—not implementation tasks, visual build instructions, or a named downstream workflow.

**Outside the skill:** Sayed may give that context to his coding tools to plan and implement an Atlas change. That separate development cycle updates the guide. Manual handoff is sufficient initially; no automatic chaining or instant runtime import is approved.

One source feature can span several PRs; a PR can affect several features. The context may describe added, changed, removed, unchanged, or inconclusive behavior. A refactor does not automatically justify a new explanation.

For Atlas implementation, reuse existing explanations and visual patterns rather than create a new page for each PR. Replace obsolete current rules; preserve important unchanged conditions and meaningful history. These are project design principles, not instructions to embed in each context file.

Keep source identity and analyzed revision available. A prepared file, an implemented Atlas change, a published Atlas build, and a deployed source feature are distinct. Before applying context, the development workflow should check existing and newer knowledge for duplication or conflicts. The V1 mechanism is an ordinary reviewed Atlas code/content change followed by a build when publishing. Updating a source PR or writing a context file alone never changes the running guide.

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

No graph database is implied. Small repository-backed records with stable references are the V1 direction; relationship names describe product meaning, not a storage technology.

### Choosing essentials

**V1 DEFAULT:** Author the starting path from supported product purpose, main actors and journeys, prerequisites, and behavior-changing restrictions. Maintain that selection in Atlas content; no numerical 20% ranking or runtime ranking service. Correct the selection through normal content updates. In-app pinning remains optional, not a V1 requirement. Do not use code size, PR count, or graph degree as a substitute for business importance.

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

| Meaning to explain   | Possible visual                            |
| -------------------- | ------------------------------------------ |
| Main activity        | Short illustrated walkthrough/storyboard   |
| State changes        | Timeline or compact state illustration     |
| Permissions          | Small, readable matrix or role comparison  |
| A rule or exception  | Side-by-side documented cases              |
| Product concept      | Annotated illustration or screenshot       |
| Recent change        | Before/after or a short visual explanation |
| Relevant connections | Small, labeled local relationship view     |

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

Feature explanations and their scenarios stay within Explore; rules and evidence open as optional details, not new top-level pages. Source preparation happens outside Atlas; an empty or partial guide is a content state, not a new setup workflow. The references illustrate useful visual treatments, not an obligation to build their sidebar entries or metadata panels. Use the three-place navigation for V1 and refine only its responsive layout during implementation. No separate layout document is required.

---

## 11. Art production and implementation options

**USER REQUIREMENT:** Understand how the final visuals will actually be produced, especially when Codex implements the application.

### V1 art-production default

Separate structured product meaning from reusable presentation:

`Source evidence → standalone product context`

Separately: `context + Atlas design → development work → reusable UI/art and feature-specific content → visual explanation`

The separation is intentional: the context-producing skill does not prescribe the second stage. The running app need not import the file or invoke an agent. Reuse visual components and artwork rather than author a new mini-application per feature.

### Candidate art workflow

Use image generation to explore the house style and create references. Create or obtain a small, consistent collection of icons/illustrations, then assemble reusable components around them. SVG is a promising format for many interactive elements; complex texture or illustration does not necessarily need to be SVG.

**Important limitation:** A generated raster mockup is not automatically an editable, high-quality SVG component library. Rebuilding its appearance requires asset design, implementation, and visual review. Codex can assist; pixel-perfect conversion has not been demonstrated.

### Select during the first build

Use reusable React/SVG elements for changing states and a small reviewed illustration set for richer subjects or texture. Choose the actual assets and verify their licenses while implementing the first scene, not in another planning document. Refine component types, spacing, and animation against the running result. TECHNICAL.md supplies the frontend defaults; dependency versions still need an actual compatibility check. No full asset library or additional design tool is a prerequisite.

The current build baseline is React with SVG/normal UI components, a small stable illustration set, and Motion when it explains a change. Mermaid, React Flow, full 3D, and layout engines were earlier candidates; none is required for V1. The reusable foundation must allow feature-specific compositions rather than force every feature into the same diagram.

Any external art/icon assets will need a checked license before use or redistribution. No external art package has been selected or licensed as part of this document.

---

## 12. Context artifacts, knowledge, and technical boundaries

**USER REQUIREMENT:** `fill-atlas` produces standalone Markdown context only. It is not coupled to a consumer, planner, implementation workflow, output schema for the UI, or runtime importer.

The planned skill should capture source scope, behavior, changes, exact conditions, examples, evidence, and uncertainty. No target Atlas paths or instructions for another agent belong in the generated context. The default filename is `atlas-context.md`; a user-specified `context.md` is also valid. The filename does not trigger anything.

### Three different artifacts

| Artifact                 | Responsibility                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Source-context Markdown  | A bounded statement of source behavior or a change. It is development input, not the entire accumulated product memory. |
| Maintained Atlas content | The guide's current facts, conditions, cases, relationships, and supporting references, versioned in its repository.    |
| Atlas visual components  | The artistic, interactive explanation of those facts. Reusable controls and art can support different compositions.     |

For example, `reschedule.content.ts` can supply facts to `RescheduleScene.tsx`. These are illustrative internal filenames, not files the skill writes. Keep business facts out of repeated UI literals; simple and deeper views use the same current fact. A historical comparison deliberately keeps the old revision separate.

The source product and its evidence determine truth; Atlas content is a maintained explanation, not an independent authority. A new PR brief updates the affected part without erasing existing, unrelated knowledge. Retain verified source revisions and coverage limits. A single newest brief is not a replacement for the whole guide.

### What updates, and when

The user or their chosen development tools can separately change Atlas content and, where necessary, the visual implementation. This may reuse an existing scene or add a genuinely needed pattern. A fresh context file is neither auto-ingested nor displayed as a long documentation panel.

An implemented Atlas change must be built/published before a deployed viewer sees it. The guide shows the source revision actually incorporated, not a guessed live-sync status. No in-browser editing, data persistence service, or source watcher is needed for V1. Local UI preferences are not the product knowledge store.

### Superseded assumptions

An internal Codex analysis service, automatically imported skill output, SQLite/Drizzle, Nest/Fastify, runtime ingestion validation, file watchers, webhooks, Notion, Obsidian, and memory/RAG services were earlier possibilities or mistaken interpretations. They are **not V1 requirements**. Zod is not required just to compile authored TypeScript content. Ordinary code-development hot reload is different from a source-context importer.

A previous interpretation also coupled the context skill to Superpowers. Sayed explicitly rejected that coupling. It must remain absent from any future skill and template; any downstream tool is a separate user choice.

[TECHNICAL.md](../technical/TECHNICAL.md) now documents the frontend-only defaults. This pack contains specification material, not a scaffolded or tested application. React/TypeScript/Vite and the other named libraries are engineering recommendations for the first build, not a claim of universal superiority or verified package compatibility.

### Cost and evidence

Preparing context and implementing visual changes use the user's chosen coding workflow. Ordinary browsing of a built explanation and selecting its saved cases make no model calls. Analysis and development still have time/token costs; no subscription entitlement or fixed cost is promised.

Source preparation stays authorized and bounded. Exclude secrets and unnecessary private data. A local frontend does not make the separate agent's model processing local. Preserve evidence and uncertainty; valid Markdown or TypeScript alone does not establish that the business claims are correct.

### Corrections

Initially fix an incorrect explanation through an Atlas development update. Record why the correction was made and the supporting evidence; do not silently overwrite it with a conflicting later brief. An in-app correction/feedback button was proposed but is **not required for V1**, and no feedback backend is implied.

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

| Conversation development                                                                  | Current interpretation                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial search for a project after Dark Factory                                           | Background motivation only; do not reopen generic project ideation unless asked.                                                                                                 |
| Sayed identified forgetting business/features after fast agentic development              | This became the central problem.                                                                                                                                                 |
| Initial “Product Brain” proposal with extensive knowledge entities                        | Useful context, but must not grow into a generic memory/knowledge platform.                                                                                                      |
| Restaurant-menu reference and request for colorful, low-text visuals                      | Strong visual direction and preference to preserve.                                                                                                                              |
| Early islands for every feature                                                           | Art was liked; literal one-island-per-feature and huge maps were challenged.                                                                                                     |
| Discussion of 1,000+ features and dense relations                                         | Preserve navigability and deeper access; do not require global graph rendering.                                                                                                  |
| User emphasized the math-book balance                                                     | Preserve exact behavior and useful meaning, not decorative simplification.                                                                                                       |
| Existing short PR-summary skill was abandoned by the user                                 | Another textual summary stream is not an adequate answer.                                                                                                                        |
| Tools/frameworks such as Warp, tmux, React discussed                                      | Technical concepts can be product concepts, but web apps remain MVP scope.                                                                                                       |
| Early greenfield setup wizard                                                             | Superseded: do not ask the user to author initial product knowledge.                                                                                                             |
| Latest greenfield/brownfield clarification                                                | Infer strategy; initialize existing products, grow fresh ones from merged PRs.                                                                                                   |
| Generated screenshots show manual setup choices or optional seed forms                    | Those image details do not override the clarification.                                                                                                                           |
| Art production discussion suggested reusable SVG/UI with AI meaning extraction            | Working technical proposal, not a locked production pipeline.                                                                                                                    |
| User asks whether to keep a living document now                                           | Maintain current decisions plus relevant background; avoid relying on a final conversation dump.                                                                                 |
| User asks what is missing and whether to add a layout document                            | Refine layout and interactions inside DESIGN.md; test one learning loop rather than add documents.                                                                               |
| Skill clarification                                                                       | Source investigation ends in standalone Markdown; implementation is a separate activity chosen by the user.                                                                      |
| User rejects downstream-tool coupling in the skill                                        | No Superpowers references, downstream instructions, or consumer dependency in the skill, template, or generated context.                                                         |
| User recognizes Atlas as illustrated interactive docs and accepts frontend-only direction | Maintain product knowledge in the Atlas repository; update content and visuals through development, not runtime ingestion.                                                       |
| User requests a reviewed downloadable handoff                                             | Add the technical baseline, reconcile existing documents, and verify package integrity; do not claim the application or skill has been field-tested.                             |
| User asks for only useful build material and a clear feature list                         | Remove superseded image experiments and the optional checksum file from the pack; consolidate MVP features in section 5 rather than create FEATURES.md.                          |
| User finalizes the project name                                                           | Atlas is the official name. Feature Atlas and Visual Product Memory were earlier working names, retained only as historical context. The independent skill remains `fill-atlas`. |
| Open-question cleanup                                                                     | Sayed approved replacing already-answered questions with V1 defaults; only real-source selection, implementation choices, and empirical checks remain. No new product features.  |

Earlier rejected projects—benchmarks, patch optimizers, synthetic customers, autonomous product experimentation, and additional review layers—are not pending features of Atlas.

---

## 15. Visual-reference guide

The context contains **13 retained visual references** in `references/inspiration/` and `references/concepts/`. Relative links work while the `context/` folder stays together. Superseded onboarding, scanner, dark-UI, and visual-engine experiments are not included.

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

| Area                   | V1 default                                                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First interaction      | Open a visual feature explanation, select an important alternate case, and see why its outcome changes. A before/after example explains one change. No mandatory quiz or slideshow.                                         |
| Navigation             | **Start here / Explore / What changed.** Feature cases, rules, and evidence stay within the selected experience. Search and back navigation preserve orientation.                                                           |
| Visual grammar         | Illustrated actions and walkthroughs for behavior; timelines for sequences; comparisons for conditions; compact tables for permissions. Only show scoped relationships that help the selected question.                     |
| Test content           | Use the clearly labelled **Reschedule a booking** fixture in DESIGN.md, including its saved cases and 48-to-24-hour change. This is demo content, not a real product claim or a booking-only scope.                         |
| Knowledge and evidence | Keep small TypeScript content files separate from scenes. Share current facts; retain source/revision references and explicit historical comparisons. Unsupported or conflicting facts remain unknown.                      |
| Essentials             | Introduce supported product purpose, main user journeys, prerequisites, and essential restrictions. Maintain the selection in content; no literal top-20% ranking or usage analytics.                                       |
| Artwork and renderer   | Reuse a small art kit with React/SVG and meaningful Motion transitions. Rich illustration may be raster. Choose and license-check actual assets while building the first scene; no full 3D or per-feature painting service. |
| Evaluation             | Check understanding, voluntary return, visual usability, and a correct before/after. Test source-context accuracy separately against real evidence and observe actual development cost; do not add a benchmark platform.    |

### Still to select or test—not missing product features

**Select later:** one small authorized source repository and PR for the independent skill test. None has been selected. This does not block the fixture-based frontend prototype, but real source evidence is required before claiming source accuracy.

**Resolve during implementation:** exact assets and their rights, compatible dependency versions, and the smallest useful content types. Keep the existing stack and architecture boundary; do not create a backend, memory service, or runtime importer to answer these questions.

**Validate in use:** whether Sayed understands the behavior and wants to return, whether the reusable artwork works in a browser, and whether the skill produces accurate standalone context. None is established by the documents or mockups. Detailed checks remain in [section 17](#17-how-we-should-evaluate-the-first-version) and [DESIGN.md](DESIGN.md#what-to-check-before-building-more).

A large brownfield engine, full 3D, cross-project enterprise search, multi-user governance, and analytics-driven ranking remain deferred. Nothing in this section adds a new feature or blocks the first prototype.

---

## 17. How we should evaluate the first version

**Prototype checks, not completed results or fixed numeric promises:**

- Can Sayed explain what a selected feature does, who uses it, and its most important limitation without opening the code?
- Does he willingly revisit the visual explanation after building something?
- Can a new user distinguish the main path from an important exception?
- Does source context, once separately implemented in Atlas, update the right explanation without contradictions or duplicates?
- Does fill-atlas stop at factual context without downstream instructions or application changes?
- Does a non-commerce web example still make sense without a new custom interface?
- Can a crowded dataset be navigated without drawing everything at once?
- Are the extraction and update costs acceptable in practice?

Synthetic feature records can test navigation and rendering. A real small codebase is needed to test whether the system understands actual behavior. Neither test alone proves the other.

---

## 18. Instructions for continuing the project

### For future conversations and coding agents

Start with README.md, this section 1, the [V1 defaults](#16-v1-defaults-and-prototype-checks), DESIGN.md section 8, and TECHNICAL.md for a build. Read deeper context only for the question at hand. A source-side fill-atlas invocation needs only its standalone skill and source evidence, not this entire application handoff.

Preserve the user's constraints. Do not silently promote a proposal, mockup widget, or plausible product convention into a requirement. Ask about consequential unresolved choices when necessary rather than filling them with enterprise defaults.

Do not start by building all the screens in the reference pack. The priority is an experience that makes product understanding enjoyable, then the smallest reliable mechanism to keep it current.

### Updating this document

After an agreed change:

1. Update the current section in place so it remains readable and accurate.
2. Keep a short explanation of significant superseded decisions where future agents could otherwise repeat them.
3. Label any new suggestion as proposed until accepted.
4. Update the version/date and add a compact change-log entry. Keep PROJECT.md responsible for scope, DESIGN.md for experience, and TECHNICAL.md for implementation; do not duplicate whole sections.
5. Regenerate the downloadable context pack when distributing an updated snapshot.

Do not append every message or keep conflicting versions of the current requirements. Use normal repository history/versioned copies later rather than growing an endless transcript inside this file.

### Portability

This file is the portable project record, not a promise that a chat session will retain all project state. Keep the latest downloaded version. A downloaded Markdown file or ZIP is a snapshot; editing a working copy here does not automatically modify a previously downloaded copy or a user's repository.

For another conversation or a coding session, supply the latest document and the relevant visual references. Confirm any missing files or conflicting decisions instead of claiming to remember unavailable context.

### Change log

| Version | Date       | Change                                                                                                                                                                                                                                                                                              |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | 2026-09-24 | Initial consolidated context from the project discussion; separated user requirements, proposals, open questions, and superseded mockup behavior; packaged the available visual references.                                                                                                         |
| 0.2     | 2026-09-24 | Added DESIGN.md v0.1 as a proposed experience/visual-design companion and linked its candidate navigation. Existing product requirements are unchanged; the new design is not yet approved.                                                                                                         |
| 0.3     | 2026-09-24 | Linked DESIGN.md v0.2 review: layout/navigation, concrete prototype behavior, art feasibility, and future evidence/update checks. Preserved requirements and reference status; all new design choices remain proposals.                                                                             |
| 0.4     | 2026-09-24 | Recorded the independent context-only fill-atlas boundary and the user's rejection of downstream coupling. Reframed initialization and visual updates as separate concerns; added draft skill/template. No runtime importer, backend, named planner dependency, or completed skill test is claimed. |
| 0.5     | 2026-09-24 | Consolidated frontend-only Atlas and repository-backed knowledge; added TECHNICAL.md v0.1, clarified briefs versus accumulated knowledge and explicit development updates, retained all 20 references, and recorded handoff review limits.                                                          |
| 0.6     | 2026-09-24 | Finalized Atlas as the official project name; aligned document titles and current naming, updated companion versions, and preserved earlier names only as history. No product, stack, skill, or reference-image behavior changed.                                                                   |
| 0.7     | 2026-09-24 | Packaging-only cleanup: one atlas/ root, documents in docs/, grouped and renamed visual references, updated links, and regenerated checksums. All project requirements, reference-image bytes, and the independent skill/template are preserved.                                                    |
| 0.8     | 2026-09-24 | Removed superseded mockup files and the optional package checksum file; consolidated existing MVP features in section 5; linked design details instead of repeating a second feature inventory; retained the independent skill unchanged.                                                           |
| 0.9     | 2026-09-24 | Replaced the open-question list with agreed V1 defaults and distinct prototype checks; aligned navigation, fixture choice, art, knowledge, and evaluation wording across the pack. Skill, images, stack, and feature scope are unchanged.                                                           |

---

**Final guardrail:** Build something that makes Sayed want to understand his product. Do not let the documentation, data model, or artwork become a substitute for that outcome.
