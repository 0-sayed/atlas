# Atlas

**Planning context** · **Updated:** 2026-09-24  
Documentation and visual references for the first frontend prototype. This is not a running application.

## Start here

For the scope at a glance, read **[MVP features](business/PROJECT.md#mvp-features)**. The list already belongs in PROJECT.md; a separate FEATURES.md would duplicate it. **[V1 defaults and prototype checks](business/PROJECT.md#16-v1-defaults-and-prototype-checks)** now replaces the old open-question list: use the settled starting decisions and test them in the prototype.

| File                                                                    | Use it for                                                                              |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [PROJECT.md](business/PROJECT.md)                                       | What Atlas does, the MVP features, boundaries, and the reasoning to preserve.           |
| [DESIGN.md](business/DESIGN.md)                                         | Layout, interactions, visual style, and the first illustrated walkthrough.              |
| [TECHNICAL.md](technical/TECHNICAL.md)                                  | The frontend stack, repository-backed facts, artwork, and tests.                        |
| [Visual-reference guide](business/PROJECT.md#15-visual-reference-guide) | How to use the 13 retained reference images without copying unapproved mockup behavior. |

## Structure

```text
context/
  README.md
  business/
    PROJECT.md
    DESIGN.md
    references/
      inspiration/
      concepts/
  technical/
    TECHNICAL.md
```

Keep the folder together so links work. Add the future app source and build configuration at the repository root, alongside `planning/`, not inside this context folder.

## The boundary

The planned source-side workflow is `source project / PR → fill-atlas → standalone context Markdown → stop`.

Separately, use that context during an Atlas development update. The running guide shows maintained product facts through interactive illustrations. It has no backend, database, runtime model, source scanner, or context importer in V1. A new context file alone does not update the application. The planned skill has no downstream tool or implementation dependency.

## First build

Build one attractive loop: **Start here → feature → choose a case → inspect its reason → compare a change → back**. Use the labelled booking fixture in [DESIGN.md](business/DESIGN.md#1-the-first-interaction-to-prototype), keep facts separate from their presentation, and reuse a small art kit.

Then check whether the explanation is clear and enjoyable. Create and test the context-only skill against real authorized source evidence separately. Do not implement every pictured menu, invent features to fill a scene, or treat mockups as finished production assets.

## What's included—and what is not

The first demo is the labelled booking fixture. The 13 retained visual references are design context. The source-side skill is planned and will be created and validated separately.

Application code, installed dependencies, browser tests, production artwork, and a tested real-PR skill result are **not included**. The next step is implementation, not more paperwork.

Keep private context and source material out of publicly served files. The images are design references, not files to copy wholesale into the app bundle. A downloaded pack is a snapshot; earlier copies and remote repositories do not update automatically.
