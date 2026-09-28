import { expect, it } from 'vitest'
import { featureSchema, type ProjectDocument } from './contracts.js'
import { featureChanges } from './changes.js'
import { navigationFeature, navigationSeed } from '../fixtures/navigation.js'
import { seed } from '../fixtures/booking.js'
import { approvalFeature } from '../fixtures/approval.js'

it('accepts optional reviewed artwork choices across existing scene kinds', () => {
  for (const feature of [
    navigationFeature,
    seed.features[0],
    approvalFeature,
  ]) {
    expect(featureSchema.parse(feature)).toEqual(feature)
    expect(
      featureSchema.parse({
        ...feature,
        presentation: { illustration: 'parcel', accent: 'peach' },
      }),
    ).toMatchObject({
      presentation: { illustration: 'parcel', accent: 'peach' },
    })
  }
})

it('rejects arbitrary visual code, incomplete settings, and unknown choices', () => {
  for (const presentation of [
    { illustration: 'script', accent: 'sky' },
    { illustration: 'calendar', accent: 'red' },
    { illustration: 'calendar' },
    { illustration: 'calendar', accent: 'sky', html: '<script />' },
  ])
    expect(
      featureSchema.safeParse({ ...navigationFeature, presentation }).success,
    ).toBe(false)
})

it('does not describe an artwork-only update as a product behavior change', () => {
  const before: ProjectDocument = {
    ...navigationSeed,
    revision: 1,
    assets: [],
  }
  const changed = featureSchema.parse({
    ...navigationFeature,
    presentation: { illustration: 'people', accent: 'sage' },
  })
  const after = { ...before, revision: 2, features: [changed] }
  expect(featureChanges(before, after)).toEqual([])
  expect(
    featureChanges(before, {
      ...after,
      features: [{ ...changed, title: 'Choose a different destination' }],
    }),
  ).toMatchObject([{ kind: 'changed' }])
})
