import Database from 'better-sqlite3'
import {
  mkdirSync,
  readFileSync,
  openSync,
  closeSync,
  unlinkSync,
} from 'node:fs'
import { resolve, join } from 'node:path'
import {
  createSchema,
  updateSchema,
  validateDocument,
  uniqueIds,
  type ProjectDocument,
  type Feature,
  type Asset,
} from '../shared/contracts.js'
export class DataError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
  }
}
export const SCHEMA_VERSION = 2
export class Store {
  readonly db!: Database.Database
  private lock: number | undefined
  private closed = false
  constructor(
    readonly dir: string,
    migrate = true,
  ) {
    mkdirSync(dir, { recursive: true, mode: 0o700 })
    try {
      this.lock = openSync(join(dir, '.lock'), 'wx', 0o600)
    } catch {
      throw new Error(
        'Storage is in use. Stop Atlas before maintenance; remove a stale .lock only after verifying no process uses this storage.',
      )
    }
    try {
      this.db = new Database(join(dir, 'atlas.sqlite'))
      this.db.pragma('foreign_keys = ON')
      this.db.pragma('busy_timeout = 3000')
      const version = this.db.pragma('user_version', { simple: true }) as number
      if (version > SCHEMA_VERSION)
        throw new Error(
          'Incompatible database schema; use a compatible Atlas version or restore a backup',
        )
      if (migrate)
        this.db.transaction(() => {
          for (let n = version + 1; n <= SCHEMA_VERSION; n++) {
            const file = n === 1 ? '001-initial.sql' : '002-history.sql'
            this.db.exec(readFileSync(resolve('migrations', file), 'utf8'))
            this.db.pragma(`user_version = ${n}`)
          }
          if (version === 1)
            for (const id of this.projectIds()) this.snapshot(this.read(id))
        })()
    } catch (error) {
      this.db?.close()
      this.release()
      throw error
    }
  }
  private release() {
    if (this.lock !== undefined) {
      closeSync(this.lock)
      unlinkSync(join(this.dir, '.lock'))
      this.lock = undefined
    }
  }
  close() {
    if (!this.closed) {
      this.db.close()
      this.release()
      this.closed = true
    }
  }
  onApplicationShutdown() {
    this.close()
  }
  ready() {
    return (
      this.db.open &&
      this.db.pragma('user_version', { simple: true }) === SCHEMA_VERSION &&
      this.db.pragma('foreign_keys', { simple: true }) === 1 &&
      this.db.prepare('SELECT count(*) FROM projects').get() !== undefined
    )
  }
  projectIds(): string[] {
    return (
      this.db.prepare('SELECT id FROM projects ORDER BY id').all() as {
        id: string
      }[]
    ).map((p) => p.id)
  }
  list(after = '') {
    return this.db
      .prepare(
        'SELECT id,title,revision FROM projects WHERE id > ? ORDER BY id LIMIT 100',
      )
      .all(after) as { id: string; title: string; revision: number }[]
  }
  read(id: string): ProjectDocument {
    const p = this.db.prepare('SELECT * FROM projects WHERE id=?').get(id) as
      { id: string; title: string; revision: number } | undefined
    if (!p) throw new DataError(404, 'not_found', 'Project unavailable')
    const features = (
      this.db
        .prepare('SELECT data FROM features WHERE project_id=? ORDER BY id')
        .all(id) as { data: string }[]
    ).map((r) => JSON.parse(r.data) as Feature)
    const relations = this.db
      .prepare(
        'SELECT id,source_id AS "from",target_id AS "to",kind FROM relations WHERE project_id=? ORDER BY id',
      )
      .all(id)
    const assets = this.db
      .prepare(
        'SELECT id,media_type AS mediaType,provenance FROM assets WHERE project_id=? ORDER BY id',
      )
      .all(id)
    return validateDocument({
      contractVersion: 1,
      ...p,
      features,
      relations,
      assets,
    })
  }
  history(id: string): ProjectDocument[] {
    this.read(id)
    return (
      this.db
        .prepare(
          'SELECT snapshot FROM history WHERE project_id=? ORDER BY revision',
        )
        .all(id) as { snapshot: string }[]
    ).map((r) => validateDocument(JSON.parse(r.snapshot)))
  }
  private snapshot(doc: ProjectDocument) {
    this.db
      .prepare('INSERT INTO history VALUES (?,?,?)')
      .run(doc.id, doc.revision, JSON.stringify(doc))
  }
  private save(doc: ProjectDocument) {
    this.db.prepare('DELETE FROM relations WHERE project_id=?').run(doc.id)
    this.db.prepare('DELETE FROM features WHERE project_id=?').run(doc.id)
    for (const f of doc.features) {
      this.db
        .prepare('INSERT INTO features VALUES (?,?,?)')
        .run(doc.id, f.id, JSON.stringify(f))
      for (const c of f.cases)
        this.db
          .prepare('INSERT INTO cases VALUES (?,?,?,?)')
          .run(doc.id, f.id, c.id, JSON.stringify(c))
      for (const a of f.assetIds)
        this.db
          .prepare('INSERT INTO feature_assets VALUES (?,?,?)')
          .run(doc.id, f.id, a)
    }
    for (const r of doc.relations)
      this.db
        .prepare('INSERT INTO relations VALUES (?,?,?,?,?)')
        .run(doc.id, r.id, r.from, r.to, r.kind)
    this.db
      .prepare('UPDATE projects SET title=?,revision=? WHERE id=?')
      .run(doc.title, doc.revision, doc.id)
    this.snapshot(doc)
  }
  create(input: unknown) {
    const data = createSchema.parse(input)
    return this.db
      .transaction(() => {
        if (this.db.prepare('SELECT id FROM projects WHERE id=?').get(data.id))
          throw new DataError(409, 'conflict', 'Project already exists')
        const doc = validateDocument({ ...data, revision: 1, assets: [] })
        this.db
          .prepare('INSERT INTO projects VALUES (?,?,?)')
          .run(doc.id, doc.title, 1)
        this.save(doc)
        return this.read(doc.id)
      })
      .immediate()
  }
  apply(id: string, input: unknown) {
    const data = updateSchema.parse(input)
    return this.db
      .transaction(() => {
        const doc = this.read(id)
        this.checkRevision(doc, data.expectedRevision)
        const merge = <T extends { id: string }>(
          old: T[],
          added: T[] = [],
          removed: string[] = [],
        ) => {
          uniqueIds(added)
          if (
            new Set(removed).size !== removed.length ||
            added.some((i) => removed.includes(i.id)) ||
            removed.some((id) => !old.some((i) => i.id === id))
          )
            throw new Error('Invalid or ambiguous removal')
          return [
            ...old.filter(
              (i) =>
                !removed.includes(i.id) && !added.some((a) => a.id === i.id),
            ),
            ...added,
          ].sort((a, b) => a.id.localeCompare(b.id))
        }
        const next = validateDocument({
          ...doc,
          title: data.title ?? doc.title,
          revision: doc.revision + 1,
          features: merge(
            doc.features,
            data.upsertFeatures,
            data.removeFeatureIds,
          ),
          relations: merge(
            doc.relations,
            data.upsertRelations,
            data.removeRelationIds,
          ),
        })
        this.save(next)
        return this.read(id)
      })
      .immediate()
  }
  checkRevision(doc: ProjectDocument, expected: number) {
    if (doc.revision !== expected)
      throw new DataError(
        409,
        'revision_conflict',
        'Read the current revision before applying changes',
      )
  }
  register(id: string, expected: number, asset: Asset, key: string) {
    return this.db
      .transaction(() => {
        const doc = this.read(id)
        this.checkRevision(doc, expected)
        if (doc.assets.some((a) => a.id === asset.id))
          throw new DataError(
            409,
            'conflict',
            'Asset ID is immutable; register a new ID',
          )
        const next = validateDocument({
          ...doc,
          revision: doc.revision + 1,
          assets: [...doc.assets, asset],
        })
        this.db
          .prepare('INSERT INTO assets VALUES (?,?,?,?,?)')
          .run(id, asset.id, key, asset.mediaType, asset.provenance)
        this.save(next)
        return this.read(id)
      })
      .immediate()
  }
  asset(id: string, assetId: string) {
    const row = this.db
      .prepare(
        'SELECT storage_key AS key,media_type AS mediaType FROM assets WHERE project_id=? AND id=?',
      )
      .get(id, assetId) as { key: string; mediaType: string } | undefined
    if (!row) throw new DataError(404, 'not_found', 'Asset unavailable')
    return row
  }
}
