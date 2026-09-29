import { expect, it } from 'vitest'
import { featureSchema } from './contracts.js'
import { navigationFeature } from '../fixtures/navigation.js'
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
