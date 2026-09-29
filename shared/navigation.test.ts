import { expect, it } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { navigationFeature, navigationSeed } from '../fixtures/navigation.js'
import { seed } from '../fixtures/booking.js'
import { approvalFeature } from '../fixtures/approval.js'
import { featureSchema } from './contracts.js'
import { Store } from '../server/store.js'

it('accepts authored navigation cases and rejects unsupported or mixed data', () => {
  expect(featureSchema.safeParse(navigationFeature).success).toBe(true)
  for (const invalid of [
    { ...navigationFeature, noticeHours: 24 },
    { ...navigationFeature, scene: { kind: 'navigation', version: 2 } },
    {
      ...navigationFeature,
      cases: [{ ...navigationFeature.cases[0], href: '/unsafe' }],
    },
    {
      ...navigationFeature,
      cases: [{ ...navigationFeature.cases[0], outcome: 'guessed' }],
    },
  ])
    expect(featureSchema.safeParse(invalid).success).toBe(false)
})

it('persists current navigation while preserving other scenes and rolling back invalid writes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-navigation-'))
  let store = new Store(dir)
  try {
    store.create({
      ...navigationSeed,
      features: [...navigationSeed.features, ...seed.features, approvalFeature],
    })
    const update = {
      contractVersion: 1,
      expectedRevision: 1,
      upsertFeatures: [
        {
          ...navigationFeature,
          cases: [
            { ...navigationFeature.cases[0], result: 'Updated destination' },
          ],
        },
      ],
    }
    store.apply(navigationSeed.id, update)
    expect(() => store.apply(navigationSeed.id, update)).toThrow()
    expect(() =>
      store.apply(navigationSeed.id, {
        ...update,
        expectedRevision: 2,
        upsertFeatures: [
          {
            ...navigationFeature,
            cases: [navigationFeature.cases[0], navigationFeature.cases[0]],
          },
        ],
      }),
    ).toThrow()
    store.close()
    store = new Store(dir)
    const current = store.read(navigationSeed.id)
    expect(current.revision).toBe(2)
    for (const untouched of [...seed.features, approvalFeature])
      expect(current.features.find((f) => f.id === untouched.id)).toEqual(
        untouched,
      )
    expect(
      current.features.find((f) => f.id === navigationFeature.id)!.cases[0],
    ).toMatchObject({ result: 'Updated destination' })
  } finally {
    store.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
