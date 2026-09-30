import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { Store } from './store.js'
import { authoredFeature, authoredSeed } from '../fixtures/authored.js'
import { seed } from '../fixtures/booking.js'
import { validateDocument } from '../shared/contracts.js'
import { searchFeatures } from '../shared/exploration.js'

it('measures coherent current-project transfer, read, validation and search with 160 authored features', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-capacity-'))
  const store = new Store(dir)
  try {
    const features = Array.from({ length: 160 }, (_, i) => ({
      ...authoredFeature,
      id: `feature-${String(i + 1).padStart(3, '0')}`,
      title: `Parcel activity ${i + 1}`,
    }))
    store.create({
      ...authoredSeed,
      features: features.slice(0, 100),
      journeys: [],
      glossary: [],
    })
    const doc = store.apply(authoredSeed.id, {
      contractVersion: 2,
      expectedRevision: 1,
      upsertFeatures: features.slice(100),
      upsertJourneys: [
        {
          ...authoredSeed.journeys[0],
          steps: [
            { featureId: 'feature-001', stepId: 'prepare' },
            { featureId: 'feature-160', stepId: 'receive' },
          ],
        },
      ],
      upsertRelations: features.slice(1).map((f, i) => ({
        id: `connection-${i}`,
        from: features[i].id,
        to: f.id,
        kind: 'triggers',
        evidenceIds: ['source'],
      })),
    })
    const json = JSON.stringify(doc)
    const bytes = Buffer.byteLength(json)
    const measure = (operation: () => unknown) => {
      const samples = Array.from({ length: 20 }, () => {
        const start = performance.now()
        operation()
        return performance.now() - start
      })
      return samples.sort((a, b) => a - b)[Math.ceil(samples.length * 0.95) - 1]
    }
    const readP95 = measure(() => store.read(authoredSeed.id))
    const validationP95 = measure(() => validateDocument(JSON.parse(json)))
    const searchP95 = measure(() => searchFeatures(doc, 'activity 160'))
    expect(doc.features).toHaveLength(160)
    expect(searchFeatures(doc, 'activity 160').map((f) => f.id)).toEqual([
      'feature-160',
    ])
    expect(bytes).toBeLessThanOrEqual(1024 * 1024)
    expect(readP95).toBeLessThanOrEqual(500)
    expect(validationP95).toBeLessThanOrEqual(500)
    expect(searchP95).toBeLessThanOrEqual(500)
    console.info(
      JSON.stringify({
        dataset: '160 synthetic authored activities / 159 typed relations',
        bytes,
        readP95,
        validationP95,
        searchP95,
      }),
    )
  } finally {
    store.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
it('accepts 500 total features in bounded batches and rejects 501 without loss', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-total-capacity-'))
  const store = new Store(dir)
  try {
    const features = Array.from({ length: 501 }, (_, i) => ({
      ...seed.features[0],
      id: `feature-${i}`,
    }))
    expect(() =>
      store.create({ ...seed, features: features.slice(0, 101) }),
    ).toThrow()
    store.create({ ...seed, features: features.slice(0, 100) })
    for (let i = 100; i < 500; i += 100)
      store.apply(seed.id, {
        contractVersion: 1,
        expectedRevision: i / 100,
        upsertFeatures: features.slice(i, i + 100),
      })
    const before = store.read(seed.id)
    expect(before.features).toHaveLength(500)
    expect(() =>
      store.apply(seed.id, {
        contractVersion: 2,
        expectedRevision: 5,
        upsertFeatures: [features[500]],
      }),
    ).toThrow()
    expect(store.read(seed.id)).toEqual(before)
    store.close()
    const restarted = new Store(dir)
    try {
      expect(restarted.read(seed.id)).toEqual(before)
    } finally {
      restarted.close()
    }
  } finally {
    store.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
it('rejects otherwise valid current documents above the 8 MiB transfer bound', () => {
  const feature = {
    ...authoredFeature,
    steps: Array.from({ length: 6 }, (_, i) => ({
      ...authoredFeature.steps[0],
      id: i === 0 ? 'prepare' : i === 1 ? 'receive' : `long-${i}`,
      description: 'x'.repeat(4000),
    })),
  }
  expect(() =>
    validateDocument({
      ...authoredSeed,
      features: Array.from({ length: 400 }, (_, i) => ({
        ...feature,
        id: `large-${i}`,
      })),
      revision: 1,
      assets: [],
      journeys: [],
      glossary: [],
    }),
  ).toThrow(/8 MiB/)
})
