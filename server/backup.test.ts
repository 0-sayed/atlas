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
    expect(store.db.pragma('user_version', { simple: true })).toBe(3)
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
