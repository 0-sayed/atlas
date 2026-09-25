import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Database from 'better-sqlite3'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { Store } from './store.js'
import { seed } from '../fixtures/booking.js'

let dir: string
let store: Store
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'atlas-store-'))
  store = new Store(dir)
})
afterEach(() => {
  store?.close()
  rmSync(dir, { recursive: true, force: true })
})
it('persists create/update across restart and keeps immutable history', () => {
  store.create(seed)
  const changed = { ...seed.features[0], noticeHours: 30 }
  store.apply(seed.id, {
    contractVersion: 1,
    expectedRevision: 1,
    upsertFeatures: [changed],
  })
  store.close()
  store = new Store(dir)
  expect(store.read(seed.id).features[0].noticeHours).toBe(30)
  expect(store.read(seed.id).revision).toBe(2)
  expect(store.history(seed.id)[0].features[0].noticeHours).toBe(24)
})
it('rejects unknown fields, scene versions, duplicate ids and stale revisions', () => {
  expect(() => store.create({ ...seed, sql: 'DROP TABLE projects' })).toThrow()
  expect(() =>
    store.create({
      ...seed,
      features: [
        { ...seed.features[0], scene: { kind: 'script', version: 1 } },
      ],
    }),
  ).toThrow()
  expect(() =>
    store.create({ ...seed, features: [seed.features[0], seed.features[0]] }),
  ).toThrow()
  store.create(seed)
  expect(() =>
    store.apply(seed.id, { contractVersion: 1, expectedRevision: 0 }),
  ).toThrow()
  expect(store.read(seed.id).revision).toBe(1)
})
it('preserves omitted features and rolls back a batch with broken scoped references', () => {
  store.create({
    ...seed,
    features: [...seed.features, { ...seed.features[0], id: 'other' }],
  })
  store.create({
    ...seed,
    id: 'second',
    features: [{ ...seed.features[0], id: 'foreign' }],
  })
  store.apply(seed.id, {
    contractVersion: 1,
    expectedRevision: 1,
    upsertFeatures: [{ ...seed.features[0], noticeHours: 30 }],
  })
  expect(store.read(seed.id).features.map((f) => f.id)).toEqual([
    'booking',
    'other',
  ])
  const before = store.read(seed.id)
  expect(() =>
    store.apply(seed.id, {
      contractVersion: 1,
      expectedRevision: 2,
      upsertFeatures: [{ ...seed.features[0], noticeHours: 40 }],
      upsertRelations: [
        { id: 'bad', from: 'booking', to: 'foreign', kind: 'requires' },
      ],
    }),
  ).toThrow()
  expect(store.read(seed.id)).toEqual(before)
  expect(store.history(seed.id)).toHaveLength(2)
  expect(() =>
    store.apply(seed.id, {
      contractVersion: 1,
      expectedRevision: 2,
      upsertFeatures: [{ ...seed.features[0], assetIds: ['foreign-image'] }],
    }),
  ).toThrow()
})
it('enforces foreign keys and explicit removals', () => {
  store.create(seed)
  expect(store.db.pragma('foreign_keys', { simple: true })).toBe(1)
  expect(() =>
    store.db
      .prepare(
        'INSERT INTO cases(project_id, feature_id, id, data) VALUES (?, ?, ?, ?)',
      )
      .run('missing', 'booking', 'case', '{}'),
  ).toThrow()
  store.apply(seed.id, {
    contractVersion: 1,
    expectedRevision: 1,
    removeFeatureIds: ['booking'],
  })
  expect(store.read(seed.id).features).toEqual([])
})
it('upgrades a nonempty v1 database and rejects a future schema', () => {
  store.create(seed)
  store.close()
  const old = new Database(join(dir, 'atlas.sqlite'))
  old.exec('DROP TABLE history; PRAGMA user_version = 1;')
  old.close()
  store = new Store(dir)
  expect(store.read(seed.id).features).toEqual(seed.features)
  expect(store.history(seed.id)).toHaveLength(1)
  store.close()
  const future = new Database(join(dir, 'atlas.sqlite'))
  future.pragma('user_version = 99')
  future.close()
  expect(() => new Store(dir)).toThrow(/schema/i)
})
it('upgrades every project beyond a public page and paginates without loss', () => {
  for (let n = 0; n < 101; n++)
    store.create({ ...seed, id: `p-${String(n).padStart(3, '0')}` })
  store.close()
  const old = new Database(join(dir, 'atlas.sqlite'))
  old.exec('DROP TABLE history; PRAGMA user_version = 1')
  old.close()
  store = new Store(dir)
  expect(store.history('p-100')).toHaveLength(1)
  expect(store.list()).toHaveLength(100)
  expect(store.list('p-099').map((p) => p.id)).toEqual(['p-100'])
})
