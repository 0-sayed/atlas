# Local Atlas API and strict content contract

This reference travels with `update-atlas`; it does not require an Atlas checkout. It describes current read contract **2**, accepting strict write contracts **1 and 2**. First obtain the intended local Atlas URL/project ID and check `GET /api/v1/ready` returns `{ "status": "ready", "contractVersion": 2 }`; also read `GET /api/v1/capabilities` before preparing any write. The production API defaults to loopback port 4317, but a running instance may use another configured port. Never infer the target from this default. Paths below are relative to the chosen base URL's `/api/v1`.

## Routes and write protocol

| Route                               | Result                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `GET /capabilities`                 | Read-only supported versions, scenes, records, visuals and capacity limits.                               |
| `GET /ready`                        | Readiness and contract version.                                                                           |
| `GET /projects?after=<id>`          | Array of up to 100 `{id,title,revision}` summaries, ordered by ID. Continue with the last ID when needed. |
| `GET /projects/:id`                 | Full project document or 404. Read before changing a project.                                             |
| `GET /projects/:id/assets/:assetId` | Registered image bytes; 404 for unavailable image.                                                        |
| `POST /projects`                    | Create a new project; returns its full document at revision 1.                                            |
| `POST /projects/:id/changes`        | Scoped change batch; returns the full document at the next revision.                                      |
| `POST /projects/:id/assets`         | Register one immutable image ID; returns the full document at the next revision.                          |

For POST, send JSON with `Content-Type: application/json` and `Authorization: Bearer <local write token>`. The token is supplied privately by the local instance; keep it out of shell history, logs, context files, and reports. Send it only to the selected loopback host. Atlas checks Host and any Origin; a nonbrowser local client may omit Origin. All writes require the current numeric `expectedRevision` except project creation. Use the returned document's revision after **every** upload or change. A failed/timeout response may hide a committed write: GET the project and compare before any retry. A `409 revision_conflict` requires a fresh GET and intentional recomposition, never blind replay.

Error JSON is `{ "error": { "code": "...", "message": "...", "fields"?: [{"path":"...","code":"..."}] } }`. Relevant statuses: 400 invalid shape/reference or invalid image, 401 credential, 403 Host/Origin/cross-site, 404 missing, 409 existing project/asset ID or stale revision, 413 body too large, 415 wrong media type, 500 unexpected failure, 503 unavailable storage. Inspect the response and persisted state before acting again.

## Document and payload shapes

IDs match `^[a-z0-9][a-z0-9-]{0,63}$`. Required text is trimmed, nonempty, at most 4000 characters; short text at most 160. Project/feature titles, actor, group, revisionLabel, and case label/action/result are short text; purpose, navigation start/reason/rules, and evidence source/scope/description use the 4000-character limit. Revision is an integer from 0 through `Number.MAX_SAFE_INTEGER - 1`. Strict objects reject unknown fields. Arrays and nested objects must have the specified types; no implicit defaults.

`POST /projects` takes `{ contractVersion:1, id, title, features, relations }`. Up to 100 features and 200 relations **per create/change batch**, independently of total capacity (500 features and 2,000 relations). Create starts with no assets, so new features' `assetIds` must be empty. To add images, create first, register assets, then upsert the affected full features. A current read document always uses `contractVersion:2`, adds `{revision, assets}`, optional purpose and the supporting collections below (empty when absent); assets are up to 200 `{id,mediaType,provenance}` records.

`POST /projects/:id/changes` takes `{ contractVersion:1, expectedRevision, title?, upsertFeatures?, removeFeatureIds?, upsertRelations?, removeRelationIds? }`. Upsert arrays allow at most 100 features or 200 relations; remove arrays have the same respective limits. Unmentioned records remain. Each upserted feature replaces that _whole feature_, including all cases, evidence, `assetIds`, and presentation; build from the current full object for a small edit. Explicit removals must identify existing records, cannot duplicate IDs, and cannot conflict with an upsert. Relations must reference features in the same project after the batch; remove or redirect relations in the same batch when removing a feature. A valid batch increments revision even if values happen to be unchanged: compare first and skip a no-op POST. Validation and persistence are transactional.

When any features have `essentialOrder`, Start Here includes all those selected features, ordered by that number with ID as the tie-breaker; other activities remain in Explore. With no selection, it includes all activities ordered by ID. The current overview initially displays six and reveals six more through “Show more activities”; this display batch is not a knowledge or selection limit. Set `essentialOrder` deliberately when preparing a starting path, and do not omit supported activities to fit a display batch.

Every feature has `id`, `title`, `actor`, `purpose`, optional `group`, optional integer `essentialOrder` (0–100), `revisionLabel`, `evidence`, `assetIds`, `scene`, and scene-specific fields. `assetIds` is an array of at most 20 unique IDs already registered in this project. The visual-foundation extension adds optional `presentation`; when present it must be `{ illustration, accent }` with `illustration` one of `calendar | document | compass | parcel | people` and `accent` one of `sky | sage | peach`. No custom HTML, SVG, CSS, layout, or extra keys. Presentation selects built-in art only and is not evidence of changed product behavior. If absent, the renderer chooses a scene default. Read `GET /capabilities` and check `visual.presentation`, `visual.illustrations` and `visual.accents` before including presentation. Never use a normal project write as a capability probe.

`evidence` is `{ status, source, sourceRevision, scope, description }`: status is `demo | supported | uncertain`; `source`, `scope`, and `description` are required text; `sourceRevision` is short text. `supported` requires inspected support for the exact claim and scope. Use `uncertain` for a material evidence gap and `demo` for illustrative values. An Atlas document revision is not the source revision.

Scene-specific strict shapes:

| Scene                           | Additional feature fields                                  | Case fields                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `{kind:"booking",version:1}`    | `noticeHours` number 0–876000; `cases` up to 100.          | `{id,label,hours,owner,confirmed,slot}`; owner `you` or `other`; confirmed is boolean; slot `free`, `occupied`, or `unknown`; hours 0–876000. |
| `{kind:"approval",version:1}`   | `requiredApprovals` integer 1–10; `cases` up to 100.       | `{id,label,role,state,approvals}`; role `reviewer` or `requester`; state `pending` or `closed`; approvals integer 0–10 or null.               |
| `{kind:"navigation",version:1}` | `rules` up to 20 nonempty text strings; `cases` up to 100. | `{id,label,start,action,result,reason,outcome}`; outcome `available`, `unavailable`, or `unknown`.                                            |

Feature IDs, relation IDs, asset IDs, and case IDs within each feature must be unique. A relation is `{id,from,to,kind}` with kind `requires | related`; both endpoints must be in the project. `related` must not be used to conceal a specific unsupported rule. Scene fit is a product decision: navigation records a real start, action, result, reason, and outcome; it cannot simulate arbitrary stateful interaction.

## Current v2 knowledge and authored activity

The route namespace remains `/api/v1`. `GET /capabilities` returns `capabilitiesVersion:1`, `readContractVersion:2`, `writeContractVersions:[1,2]`, scene entries `{kind,versions,contractVersions}`, supported `records`, `relationshipKinds`, `visual` and `limits`. Booking/approval/navigation version 1 accept write contracts 1/2; authored version 1 requires contract 2. `visual` advertises built-in `presentation`, registered raster images, exact illustrations and accents. Unknown capability versions or unavailable capability discovery stop authoring before writes. Run `node scripts/preflight.mjs <chosen-local-base-url> <prepared-json-path> [existing-project-id]` from a copied skill. It only reads capabilities/the chosen project and reports payload/current/projected-document bytes, the applicable byte limit, target and current revision; it neither writes nor accepts a credential. It checks renderer and limit fit; the strict shapes below and backend validation still apply.

A v2 create keeps `{contractVersion:2,id,title,features,relations}`, adding optional `purpose`, `evidenceRecords`, `actors`, `rules`, `areas`, `journeys`, `glossary`. Absent supporting collections read as empty arrays; purpose stays absent. Each create collection accepts at most 100 records. A read is one coherent current revision, bounded to 8 MiB UTF-8 for authored knowledge. The advertised `legacyDocumentBytes` compatibility bound (256 MiB) applies only to documents with at most 100 features/200 relationships, exact legacy feature shapes (no actor/rule/area/evidence bindings), only requires/related relationships without evidence IDs, no project purpose or supporting records, and each feature within the 2 MiB request bound. This preserves every formerly supported accumulated project; introducing new knowledge or exceeding old counts requires reducing the document below 8 MiB first. This compatibility ceiling is not a normal-project performance budget. The preflight merges complete record replacements, removals, purpose and next revision, and checks projected document bytes before approving fit. Total collections allow 2,000 evidence records and 1,000 actors/rules/areas/journeys/terms each, 500 features, 2,000 relations and 200 assets. Writes retain the 2 MiB request bound. Large projects use multiple bounded change batches, each composed against the last returned revision; never drop facts to satisfy a single batch limit. Limits are advertised by the selected instance, not universal product rules.

`POST /projects/:id/changes` with version 2 keeps the legacy feature/relation fields and adds `purpose?` (null explicitly removes it), `upsertEvidenceRecords?`/`removeEvidenceRecordIds?`, `upsertActors?`/`removeActorIds?`, `upsertRules?`/`removeRuleIds?`, `upsertAreas?`/`removeAreaIds?`, `upsertJourneys?`/`removeJourneyIds?`, `upsertGlossary?`/`removeGlossaryIds?`. Each supporting array/removal batch allows 100. Omitted records survive, upserts replace whole records, removals must exist and cannot overlap upserts. All references must remain valid after the entire batch; removing a cited rule/actor/feature/evidence requires updating or removing its users atomically. A version-1 scoped write still preserves unrelated v2 records. Version-1 writes cannot submit v2 scene/binding/record extensions.

`evidenceIds` is a nonempty array of up to 20 unique IDs of project evidence records; it is mandatory on all new meaningful records and on authored activities/steps/cases. Other reference arrays allow up to 100 unique scoped IDs (case step IDs up to 50). Evidence record `status` may be `conflicting`, with description stating the inspected disagreement; legacy feature evidence keeps its original three statuses. Neither a conflict nor an unknown reason permits an invented resolution.

| Record          | Strict fields                                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose         | `{text,evidenceIds}`                                                                                                                                                                |
| Evidence record | `{id,status,source,sourceRevision,scope,description}`; same text lengths as feature evidence, plus `conflicting` status                                                             |
| Actor           | `{id,name,description?,evidenceIds}`; name short, optional description text; participation establishes no permissions                                                               |
| Rule            | `{id,title,statement,evidenceIds}`; title short, statement exact condition text including operators/units/unknowns                                                                  |
| Area            | `{id,title,description?,evidenceIds}`; grouping carries no inferred taxonomy                                                                                                        |
| Journey         | `{id,title,goal,steps,evidenceIds}`; goal text, steps 1–100 ordered `{featureId,stepId?}`; step ID may reference only an authored step in that feature; repeated visits are allowed |
| Glossary        | `{id,term,definition,featureIds,ruleIds,evidenceIds}`; term short, definition text; references may be empty                                                                         |

V2 specialized features preserve all legacy fields and may add `actorIds?`, `ruleIds?`, `areaId?`, `evidenceIds?`. Authored features use all common feature fields (including the short `actor` summary for compatibility), `scene:{kind:"authored",version:1}`, mandatory `actorIds`, `ruleIds`, `evidenceIds`, optional `areaId`, `steps` (0–50), and `cases` (0–100). Referenced actor/rule arrays may be empty; missing facts stay explicit. The actor summary is display text; referenced actors supply participation.

- Step: `{id,title,description,actorIds,ruleIds,evidenceIds}`. Title short; description text. Actor/rule IDs must be declared on the same feature as well as exist in the project. Array order is the recorded step order.
- Case: `{id,label,stepIds,conditions,outcome,evidenceIds}`. Label short. Step IDs reference this feature's steps and select the included steps. `conditions` (0–100) contains unique `{ruleId,state}` referencing the feature's rules, with state `met | not-met | unknown | conflicting`.
- Outcome: `{status,result,reason?}`; status `allowed | blocked | unknown | conflicting`, result and optional reason text. Missing reason stays absent; the guide says none is recorded. Atlas displays this exact saved outcome and never evaluates the conditions to calculate another one. Inconsistent evidence remains explicit even when condition/outcome records disagree.

V2 relations keep `{id,from,to,kind}` and optional `evidenceIds`. Existing `requires | related` remain readable without new evidence. New `blocks | triggers` require nonempty evidence IDs. Endpoints are scoped features. Directed labels retain Blocks/Blocked by and Triggers/Triggered by meanings; these edges never supply journey order.

[authored-example.json](authored-example.json) is a complete strict v2 **synthetic logistics** create: two participants, ordered steps, a cited checklist condition, allowed/blocked/unknown/conflicting recorded cases, an explicit journey and glossary. It has no real-source claim or registered assets. Replace every claim with reviewed evidence before live incorporation. The renderer, evidence references, API example and preflight are tested together from a copied skill in temporary storage.

Legacy records read in v2 unchanged, with empty new collections and the same Atlas revision. SQLite format upgrades add storage only, not source behavior. A source revision, presentation update or format migration is not itself a product behavior change.

## Minimal illustrative navigation create/update

These **demo** values show valid wire shapes only; they are not source findings. Before a live write, replace them with reviewed facts and evidence. Create once, only for the owner's intended new project:

```json
{
  "contractVersion": 1,
  "id": "harbor-guide",
  "title": "Harbor Guide",
  "features": [
    {
      "id": "find-records",
      "title": "Find records",
      "actor": "Reader",
      "purpose": "Find an illustrative record from a list.",
      "revisionLabel": "Illustrative example",
      "evidence": {
        "status": "demo",
        "source": "Illustrative payload in update-atlas API reference",
        "sourceRevision": "example-1",
        "scope": "Demo only; no source product claim",
        "description": "Shows the navigation contract, not observed behavior."
      },
      "assetIds": [],
      "scene": { "kind": "navigation", "version": 1 },
      "rules": ["This rule is illustrative."],
      "cases": [
        {
          "id": "matching-record",
          "label": "A matching record",
          "start": "The reader is on the list.",
          "action": "Choose a matching record",
          "result": "The example detail is available",
          "reason": "The example record exists in this demo.",
          "outcome": "available"
        }
      ]
    }
  ],
  "relations": []
}
```

The returned create document has `revision:1`. This concrete follow-up body changes just the one illustrative rule via a **full feature replacement** at `/projects/harbor-guide/changes`; it preserves the case and evidence:

```json
{
  "contractVersion": 1,
  "expectedRevision": 1,
  "upsertFeatures": [
    {
      "id": "find-records",
      "title": "Find records",
      "actor": "Reader",
      "purpose": "Find an illustrative record from a list.",
      "revisionLabel": "Illustrative example",
      "evidence": {
        "status": "demo",
        "source": "Illustrative payload in update-atlas API reference",
        "sourceRevision": "example-1",
        "scope": "Demo only; no source product claim",
        "description": "Shows the navigation contract, not observed behavior."
      },
      "assetIds": [],
      "scene": { "kind": "navigation", "version": 1 },
      "rules": ["This updated rule is still illustrative."],
      "cases": [
        {
          "id": "matching-record",
          "label": "A matching record",
          "start": "The reader is on the list.",
          "action": "Choose a matching record",
          "result": "The example detail is available",
          "reason": "The example record exists in this demo.",
          "outcome": "available"
        }
      ]
    }
  ]
}
```

Do not send `id`, `features`, or `relations` as top-level update fields. The optional top-level `title` updates the project title. For an instance known to support presentation, either payload may add `"presentation": {"illustration":"compass","accent":"sky"}` inside the feature; preserve it on future upserts.

## Optional raster asset sequence

For a previously created/read project at revision `R`, register an inspected PNG/JPEG/WebP using `POST /projects/:id/assets`:

```json
{
  "contractVersion": 1,
  "expectedRevision": 1,
  "id": "records-illustration-v1",
  "mediaType": "image/png",
  "provenance": "Original illustration created for this guide; source brief and creator recorded privately",
  "base64": "<actual canonical base64 of an inspected PNG, without data-URL prefix>"
}
```

The placeholder is explanatory, not a valid upload. Actual canonical base64 must match the declared file signature; decoded bytes must be at most **1 MiB** (base64 string at most 1,400,000 characters). SVG, code, data URLs, remote URLs, and arbitrary file paths are not accepted. Asset ID and metadata are immutable; changed art gets a new ID. If registration returns revision `R+1`, use `expectedRevision:R+1` in the next change and upsert the _full_ feature with the new asset ID in `assetIds`. Keep the new ID out of `assetIds` if registration failed or could not be confirmed by read-back.
