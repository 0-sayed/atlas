import { expect, it } from 'vitest'
import { authoredSeed } from '../fixtures/authored'
import { validateDocument } from './contracts'
import { searchFeatures, featureGroup } from './exploration'
it('finds explicit participants, conditions and steps without inventing domain labels', () => {
  const project = validateDocument({ ...authoredSeed, revision: 1, assets: [] })
  for (const query of [
    'courier',
    'checklist entries',
    'prepare parcel',
    'handoff stopped',
  ])
    expect(searchFeatures(project, query).map((f) => f.id)).toEqual(['handoff'])
  expect(searchFeatures(project, 'foreign')).toEqual([])
  expect(
    featureGroup(project, { ...project.features[0], group: 'Old group' }),
  ).toBe('Dispatch')
  expect(
    featureGroup(project, {
      ...project.features[0],
      areaId: undefined,
      group: undefined,
    }),
  ).toBe('Activities')
})
