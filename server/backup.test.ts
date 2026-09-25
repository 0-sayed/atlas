import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
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
    expect(store.history(seed.id)).toHaveLength(2)
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
  old.exec('DROP TABLE history; PRAGMA user_version = 1')
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
    await expect(restore(archive, join(root, 'restored'))).rejects.toThrow()
  } finally {
    store.close()
    rmSync(root, { recursive: true, force: true })
  }
})
