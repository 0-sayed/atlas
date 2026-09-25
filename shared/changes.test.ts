import { expect, it } from 'vitest'
import { approvalSeed, approvalFeature } from '../fixtures/approval.js'
import {
  featureChanges,
  historyForRevision,
  relationChanges,
} from './changes.js'
import { validateDocument } from './contracts.js'

const original = validateDocument({ ...approvalSeed, revision: 1, assets: [] })
it('keeps saved rule values and distinguishes addition, change, removal and metadata-only revisions', () => {
  const updated = validateDocument({
    ...original,
    revision: 2,
    features: [{ ...approvalFeature, requiredApprovals: 2 }],
  })
  const change = featureChanges(original, updated)[0]
  expect(change.kind).toBe('changed')
  expect(change.before).toMatchObject({ requiredApprovals: 1 })
  expect(change.after).toMatchObject({ requiredApprovals: 2 })
  expect(featureChanges({ ...original, features: [] }, original)[0].kind).toBe(
    'added',
  )
  expect(featureChanges(original, { ...updated, features: [] })[0].kind).toBe(
    'removed',
  )
  expect(
    featureChanges(original, {
      ...updated,
      features: [
        {
          ...approvalFeature,
          revisionLabel: 'new evidence',
          evidence: { ...approvalFeature.evidence, sourceRevision: 'new' },
        },
      ],
    }),
  ).toEqual([])
})
it('only accepts same-project coherent history through the loaded revision', () => {
  const newer = { ...original, revision: 2 }
  expect(historyForRevision([original, newer], original)).toEqual([original])
  expect(() =>
    historyForRevision([{ ...original, id: 'other' }], original),
  ).toThrow()
  expect(() => historyForRevision([original, original], original)).toThrow()
  expect(() => historyForRevision([newer], original)).toThrow()
  expect(() =>
    historyForRevision([{ ...original, features: [] }], original),
  ).toThrow()
})

it('matches saved snapshots regardless of database ordering of scoped records', () => {
  const doc = validateDocument({
    ...original,
    features: [
      { ...approvalFeature, id: 'z-last' },
      { ...approvalFeature, id: 'a-first' },
    ],
    relations: [
      { id: 'z-link', from: 'z-last', to: 'a-first', kind: 'requires' },
      { id: 'a-link', from: 'a-first', to: 'z-last', kind: 'related' },
    ],
  })
  const loaded = {
    ...doc,
    features: [...doc.features].reverse(),
    relations: [...doc.relations].reverse(),
  }
  expect(historyForRevision([doc], loaded)).toEqual([doc])
  expect(() =>
    historyForRevision(
      [
        {
          ...doc,
          features: [
            { ...doc.features[0], cases: [...doc.features[0].cases].reverse() },
            doc.features[1],
          ],
        },
      ],
      loaded,
    ),
  ).toThrow()
})

it('records added, removed and retargeted product relationships with scoped titles', () => {
  const before = {
    ...original,
    features: [
      approvalFeature,
      { ...approvalFeature, id: 'moderation', title: 'Moderate a draft' },
    ],
  }
  const after = validateDocument({
    ...before,
    revision: 2,
    relations: [
      {
        id: 'requires-review',
        from: 'approval',
        to: 'moderation',
        kind: 'requires',
      },
    ],
  })
  expect(relationChanges(before, after)).toMatchObject([
    {
      kind: 'added',
      fromTitle: approvalFeature.title,
      toTitle: 'Moderate a draft',
      relation: { kind: 'requires' },
    },
  ])
  expect(relationChanges(after, before)[0].kind).toBe('removed')
  expect(
    relationChanges(after, {
      ...after,
      relations: [{ ...after.relations[0], kind: 'related' }],
    }).map((c) => c.kind),
  ).toEqual(['removed', 'added'])
})
