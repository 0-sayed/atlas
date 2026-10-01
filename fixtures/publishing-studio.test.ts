import { expect, it } from 'vitest'
import {
  isApprovalFeature,
  isAuthoredFeature,
  isNavigationFeature,
  validateDocument,
} from '../shared/contracts.js'
import { approvalOutcome } from '../shared/approval.js'
import { publishingStudioSeed } from './publishing-studio.js'
import { actorParticipation, ruleContext } from '../src/content/destinations.js'

it('provides linked knowledge for every supporting destination in the single showcase', () => {
  const project = validateDocument({
    ...publishingStudioSeed,
    revision: 1,
    assets: [],
  })
  expect(project.purpose?.text).toMatch(/article/i)
  expect(project.actors.map((actor) => actor.name)).toEqual([
    'Writer',
    'Reviewer',
    'Editor',
    'Reader',
  ])
  expect(
    actorParticipation(project, 'writer').map(({ feature }) => feature.id),
  ).toEqual(['prepare-article', 'request-review'])
  expect(
    ruleContext(project, 'reviewer-independent').flatMap(({ cases }) =>
      cases.map((example) => example.outcome.status),
    ),
  ).toEqual(['allowed', 'blocked', 'unknown', 'conflicting'])
  expect(project.journeys[0]?.steps.map((step) => step.featureId)).toEqual([
    'prepare-article',
    'request-review',
    'approve-article',
    'publish-article',
    'find-published-article',
  ])
  expect(
    project.glossary.find((term) => term.id === 'independent-review')?.ruleIds,
  ).toContain('reviewer-independent')
  expect(
    project.features.every(
      (feature) => feature.areaId && feature.evidenceIds?.length,
    ),
  ).toBe(true)
  expect(
    project.features
      .find(isAuthoredFeature)
      ?.cases.map((example) => example.outcome.status),
  ).toEqual(['allowed', 'blocked', 'unknown', 'conflicting'])
})

it('is a complete, scoped, explicitly fictional editorial journey', () => {
  expect(publishingStudioSeed).toMatchObject({
    contractVersion: 2,
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
  expect(navigation).toHaveLength(3)
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

it('starts with the current two-review rule', () => {
  const review = publishingStudioSeed.features.find(isApprovalFeature)!
  expect(review.requiredApprovals).toBe(2)
  expect(review.evidence.sourceRevision).toBe('publishing-studio-fixture-v2')
  const oneReview = review.cases.find((example) => example.id === 'one-review')!
  expect(approvalOutcome(review, oneReview).outcome).toBe('blocked')
  expect(
    approvalOutcome(
      review,
      review.cases.find((example) => example.id === 'two-reviews')!,
    ).outcome,
  ).toBe('allowed')
})
