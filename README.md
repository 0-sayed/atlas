# Atlas

Atlas explains saved product knowledge through interactive scenes. The booking guide is an **illustrative fixture**, not verified source behavior or a real booking app. React reads a local NestJS API; one SQLite database owns knowledge, revisions, relationships and registered assets. Source interpretation and `fill-atlas` remain outside the app runtime. The standalone [skill](.agents/skills/fill-atlas/SKILL.md) and [context template](.agents/skills/fill-atlas/assets/context.template.md) are included in this repository; Codex discovers it from `.agents/skills/` when working in this repository. To use it in other projects, install a copy in your agent's user-level skills directory.

## Run locally

Use Node **22.23.2** and npm:

```sh
npm ci
cp .env.example .env
# Generate a credential, then place its value in ATLAS_WRITE_TOKEN in .env:
openssl rand -hex 32
npm run build
npm run storage -- migrate
npm start
```

In another terminal run `npm run seed` once, then open `http://127.0.0.1:4317`. The fixture is saved through the authenticated API; reseeding conflicts rather than overwriting data. Startup never silently seeds. For development run `npm run dev:api` and `npm run dev` in separate terminals. Vite proxies `/api` to Nest. `npm run preview` serves frontend files only; `npm start` serves the complete production app.

| Setting               | Default / requirement                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `ATLAS_WRITE_TOKEN`   | Required 32–256 letters/digits/underscore/hyphen; generate randomly. The example placeholder deliberately fails validation. |
| `ATLAS_DATA_DIR`      | `.local` relative to this checkout; separate directory per worktree                                                         |
| `ATLAS_PORT`          | `4317`, loopback API and production frontend                                                                                |
| `ATLAS_FRONTEND_PORT` | `5173`, loopback Vite; use distinct ports for parallel checkouts                                                            |
| `ATLAS_E2E_PORT`      | `4174`; set in the invoking environment for parallel browser tests                                                          |

Keep `.env`, SQLite, journals, images and backups private. `.local/` is ignored and never statically served. **Refresh guide** loads a coherent revision; failure labels retained content as last loaded. T003 owns project selection and the second distinct composition; T002 opens `booking-demo`.

## API for local agents

[shared/contracts.ts](shared/contracts.ts) owns strict versioned schemas. Write bodies require `contractVersion: 1`; unknown fields fail. Current project responses carry the version. Limits: JSON 2 MiB; images 1 MiB; 100 features, 100 cases per feature, 200 relations and 200 assets per project. IDs use lowercase ASCII letters/digits/hyphens, at most 64 characters. Only `booking` scene version 1 is supported.

All routes below start with `/api/v1`:

| Method / path                       | Behavior                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `GET /ready`                        | Database/schema/foreign-key readiness, no private details                                              |
| `GET /projects`                     | Up to 100 summaries (`id`, `title`, `revision`) ordered by ID; pass `?after=LAST_ID` for the next page |
| `GET /projects/:id`                 | Coherent current document                                                                              |
| `GET /projects/:id/history`         | Immutable Atlas snapshots, oldest first                                                                |
| `POST /projects`                    | Create at revision 1; [fixtures/booking.ts](fixtures/booking.ts) is the tested full example            |
| `POST /projects/:id/changes`        | Scoped batch using `expectedRevision`                                                                  |
| `POST /projects/:id/assets`         | Register immutable ID, `mediaType`, `provenance`, `base64`, `expectedRevision`; increments revision    |
| `GET /projects/:id/assets/:assetId` | Registered image bytes, no filesystem path input                                                       |

Writes require `Authorization: Bearer <local credential>`. CLI callers may omit Origin; browser Origin/Host are restricted to configured loopback ports. Cross-site requests fail. No permissive CORS or frontend credential.

After building and starting the server, this reads a project and changes only its current notice rule:

```sh
node --env-file=.env --input-type=module <<'JS'
import { updateSchema } from './dist-server/shared/contracts.js'
const base = `http://127.0.0.1:${process.env.ATLAS_PORT || 4317}/api/v1`
const read = await fetch(`${base}/projects/booking-demo`)
if (!read.ok) throw new Error(`Read failed: ${read.status}`)
const project = await read.json()
const feature = project.features.find(item => item.id === 'booking')
const body = updateSchema.parse({ contractVersion: 1, expectedRevision: project.revision,
  upsertFeatures: [{ ...feature, noticeHours: 30 }] })
const response = await fetch(`${base}/projects/${project.id}/changes`, {
  method: 'POST', headers: { 'content-type': 'application/json',
    authorization: `Bearer ${process.env.ATLAS_WRITE_TOKEN}` }, body: JSON.stringify(body),
})
console.log(response.status, await response.json())
JS
```

`upsertFeatures` replaces each named feature, including cases. Omitted features/relations remain unchanged. `removeFeatureIds` and `removeRelationIds` explicitly remove records; remove references in the same batch. Duplicates, unsupported scenes, cross-project references and stale revisions fail atomically. Asset IDs are immutable and retained for history; new art uses a new ID.

Errors use `{ "error": { "code": "revision_conflict", "message": "..." } }`; shape errors add field paths/codes without submitted values. Statuses: 400 invalid request/references, 401 credential, 403 Host/Origin, 404 missing, 409 duplicate/stale revision, 413 size, 415 media type, 500 unexpected failure, 503 unavailable storage. Conflicts require rereading and deliberately preparing a new batch. Valid format does not prove business truth; source evidence/revision is separate from Atlas revision.

## Storage, upgrades and recovery

Tracked SQL is in `migrations/`, currently schema 2. Every connection enables foreign keys. Batches, snapshots and revisions commit together. Images are staged completely before registration; generated keys and symlink checks restrict serving.

Before upgrading, stop Atlas and back up using the **existing compatible version**. Backup locks out the app and uses SQLite's backup facility without applying migrations, plus registered assets and a database checksum manifest. Keep the manifest with the backup; restore verifies it before migrations, so changed or missing history cannot silently pass SQLite integrity checks. Startup/migrate applies migrations transactionally; future schema versions are rejected.

```sh
# Server stopped; destination must not exist.
npm run storage -- backup /private/location/atlas-backup
npm run storage -- migrate
# Restore to NEW private storage, leaving the original untouched.
ATLAS_DATA_DIR=/private/location/atlas-restored npm run storage -- restore /private/location/atlas-backup
ATLAS_DATA_DIR=/private/location/atlas-restored npm start
```

Restore verifies database integrity, foreign keys, contracts, history and registered assets before exposing the restored directory. Test restoration before relying on backups. A stopped-process copy of the entire directory is also suitable before an incompatible upgrade; copying only an active database file is not.

Processes hold a storage `.lock`. After a crash, remove a stale lock only after confirming no Atlas process uses that directory. SIGINT/SIGTERM closes listeners/database and releases the lock. Structured startup events omit request bodies, credentials and private paths.

## Verify

Install Chromium with `npx playwright install chromium`, then run `npm run validate`. It covers format, lint, TypeScript, Vitest/database/Supertest, Playwright through production Nest/frontend/SQLite, both builds, artifact boundaries, and production restart/shutdown. Tests use temporary storage, never `.local/`. Browser checks retain navigation, Back, cases, evidence, keyboard/focus, narrow layouts and reduced motion. Audit and secret scanning are separate CI jobs; dependency updates are monthly, grouped into one npm PR and one GitHub Actions PR. Security updates are grouped separately per ecosystem and are not delayed until the monthly run.

PR checks enforce Conventional Commit titles and reject newly introduced high/critical dependency vulnerabilities across runtime and development dependencies. A separate metadata-only workflow assigns human-authored PRs to their authors. The pending GitHub activation steps are in [bootstrap repository settings](planning/bootstrap.md#step-3--repository-settings).

Production needs `dist-server/`, `dist/`, tracked `migrations/` and runtime npm dependencies, started from the repository root. Static hosting alone cannot serve the database. Docker and publishing remain deferred.

## Scope and rights

Atlas's source repository is **public, all rights reserved**; no open-source license has been selected. Repository visibility does not make local knowledge or credentials public. The owner must decide licensing before an open-source release or artifact distribution. In-app SVG/CSS is original artwork; system fonts need no bundled files. Design-only `planning/` references are excluded from application builds. Dependency packages retain their own license files. Before distributing built frontend/backend artifacts, include the applicable dependency licenses and notices with those artifacts; no duplicated root notice snapshot is maintained.

See [scope](planning/context/business/PROJECT.md), [design](planning/context/business/DESIGN.md), [technical baseline](planning/context/technical/TECHNICAL.md), [task graph](planning/roadmap/tasks.md), and [bootstrap](planning/bootstrap.md). T003 proves two distinct compositions in one unchanged build; T004 validates the independent skill; T005 evaluates real-source knowledge. Demo tests establish none of those later outcomes.
