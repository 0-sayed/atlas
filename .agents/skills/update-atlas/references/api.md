# Local Atlas API and strict content contract

This reference travels with `update-atlas`; it does not require an Atlas checkout. It describes contract version **1**. First obtain the intended local Atlas URL/project ID and check `GET /api/v1/ready` returns `{ "status": "ready", "contractVersion": 1 }`. The production API defaults to loopback port 4317, but a running instance may use another configured port. Never infer the target from this default. Paths below are relative to the chosen base URL's `/api/v1`.

## Routes and write protocol

| Route                               | Result                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
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

`POST /projects` takes `{ contractVersion:1, id, title, features, relations }`. Up to 100 features and 200 relations. Create starts with no assets, so new features' `assetIds` must be empty. To add images, create first, register assets, then upsert the affected full features. A read document adds `{revision, assets}` to the create shape; assets are up to 200 `{id,mediaType,provenance}` records.

`POST /projects/:id/changes` takes `{ contractVersion:1, expectedRevision, title?, upsertFeatures?, removeFeatureIds?, upsertRelations?, removeRelationIds? }`. Upsert arrays allow at most 100 features or 200 relations; remove arrays have the same respective limits. Unmentioned records remain. Each upserted feature replaces that _whole feature_, including all cases, evidence, `assetIds`, and presentation; build from the current full object for a small edit. Explicit removals must identify existing records, cannot duplicate IDs, and cannot conflict with an upsert. Relations must reference features in the same project after the batch; remove or redirect relations in the same batch when removing a feature. A valid batch increments revision even if values happen to be unchanged: compare first and skip a no-op POST. Validation and persistence are transactional.

When any features have `essentialOrder`, Start Here includes all those selected features, ordered by that number with ID as the tie-breaker; other activities remain in Explore. With no selection, it includes all activities ordered by ID. The current overview initially displays six and reveals six more through “Show more activities”; this display batch is not a knowledge or selection limit. Set `essentialOrder` deliberately when preparing a starting path, and do not omit supported activities to fit a display batch.

Every feature has `id`, `title`, `actor`, `purpose`, optional `group`, optional integer `essentialOrder` (0–100), `revisionLabel`, `evidence`, `assetIds`, `scene`, and scene-specific fields. `assetIds` is an array of at most 20 unique IDs already registered in this project. The visual-foundation extension adds optional `presentation`; when present it must be `{ illustration, accent }` with `illustration` one of `calendar | document | compass | parcel | people` and `accent` one of `sky | sage | peach`. No custom HTML, SVG, CSS, layout, or extra keys. Presentation selects built-in art only and is not evidence of changed product behavior. If absent, the renderer chooses a scene default. A ready response with `contractVersion:1` alone does **not** prove an older Atlas instance accepts this optional extension. Establish support from that instance's contract/documentation or an isolated test instance before including it; otherwise omit `presentation` and use the default art. Never use a normal project write as a capability probe.

`evidence` is `{ status, source, sourceRevision, scope, description }`: status is `demo | supported | uncertain`; `source`, `scope`, and `description` are required text; `sourceRevision` is short text. `supported` requires inspected support for the exact claim and scope. Use `uncertain` for a material evidence gap and `demo` for illustrative values. An Atlas document revision is not the source revision.

Scene-specific strict shapes:

| Scene                           | Additional feature fields                                  | Case fields                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `{kind:"booking",version:1}`    | `noticeHours` number 0–876000; `cases` up to 100.          | `{id,label,hours,owner,confirmed,slot}`; owner `you` or `other`; confirmed is boolean; slot `free`, `occupied`, or `unknown`; hours 0–876000. |
| `{kind:"approval",version:1}`   | `requiredApprovals` integer 1–10; `cases` up to 100.       | `{id,label,role,state,approvals}`; role `reviewer` or `requester`; state `pending` or `closed`; approvals integer 0–10 or null.               |
| `{kind:"navigation",version:1}` | `rules` up to 20 nonempty text strings; `cases` up to 100. | `{id,label,start,action,result,reason,outcome}`; outcome `available`, `unavailable`, or `unknown`.                                            |

Feature IDs, relation IDs, asset IDs, and case IDs within each feature must be unique. A relation is `{id,from,to,kind}` with kind `requires | related`; both endpoints must be in the project. `related` must not be used to conceal a specific unsupported rule. Scene fit is a product decision: navigation records a real start, action, result, reason, and outcome; it cannot simulate arbitrary stateful interaction.

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
