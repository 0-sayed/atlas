# T004 source-skill validation

## Deliverable and provenance

The independent `fill-atlas` skill and companion template are tracked in [`.agents/skills/fill-atlas/`](../../.agents/skills/fill-atlas/SKILL.md). A local agent installation also exists; the repository is the maintained source. The skill retains its original v0.10 bytes; the bundled template has only Prettier table formatting changes. The hashes in [source-pack retrieval](tasks.md#t004-source-pack-retrieval) identify the original reviewed baseline, not the formatted template. The relative template link resolves, and the skill-creator metadata validator passes.

This branch carries the skill, template and validation record. Generated source context remains private and outside the repository; a fresh checkout does not need the original pack to use the skill. Local evaluation inputs and outputs are retained separately under the user's local application-data directory, in `atlas-t004-validation`; they are not published by this repository.

## Evaluation scope

The real source is Atlas itself, inspected read-only at `f7810fd20099ffcb99dad5f0efcb070fe4593eb5`. The change range starts at `81d892bd3ff8cec32c3f931a7bf079fe15ed14c3`. It covers the transition from compiled guide content to the local knowledge platform. No deployment or private stored knowledge is inferred from this range.

The controlled scaffold and refactor inputs are synthetic evaluation cases, not evidence of an external product. The scaffold contains only a Hello-world page and documented delivery-app aspirations. The neutral refactor adds grouping parentheses and a comment to `role === "owner" && hours >= 24`, preserving evaluation order. The unavailable-source case supplies only a repository label and PR number, with no source access.

An additional refactor probe extracted both conditions into local variables. The skill correctly identified that this evaluates the hours comparison even for non-owners, unlike the original short-circuit expression. It limited equivalence to numeric inputs rather than inventing a universal no-change conclusion. That probe is retained separately from the neutral-refactor test.

An independent no-skill baseline already distinguished the illustrative booking guide from a real booking service. No behavioral failure was observed in that baseline; installation initially failed the presence check because the skill did not exist. The supplied draft was reused unchanged instead of manufacturing a documentation edit. A later generated-context error was identified and corrected during source review, as recorded below.

## Checks

| Scenario | Observed result |
|---|---|
| Initial current app | Distinguishes reader behavior, authored booking examples, and local writer capabilities; preserves notice, ownership, confirmation and availability conditions. |
| Authorized change range | Describes compiled content becoming persisted API-loaded knowledge; compares both source revisions and does not present fixture history as a real booking release. |
| Scaffold only | Reports greeting-only implementation; delivery activities remain documented intentions. |
| Behavior-neutral refactor | Reports no relevant behavioral change and preserves the owner check, inclusive 24 threshold and short-circuit order. |
| Missing evidence | Produces an inconclusive context with no product claims and requests source access/diff. |
| Existing output | Leaves unrelated `scaffold.md` byte-for-byte intact and writes `scaffold-context.md`. |
| Source instructions | Ignores source-note requests to install dependencies, call Atlas, or create a downstream plan. |

Independent final review found one important error in the initial current-app output: it generalized `expectedRevision` to all writes. The strict create contract actually rejects that field; update and asset-registration contracts require it. The original is retained as `current-unreviewed.md`, and `current.md` now states the requirements per action. A separate maintainer contract probe verified creation succeeds without the field and rejects it, while update/upload reject its omission. This probe ran after the read-only skill evaluations; the skill evaluators did not execute source scripts.

The skill already instructs preserving applicable scope, so it was not rewritten for this sample error. The accepted context includes a human-reviewed correction; this is not a claim that every raw generated claim was accurate. Source review remains necessary before T005 incorporation.

One minor wording issue remains in the sample: it calls the scene's outcome “recorded,” although the outcome and explanation are derived from saved conditions. The detailed rule and evidence are correct; this wording is deferred.

Review limits: evaluators were instructed to use read-only source access and final source state was checked; their complete command histories were not independently audited. The existing-output sentinel was checked byte-for-byte by the maintainer. A requested change with only one available revision was not separately exercised; the missing-source case does not prove that distinct behavior. Accuracy on arbitrary repositories is not established.

Repository regression validation on 2026-09-25: `npm run validate` passed, including formatting, lint, type checks, 33 unit/integration tests, 16 browser tests, builds, artifact boundaries, and production restart/shutdown smoke checks. These checks establish Atlas regression status; they do not establish source-context accuracy.

## Boundaries

The skill writes standalone Markdown and stops. It does not populate Atlas, invoke a planner, execute source scripts, or run in the browser. T005 owns saving reviewed real-source knowledge through the API. This validation is a bounded sample, not proof of accuracy for arbitrary repositories.
