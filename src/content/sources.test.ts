import { expect, it } from 'vitest'
import { authoredSeed } from '../../fixtures/authored'
import { documentSchema } from '../../shared/contracts'
import { projectSources } from './sources'

const project = documentSchema.parse({
  ...authoredSeed,
  revision: 1,
  assets: [],
})

it('keeps each saved source once with explicit claim attribution across the project', () => {
  const rows = projectSources(project)
  expect(rows.map((row) => row.evidence.id)).toEqual([
    'source',
    'unverified',
    'disagreement',
  ])
  expect(rows[0].claims).toEqual(
    expect.arrayContaining([
      'Project purpose',
      'Area: Dispatch',
      'Actor: Courier',
      'Rule: Checklist complete',
      'Activity: Hand off a parcel',
      'Step: Hand off a parcel — Receive the parcel',
      'Case: Hand off a parcel — Complete handoff',
      'Journey: Parcel handoff',
      'Term: Checklist',
    ]),
  )
  expect(rows[1].claims).toEqual([
    'Case: Hand off a parcel — Unverified handoff',
  ])
  expect(rows[2].claims).toEqual([
    'Case: Hand off a parcel — Conflicting handoff',
  ])
})

it('does not infer citations from text or carry sources into another project', () => {
  const empty = documentSchema.parse({
    contractVersion: 2,
    id: 'other',
    title: 'Other',
    revision: 1,
    assets: [],
    features: [],
    relations: [],
  })
  expect(projectSources(empty)).toEqual([])
  const sparse = {
    ...project,
    purpose: undefined,
    actors: [],
    rules: [],
    areas: [],
    journeys: [],
    glossary: [],
    relations: [],
    features: [],
  }
  expect(projectSources(sparse).every((row) => row.claims.length === 0)).toBe(
    true,
  )
})
