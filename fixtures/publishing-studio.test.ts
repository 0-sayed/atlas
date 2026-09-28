import { expect, it } from 'vitest'
import {
  isApprovalFeature,
  isNavigationFeature,
  validateDocument,
  type ProjectDocument,
} from '../shared/contracts.js'
import { approvalOutcome } from '../shared/approval.js'
import { featureChanges } from '../shared/changes.js'
import {
  publishingStudioReviewUpdate,
  publishingStudioSeed,
} from './publishing-studio.js'

it('is a complete, scoped, explicitly fictional editorial journey', () => {
  expect(publishingStudioSeed).toMatchObject({
    contractVersion: 1,
    id: 'publishing-studio',
    title: 'Publishing Studio · Demo',
  })
  expect(() =>
    validateDocument({ ...publishingStudioSeed, revision: 1, assets: [] }),
  ).not.toThrow()
  expect(publishingStudioSeed.features.map((feature) => feature.id)).toEqual([
    'prepare-article',
    'request-review',
    'approve-article',
    'publish-article',
    'find-published-article',
  ])
  expect(
    publishingStudioSeed.features
      .filter((f) => f.essentialOrder !== undefined)
      .map((f) => f.essentialOrder),
  ).toEqual([0, 1, 2])
  expect(
    new Set(
      publishingStudioSeed.features.map((f) => JSON.stringify(f.presentation)),
    ).size,
  ).toBeGreaterThan(2)
  for (const feature of publishingStudioSeed.features) {
    expect(feature.evidence).toMatchObject({
      status: 'demo',
      source: 'Atlas authored Publishing Studio fixture',
      sourceRevision: 'publishing-studio-fixture-v1',
    })
    expect(feature.evidence.description).toMatch(/fictional|invented/i)
    expect(feature.assetIds).toEqual([])
  }
})

it('links dependent activities to the prerequisite shown by the renderer', () => {
  expect(publishingStudioSeed.relations).toEqual([
    {
      id: 'review-requires-draft',
      from: 'request-review',
      to: 'prepare-article',
      kind: 'requires',
    },
    {
      id: 'approval-requires-request',
      from: 'approve-article',
      to: 'request-review',
      kind: 'requires',
    },
    {
      id: 'publish-requires-approval',
      from: 'publish-article',
      to: 'approve-article',
      kind: 'requires',
    },
    {
      id: 'find-requires-published',
      from: 'find-published-article',
      to: 'publish-article',
      kind: 'requires',
    },
  ])
})

it('offers available, unavailable, and unknown scenarios for each navigation activity', () => {
  const navigation = publishingStudioSeed.features.filter(isNavigationFeature)
  expect(navigation).toHaveLength(4)
  for (const feature of navigation) {
    expect(new Set(feature.cases.map((example) => example.outcome))).toEqual(
      new Set(['available', 'unavailable', 'unknown']),
    )
    expect(
      feature.cases.every(
        (example) =>
          example.start && example.action && example.result && example.reason,
      ),
    ).toBe(true)
  }
})

it('changes only the review threshold and records the changed one-review outcome', () => {
  const before: ProjectDocument = {
    ...publishingStudioSeed,
    revision: 1,
    assets: [],
  }
  expect(publishingStudioReviewUpdate).toMatchObject({
    contractVersion: 1,
    expectedRevision: 1,
  })
  expect(publishingStudioReviewUpdate.upsertFeatures).toHaveLength(1)
  const priorReview = before.features.find(isApprovalFeature)!
  const revisedReview =
    publishingStudioReviewUpdate.upsertFeatures!.find(isApprovalFeature)!
  expect(priorReview.id).toBe('approve-article')
  expect(priorReview.requiredApprovals).toBe(1)
  expect(revisedReview.requiredApprovals).toBe(2)
  expect(revisedReview).toEqual({
    ...priorReview,
    requiredApprovals: 2,
    revisionLabel: 'Publishing Studio fixture v2',
    evidence: {
      ...priorReview.evidence,
      sourceRevision: 'publishing-studio-fixture-v2',
      description:
        'Invented revision: the fictional review request now requires two independent approvals. No source product behavior was inspected.',
    },
  })
  expect(revisedReview.cases).toEqual(priorReview.cases)
  const after: ProjectDocument = {
    ...before,
    revision: 2,
    features: before.features.map((feature) =>
      feature.id === revisedReview.id ? revisedReview : feature,
    ),
  }
  expect(validateDocument(after)).toEqual(after)
  expect(
    featureChanges(before, after).map(({ id, kind }) => ({ id, kind })),
  ).toEqual([{ id: 'approve-article', kind: 'changed' }])
  const oneReview = priorReview.cases.find(
    (example) => example.id === 'one-review',
  )!
  expect(approvalOutcome(priorReview, oneReview).outcome).toBe('allowed')
  expect(approvalOutcome(revisedReview, oneReview).outcome).toBe('blocked')
  expect(
    approvalOutcome(
      revisedReview,
      revisedReview.cases.find((example) => example.id === 'two-reviews')!,
    ).outcome,
  ).toBe('allowed')
})
