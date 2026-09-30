import { expect, it } from 'vitest'
import { authoredSeed } from '../../fixtures/authored'
import { documentSchema } from '../../shared/contracts'
import {
  actorParticipation,
  ruleContext,
  featureHref,
  featureReturn,
} from './destinations'

const project = documentSchema.parse({
  ...authoredSeed,
  revision: 1,
  assets: [],
})
it('uses explicit actor references rather than summary text', () => {
  expect(
    actorParticipation(project, 'courier')[0].steps.map((s) => s.id),
  ).toEqual(['receive'])
  expect(
    actorParticipation(
      { ...project, features: [{ ...project.features[0], actorIds: [] }] },
      'dispatcher',
    ),
  ).toEqual([])
  expect(actorParticipation(project, 'missing')).toEqual([])
})
it('exposes recorded rule conditions including unknown and conflicting cases', () => {
  const rows = ruleContext(project, 'complete')
  expect(rows).toHaveLength(1)
  expect(rows[0].cases.map((c) => c.conditions[0].state)).toEqual([
    'met',
    'not-met',
    'unknown',
    'conflicting',
  ])
  expect(rows[0].steps.map((s) => s.id)).toEqual(['prepare'])
})
it('returns to the same scoped map with filters and never propagates foreign case', () => {
  const params = new URLSearchParams(
    'q=parcel&group=dispatch&view=list&selected=handoff&case=foreign&item=complete',
  )
  const href = featureHref(project.id, 'handoff', 'map', params, 'ready')
  expect(href).toContain('case=ready')
  expect(href).not.toContain('foreign')
  const back = featureReturn(
    project.id,
    new URLSearchParams(href.split('?')[1]),
  )
  expect(back.label).toBe('Feature Map')
  expect(back.to).toBe(
    `/projects/${project.id}/map?q=parcel&group=dispatch&view=list&selected=handoff`,
  )
  expect(
    featureReturn(
      'other',
      new URLSearchParams('from=https://evil&group=dispatch'),
    ).to,
  ).toBe('/projects/other/explore')
})
it('preserves supporting-record selections on return', () => {
  expect(
    featureReturn(
      project.id,
      new URLSearchParams('from=rules&item=complete&q=check&case=ready'),
    ).to,
  ).toBe(`/projects/${project.id}/rules?q=check&item=complete`)
})
