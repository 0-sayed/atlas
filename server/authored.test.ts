import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it } from 'vitest'
import request from 'supertest'
import { Store } from './store.js'
import { createApp } from './app.js'
import { backup, restore } from './backup.js'
import { authoredFeature, authoredSeed } from '../fixtures/authored.js'
import { seed } from '../fixtures/booking.js'
import { capabilities } from '../shared/capabilities.js'

let dir: string
let store: Store
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'atlas-authored-'))
  store = new Store(join(dir, 'live'))
})
afterEach(() => {
  store.close()
  rmSync(dir, { recursive: true, force: true })
})

it('persists all authored facts, assets and typed relationships across backup and restart', async () => {
  store.create({
    ...authoredSeed,
    features: [...authoredSeed.features, { ...seed.features[0], id: 'next' }],
    relations: [
      {
        id: 'triggers-next',
        from: 'handoff',
        to: 'next',
        kind: 'triggers',
        evidenceIds: ['source'],
      },
    ],
  })
  store.register(
    authoredSeed.id,
    1,
    { id: 'image', mediaType: 'image/png', provenance: 'Test' },
    'image.png',
  )
  const { mkdirSync, writeFileSync } = await import('node:fs')
  mkdirSync(join(dir, 'live', 'assets'))
  writeFileSync(join(dir, 'live', 'assets', 'image.png'), 'pixel')
  store.apply(authoredSeed.id, {
    contractVersion: 2,
    expectedRevision: 2,
    upsertFeatures: [{ ...authoredFeature, assetIds: ['image'] }],
  })
  const current = store.read(authoredSeed.id)
  expect(current).toMatchObject({
    ...authoredSeed,
    actors: expect.arrayContaining(authoredSeed.actors),
    evidenceRecords: expect.arrayContaining(authoredSeed.evidenceRecords),
    relations: [{ id: 'triggers-next', kind: 'triggers' }],
    features: [
      { ...authoredFeature, assetIds: ['image'] },
      { ...seed.features[0], id: 'next' },
    ],
    revision: 3,
  })
  store.close()
  await backup(join(dir, 'live'), join(dir, 'backup'))
  await restore(join(dir, 'backup'), join(dir, 'restored'))
  store = new Store(join(dir, 'restored'))
  expect(store.read(authoredSeed.id)).toEqual(current)
  expect(store.db.pragma('foreign_key_check')).toEqual([])
})
it('preserves omitted facts through small v1/v2 updates and allows atomic removals', () => {
  const initial = store.create(authoredSeed)
  store.apply(authoredSeed.id, {
    contractVersion: 1,
    expectedRevision: 1,
    title: 'Legacy title edit',
  })
  const after = store.apply(authoredSeed.id, {
    contractVersion: 2,
    expectedRevision: 2,
    upsertRules: [
      { ...authoredSeed.rules[0], statement: 'A corrected precise condition.' },
    ],
  })
  expect(after.actors).toEqual(initial.actors)
  expect(after.evidenceRecords).toEqual(initial.evidenceRecords)
  expect(after.features).toEqual(initial.features)
  expect(after.rules[0].statement).toBe('A corrected precise condition.')
  expect(
    store.apply(authoredSeed.id, {
      contractVersion: 2,
      expectedRevision: 3,
      purpose: null,
      removeFeatureIds: ['handoff'],
      removeJourneyIds: ['delivery'],
      removeGlossaryIds: ['checklist'],
      removeRuleIds: ['complete'],
      removeActorIds: ['dispatcher', 'courier'],
      removeAreaIds: ['dispatch'],
      removeEvidenceRecordIds: ['source', 'unverified', 'disagreement'],
    }),
  ).toMatchObject({
    revision: 4,
    features: [],
    actors: [],
    rules: [],
    evidenceRecords: [],
  })
  expect(store.read(authoredSeed.id).purpose).toBeUndefined()
})
it('rejects stale, dangling, duplicate and ambiguous batches without partial changes', () => {
  store.create(authoredSeed)
  const before = store.read(authoredSeed.id)
  const edits = [
    { expectedRevision: 0, title: 'stale' },
    { removeRuleIds: ['complete'] },
    { removeActorIds: ['courier'] },
    { removeEvidenceRecordIds: ['source'] },
    { removeFeatureIds: ['handoff'] },
    { upsertActors: [authoredSeed.actors[0], authoredSeed.actors[0]] },
    { upsertActors: [authoredSeed.actors[0]], removeActorIds: ['dispatcher'] },
    { removeActorIds: ['foreign'] },
    { removeActorIds: ['courier', 'courier'] },
    {
      upsertRelations: [
        { id: 'uncited', from: 'handoff', to: 'handoff', kind: 'blocks' },
      ],
    },
    {
      upsertFeatures: [
        { ...authoredFeature, scene: { kind: 'authored', version: 9 } },
      ],
    },
  ]
  for (const edit of edits) {
    expect(() =>
      store.apply(authoredSeed.id, {
        contractVersion: 2,
        expectedRevision: 1,
        title: 'Should roll back',
        ...edit,
      }),
    ).toThrow()
    expect(store.read(authoredSeed.id)).toEqual(before)
  }
})
it('does not resolve foreign knowledge IDs from another project', () => {
  store.create(authoredSeed)
  store.create({ ...seed, id: 'other' })
  const before = store.read('other')
  expect(() =>
    store.apply('other', {
      contractVersion: 2,
      expectedRevision: 1,
      upsertFeatures: [authoredFeature],
    }),
  ).toThrow(/reference/)
  expect(store.read('other')).toEqual(before)
})
it('advertises actual read-only capabilities and rejects bad requests before writes', async () => {
  store.close()
  const token = 'isolated-authored-test-token-32-chars'
  const app = await createApp({
    dir: join(dir, 'live'),
    port: 4317,
    frontendPort: 5173,
    token,
  })
  const api = request(app.getHttpServer())
  const post = (path: string, body: object) =>
    api
      .post(`/api/v1${path}`)
      .set('Host', '127.0.0.1:4317')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
  try {
    const response = await api
      .get('/api/v1/capabilities')
      .set('Host', '127.0.0.1:4317')
      .expect(200)
    expect(response.body).toEqual(capabilities)
    await api
      .get('/api/v1/capabilities')
      .set('Host', 'foreign.test')
      .expect(403)
    const saved = await post('/projects', authoredSeed).expect(201)
    expect(saved.body.rules).toEqual(authoredSeed.rules)
    await post(`/projects/${authoredSeed.id}/changes`, {
      contractVersion: 99,
      expectedRevision: 1,
      title: 'invalid',
    }).expect(400)
    await post(`/projects/${authoredSeed.id}/changes`, {
      contractVersion: 2,
      expectedRevision: 1,
      removeRuleIds: ['complete'],
    }).expect(400)
    await post(`/projects/${authoredSeed.id}/changes`, {
      contractVersion: 2,
      expectedRevision: 0,
      title: 'stale',
    }).expect(409)
    const current = await api
      .get(`/api/v1/projects/${authoredSeed.id}`)
      .set('Host', '127.0.0.1:4317')
      .expect(200)
    expect(current.body).toEqual(saved.body)
  } finally {
    await app.close()
  }
})
