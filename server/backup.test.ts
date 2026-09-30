import {
  mkdtempSync,
  rmSync,
  writeFileSync,
  mkdirSync,
  readFileSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Database from 'better-sqlite3'
import { expect, it } from 'vitest'
import { Store } from './store.js'
import { backup, restore } from './backup.js'
import { seed } from '../fixtures/booking.js'
import { navigationSeed } from '../fixtures/navigation.js'
it('upgrades, reads, reduces and restores a formerly supported legacy project above 8 MiB', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-large-schema3-'))
  const dir = join(root, 'live')
  mkdirSync(dir)
  const db = new Database(join(dir, 'atlas.sqlite'))
  for (const name of ['001-initial.sql', '002-history.sql', '003-current.sql'])
    db.exec(readFileSync(join('migrations', name), 'utf8'))
  db.pragma('user_version = 3')
  db.prepare('INSERT INTO projects VALUES (?,?,?)').run(
    'large-legacy',
    'Large legacy',
    10,
  )
  const features = Array.from({ length: 100 }, (_, i) => ({
    ...navigationSeed.features[0],
    id: `legacy-${i}`,
    purpose: 'x'.repeat(4000),
    evidence: {
      ...navigationSeed.features[0].evidence,
      source: 'x'.repeat(4000),
      scope: 'x'.repeat(4000),
      description: 'x'.repeat(4000),
    },
    rules: Array.from({ length: 20 }, () => 'x'.repeat(4000)),
    cases: [],
  }))
  for (const feature of features)
    db.prepare('INSERT INTO features VALUES (?,?,?)').run(
      'large-legacy',
      feature.id,
      JSON.stringify(feature),
    )
  db.close()
  let store: Store | undefined
  let restored: Store | undefined
  try {
    expect(Buffer.byteLength(JSON.stringify({ features }))).toBeGreaterThan(
      8 * 1024 * 1024,
    )
    // Each historical batch fits the original 2 MiB API bound.
    expect(
      Buffer.byteLength(
        JSON.stringify({
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: features.slice(0, 10),
        }),
      ),
    ).toBeLessThan(2 * 1024 * 1024)
    store = new Store(dir)
    const before = store.read('large-legacy')
    expect(before.revision).toBe(10)
    expect(before.features).toHaveLength(100)
    expect(() =>
      store!.apply('large-legacy', {
        contractVersion: 2,
        expectedRevision: 10,
        upsertAreas: [
          { id: 'new-area', title: 'New area', evidenceIds: ['new-evidence'] },
        ],
        upsertEvidenceRecords: [
          {
            id: 'new-evidence',
            status: 'demo',
            source: 'Test',
            sourceRevision: 'test-v1',
            scope: 'Synthetic test',
            description: 'Synthetic only',
          },
        ],
      }),
    ).toThrow(/8 MiB/)
    expect(store.read('large-legacy')).toEqual(before)
    store.close()
    await backup(dir, join(root, 'backup'))
    await restore(join(root, 'backup'), join(root, 'restored'))
    restored = new Store(join(root, 'restored'))
    expect(restored.read('large-legacy')).toEqual(before)
    expect(
      restored.apply('large-legacy', {
        contractVersion: 1,
        expectedRevision: 10,
        removeFeatureIds: features.slice(50).map((f) => f.id),
      }).features,
    ).toHaveLength(50)
  } finally {
    store?.close()
    restored?.close()
    rmSync(root, { recursive: true, force: true })
  }
})
it('backs up and restores genuine nonempty schema-3 facts, assets and revisions', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-schema3-'))
  const dir = join(root, 'live')
  mkdirSync(dir)
  mkdirSync(join(dir, 'assets'))
  writeFileSync(join(dir, 'assets', 'pixel.png'), 'pixel')
  const db = new Database(join(dir, 'atlas.sqlite'))
  db.pragma('foreign_keys = ON')
  for (const name of ['001-initial.sql', '002-history.sql', '003-current.sql'])
    db.exec(readFileSync(join('migrations', name), 'utf8'))
  db.pragma('user_version = 3')
  db.prepare('INSERT INTO projects VALUES (?,?,?)').run(seed.id, seed.title, 7)
  db.prepare('INSERT INTO assets VALUES (?,?,?,?,?)').run(
    seed.id,
    'pixel',
    'pixel.png',
    'image/png',
    'Test asset',
  )
  const feature = { ...seed.features[0], assetIds: ['pixel'] }
  db.prepare('INSERT INTO features VALUES (?,?,?)').run(
    seed.id,
    feature.id,
    JSON.stringify(feature),
  )
  db.prepare('INSERT INTO feature_assets VALUES (?,?,?)').run(
    seed.id,
    feature.id,
    'pixel',
  )
  db.prepare('INSERT INTO relations VALUES (?,?,?,?,?)').run(
    seed.id,
    'self',
    feature.id,
    feature.id,
    'related',
  )
  db.close()
  let restored: Store | undefined
  try {
    await backup(dir, join(root, 'backup'))
    const original = new Database(join(dir, 'atlas.sqlite'))
    expect(original.pragma('user_version', { simple: true })).toBe(3)
    original.close()
    await restore(join(root, 'backup'), join(root, 'restored'))
    restored = new Store(join(root, 'restored'))
    expect(restored.read(seed.id)).toMatchObject({
      revision: 7,
      features: [feature],
      relations: [{ id: 'self', kind: 'related' }],
      assets: [{ id: 'pixel' }],
    })
    expect(
      readFileSync(join(root, 'restored', 'assets', 'pixel.png'), 'utf8'),
    ).toBe('pixel')
  } finally {
    restored?.close()
    rmSync(root, { recursive: true, force: true })
  }
})
it('backs up and restores database plus assets; refuses active storage and overwrite', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-backup-'))
  const dir = join(root, 'live')
  const archive = join(root, 'backup')
  const target = join(root, 'restore')
  let store = new Store(dir)
  try {
    store.create(seed)
    mkdirSync(join(dir, 'assets'))
    writeFileSync(join(dir, 'assets', 'pixel.png'), 'pixel')
    store.register(
      seed.id,
      1,
      { id: 'pixel', mediaType: 'image/png', provenance: 'test' },
      'pixel.png',
    )
    await expect(backup(dir, archive)).rejects.toThrow(/in use/)
    store.close()
    await backup(dir, archive)
    await restore(archive, target)
    store = new Store(target)
    expect(store.read(seed.id).revision).toBe(2)
    expect(store.read(seed.id).assets).toHaveLength(1)
    const { readFileSync } = await import('node:fs')
    expect(readFileSync(join(target, 'assets', 'pixel.png'), 'utf8')).toBe(
      'pixel',
    )
    await expect(restore(archive, target)).rejects.toThrow()
  } finally {
    store.close()
    rmSync(root, { recursive: true, force: true })
  }
})
it('backs up an earlier schema before upgrading it', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-upgrade-backup-'))
  const dir = join(root, 'live')
  const archive = join(root, 'backup')
  const store = new Store(dir)
  store.create(seed)
  store.close()
  const { default: Database } = await import('better-sqlite3')
  const old = new Database(join(dir, 'atlas.sqlite'))
  old.exec(
    'DROP TABLE knowledge_records; ALTER TABLE projects DROP COLUMN purpose; ALTER TABLE relations DROP COLUMN evidence_ids;',
  )
  old.pragma('user_version = 1')
  old.close()
  try {
    await backup(dir, archive)
    const original = new Database(join(dir, 'atlas.sqlite'))
    expect(original.pragma('user_version', { simple: true })).toBe(1)
    original.close()
    const copy = new Database(join(archive, 'atlas.sqlite'))
    expect(copy.pragma('user_version', { simple: true })).toBe(1)
    copy.close()
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
it('upgrades and restores nonempty v2 knowledge without changing its current revision', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-v2-upgrade-'))
  const dir = join(root, 'live')
  const archive = join(root, 'backup')
  const target = join(root, 'restored')
  let store = new Store(dir)
  try {
    store.create({
      ...seed,
      features: [...seed.features, { ...seed.features[0], id: 'other' }],
    })
    store.apply(seed.id, {
      contractVersion: 1,
      expectedRevision: 1,
      upsertRelations: [
        {
          id: 'requires-other',
          from: 'booking',
          to: 'other',
          kind: 'requires',
        },
      ],
    })
    mkdirSync(join(dir, 'assets'))
    writeFileSync(join(dir, 'assets', 'pixel.png'), 'pixel')
    store.register(
      seed.id,
      2,
      { id: 'pixel', mediaType: 'image/png', provenance: 'test' },
      'pixel.png',
    )
    store.apply(seed.id, {
      contractVersion: 1,
      expectedRevision: 3,
      upsertFeatures: [{ ...seed.features[0], assetIds: ['pixel'] }],
    })
    const current = store.read(seed.id)
    store.close()
    const old = new Database(join(dir, 'atlas.sqlite'))
    old.exec(
      'DROP TABLE knowledge_records; ALTER TABLE projects DROP COLUMN purpose; ALTER TABLE relations DROP COLUMN evidence_ids;',
    )
    old.exec(readFileSync('migrations/002-history.sql', 'utf8'))
    old.pragma('user_version = 2')
    const row = old
      .prepare('SELECT data FROM features WHERE project_id=? AND id=?')
      .get(seed.id, 'booking') as { data: string }
    old.prepare('UPDATE features SET data=? WHERE project_id=? AND id=?').run(
      JSON.stringify({
        ...JSON.parse(row.data),
        comparison: {
          title: 'Old comparison',
          hours: 36,
          beforeNoticeHours: 48,
          beforeRevision: 'Earlier',
        },
      }),
      seed.id,
      'booking',
    )
    old.close()
    await backup(dir, archive)
    const archived = new Database(join(archive, 'atlas.sqlite'))
    expect(archived.pragma('user_version', { simple: true })).toBe(2)
    archived.close()
    await restore(archive, target)
    store = new Store(target)
    expect(store.read(seed.id)).toEqual(current)
    expect(store.db.pragma('user_version', { simple: true })).toBe(4)
    expect(
      store.db
        .prepare("SELECT name FROM sqlite_master WHERE name='history'")
        .get(),
    ).toBeUndefined()
    expect(readFileSync(join(target, 'assets', 'pixel.png'), 'utf8')).toBe(
      'pixel',
    )
    expect(() =>
      store.apply(seed.id, {
        contractVersion: 1,
        expectedRevision: 3,
        title: 'Stale edit',
      }),
    ).toThrow(/current revision/)
    expect(store.read(seed.id)).toEqual(current)
    expect(
      store.apply(seed.id, {
        contractVersion: 1,
        expectedRevision: 4,
        title: 'Current edit',
      }).revision,
    ).toBe(5)
  } finally {
    store.close()
    rmSync(root, { recursive: true, force: true })
  }
})
it('rejects corrupt knowledge beyond the first public page during restore', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-many-restore-'))
  const dir = join(root, 'live')
  const archive = join(root, 'backup')
  const store = new Store(dir)
  try {
    for (let n = 0; n < 101; n++)
      store.create({ ...seed, id: `p-${String(n).padStart(3, '0')}` })
    store.close()
    await backup(dir, archive)
    const { default: Database } = await import('better-sqlite3')
    const db = new Database(join(archive, 'atlas.sqlite'))
    db.prepare('UPDATE features SET data=? WHERE project_id=?').run(
      '{}',
      'p-100',
    )
    db.close()
    // Keep the checksum consistent to exercise semantic validation, not hashing.
    writeFileSync(
      join(archive, 'manifest.json'),
      JSON.stringify({
        version: 1,
        databaseSha256: createHash('sha256')
          .update(readFileSync(join(archive, 'atlas.sqlite')))
          .digest('hex'),
      }),
    )
    await expect(restore(archive, join(root, 'restored'))).rejects.toThrow()
  } finally {
    store.close()
    rmSync(root, { recursive: true, force: true })
  }
})
it('rejects a backup with invalid current knowledge even when SQLite integrity passes', async () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-invalid-backup-'))
  const dir = join(root, 'live')
  const archive = join(root, 'backup')
  const store = new Store(dir)
  try {
    store.create(seed)
    store.close()
    await backup(dir, archive)
    const { default: Database } = await import('better-sqlite3')
    const db = new Database(join(archive, 'atlas.sqlite'))
    db.prepare('UPDATE features SET data=?').run('{}')
    expect(db.pragma('integrity_check', { simple: true })).toBe('ok')
    db.close()
    writeFileSync(
      join(archive, 'manifest.json'),
      JSON.stringify({
        version: 1,
        databaseSha256: createHash('sha256')
          .update(readFileSync(join(archive, 'atlas.sqlite')))
          .digest('hex'),
      }),
    )
    await expect(restore(archive, join(root, 'restored'))).rejects.toThrow()
  } finally {
    store.close()
    rmSync(root, { recursive: true, force: true })
  }
})
