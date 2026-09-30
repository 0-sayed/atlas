import { expect, it } from 'vitest'
import { createSchema, updateSchema, validateDocument } from './contracts'
import { authoredFeature, authoredSeed } from '../fixtures/authored'
import { seed } from '../fixtures/booking'
import { authoredView } from './authored'

const document = () => ({ ...authoredSeed, revision: 1, assets: [] })
it('round-trips explicit v2 facts and authored journey order', () => {
  expect(createSchema.parse(authoredSeed)).toEqual(authoredSeed)
  const doc = validateDocument(document())
  expect(doc).toEqual(document())
  expect(doc.journeys[0].steps.map((s) => s.stepId)).toEqual([
    'prepare',
    'receive',
  ])
})
it('normalizes old supported records without reinterpreting facts or revisions', () => {
  const old = { ...seed, revision: 7, assets: [] }
  expect(validateDocument(old)).toMatchObject({
    contractVersion: 2,
    revision: 7,
    features: seed.features,
    actors: [],
    rules: [],
    journeys: [],
  })
  expect(createSchema.parse(seed)).toEqual(seed)
})
it('rejects unsupported versions, executable fields and v2 facts in v1 writes', () => {
  for (const input of [
    { ...authoredSeed, contractVersion: 3 },
    {
      ...authoredSeed,
      features: [
        { ...authoredFeature, scene: { kind: 'authored', version: 2 } },
      ],
    },
    {
      ...authoredSeed,
      features: [
        {
          ...authoredFeature,
          steps: [{ ...authoredFeature.steps[0], html: '<script />' }],
        },
      ],
    },
    { ...authoredSeed, contractVersion: 1 },
  ])
    expect(() => createSchema.parse(input)).toThrow()
  expect(() =>
    updateSchema.parse({
      contractVersion: 1,
      expectedRevision: 1,
      upsertActors: authoredSeed.actors,
    }),
  ).toThrow()
})
it('rejects dangling project/feature/step/condition/evidence references and duplicate bindings', () => {
  const invalid = [
    { ...document(), rules: [] },
    { ...document(), actors: [] },
    { ...document(), evidenceRecords: [] },
    { ...document(), areas: [] },
    {
      ...document(),
      evidenceRecords: [
        ...authoredSeed.evidenceRecords,
        authoredSeed.evidenceRecords[0],
      ],
    },
    {
      ...document(),
      features: [{ ...authoredFeature, actorIds: ['courier', 'courier'] }],
    },
    {
      ...document(),
      features: [
        {
          ...authoredFeature,
          steps: [authoredFeature.steps[0], authoredFeature.steps[0]],
        },
      ],
    },
    {
      ...document(),
      features: [
        {
          ...authoredFeature,
          cases: [{ ...authoredFeature.cases[0], stepIds: ['foreign'] }],
        },
      ],
    },
    {
      ...document(),
      features: [
        {
          ...authoredFeature,
          cases: [
            {
              ...authoredFeature.cases[0],
              conditions: [{ ruleId: 'foreign', state: 'met' }],
            },
          ],
        },
      ],
    },
    {
      ...document(),
      journeys: [
        {
          ...authoredSeed.journeys[0],
          steps: [{ featureId: 'handoff', stepId: 'foreign' }],
        },
      ],
    },
    {
      ...document(),
      glossary: [{ ...authoredSeed.glossary[0], featureIds: ['foreign'] }],
    },
    { ...document(), purpose: { text: 'Purpose', evidenceIds: ['foreign'] } },
    {
      ...document(),
      features: [{ ...authoredFeature, assetIds: ['unregistered'] }],
    },
  ]
  for (const input of invalid)
    expect(() => validateDocument(input)).toThrow(/reference|Duplicate/)
})
it('separates bounded write batches from the 500-feature total capacity', () => {
  const features = Array.from({ length: 500 }, (_, i) => ({
    ...seed.features[0],
    id: `f-${i}`,
  }))
  expect(
    validateDocument({
      ...seed,
      contractVersion: 2,
      features,
      revision: 1,
      assets: [],
    }).features,
  ).toHaveLength(500)
  expect(() =>
    validateDocument({
      ...seed,
      contractVersion: 2,
      features: [...features, { ...seed.features[0], id: 'overflow' }],
      revision: 1,
      assets: [],
    }),
  ).toThrow()
  expect(() =>
    createSchema.parse({ ...seed, features: features.slice(0, 101) }),
  ).toThrow()
})
it('resolves selected recorded facts without calculating an outcome', () => {
  const doc = validateDocument(document())
  const contradictory = {
    ...authoredFeature,
    cases: [
      {
        ...authoredFeature.cases[0],
        conditions: [{ ruleId: 'complete', state: 'not-met' as const }],
      },
    ],
  }
  const view = authoredView(doc, contradictory, 'ready')
  expect(view.selected?.outcome.status).toBe('allowed')
  expect(view.conditions[0].rule.statement).toBe(
    authoredSeed.rules[0].statement,
  )
  expect(view.actors.map((a) => a.name)).toEqual(['Dispatcher', 'Courier'])
  expect(view.steps.map((s) => s.active)).toEqual([true, true])
  expect(authoredView(doc, authoredFeature, 'missing').selected).toBeUndefined()
  expect(
    authoredView(doc, { ...authoredFeature, cases: [] }).selected,
  ).toBeUndefined()
})
