import { expect, test } from '@playwright/test'
import { approvalSeed, approvalFeature } from '../fixtures/approval'
import { seed } from '../fixtures/booking'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('source-supported booking comparisons retain their evidence status', async ({
  page,
  request,
}) => {
  const id = 'supported-comparison'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...seed,
          id,
          title: 'Supported comparison guide',
          features: [
            {
              ...seed.features[0],
              evidence: { ...seed.features[0].evidence, status: 'supported' },
            },
          ],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto(`/#/projects/${id}/changes`)
  await expect(
    page.getByText(
      'A recorded historical comparison, not proof of a production release or measured business impact.',
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.getByText(/A recorded fixture comparison/)).toHaveCount(0)
})

test('history explains case-only edits, prerequisites and removed activities', async ({
  page,
  request,
}) => {
  const id = 'complete-history'
  const other = {
    ...approvalFeature,
    id: 'moderation',
    title: 'Moderate a draft',
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...approvalSeed,
          id,
          title: 'Historical publishing guide',
          features: [approvalFeature, other],
        },
      })
    ).ok(),
  ).toBeTruthy()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: [
            {
              ...approvalFeature,
              cases: [{ ...approvalFeature.cases[0], approvals: 0 }],
            },
          ],
          upsertRelations: [
            {
              id: 'requires-review',
              from: 'approval',
              to: 'moderation',
              kind: 'requires',
            },
          ],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto(`/#/projects/${id}/changes`)
  await expect(
    page.getByText('Added relationship', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Approve a publishing request requires Moderate a draft', {
      exact: true,
    }),
  ).toBeVisible()
  const history = page.locator('.saved-change').filter({
    has: page.getByRole('heading', {
      name: approvalFeature.title,
      exact: true,
    }),
  })
  await history
    .getByText('Recorded rules, cases and evidence', { exact: true })
    .first()
    .click()
  await history
    .getByText('Recorded rules, cases and evidence', { exact: true })
    .last()
    .click()
  await expect(
    history.getByText('Request approved', { exact: true }).first(),
  ).toBeVisible()
  await expect(
    history.getByText('More reviews needed', { exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 2,
          removeFeatureIds: ['moderation'],
          removeRelationIds: ['requires-review'],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  const removed = page.locator('.saved-change').filter({
    has: page.getByRole('heading', { name: 'Moderate a draft', exact: true }),
  })
  await removed
    .getByText('Recorded rules, cases and evidence', { exact: true })
    .click()
  await expect(
    removed.getByText('At least 1 independent approvals', { exact: true }),
  ).toBeVisible()
  await expect(
    removed.getByText('Atlas authored approval fixture', { exact: true }),
  ).toBeVisible()
  await expect(
    removed.getByRole('link', { name: 'Explore current activity' }),
  ).toHaveCount(0)
  await expect(
    page.getByText('Removed relationship', { exact: true }),
  ).toBeVisible()
})

test('creates a non-booking guide through the API and explores both projects in the same build', async ({
  page,
  request,
}) => {
  expect(
    (
      await request.post('/api/v1/projects', { headers, data: approvalSeed })
    ).ok(),
  ).toBeTruthy()
  await page.goto('/#/')
  await page
    .getByRole('link', { name: approvalSeed.title, exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Start here', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: /Explore the story/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Request approved', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Reviews unknown', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Outcome not established', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Why this outcome?' }).click()
  await expect(
    page.getByText('Atlas authored approval fixture', { exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Request approved', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await page.getByRole('searchbox').fill('publishing')
  await page
    .getByRole('link', { name: approvalFeature.title, exact: true })
    .click()
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('publishing')
  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await page
    .getByRole('link', { name: 'Illustrative booking guide', exact: true })
    .click()
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('')
  await expect(page.getByText(approvalFeature.title)).toHaveCount(0)
  await page.getByRole('searchbox').fill('publishing')
  await expect(
    page.getByRole('heading', { name: 'No matching activity' }),
  ).toBeVisible()
})

test('rule updates preserve selected cases and historical comparisons in one running build', async ({
  page,
  request,
}) => {
  const id = 'approval-updates'
  const original = await request.post('/api/v1/projects', {
    headers,
    data: { ...approvalSeed, id },
  })
  expect(original.ok()).toBeTruthy()
  await page.goto(`/#/projects/${id}/explore/approval?case=at-limit`)
  await expect(
    page.getByRole('heading', { name: 'Request approved', exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: [{ ...approvalFeature, requiredApprovals: 2 }],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(
    page.getByRole('heading', { name: 'More reviews needed', exact: true }),
  ).toBeVisible()
  await expect(page).toHaveURL(/case=at-limit/)
  await page.getByRole('link', { name: 'Start here', exact: true }).click()
  await expect(
    page.getByText('At least 2 independent approvals', { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await expect(
    page.getByText('1 → 2 independent approvals', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Request approved → More reviews needed', { exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 2,
          removeFeatureIds: ['approval'],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(
    page.getByText('Removed from this guide', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Explore current activity' }),
  ).toHaveCount(0)
  await page.goto(`/#/projects/${id}/explore/approval?case=at-limit`)
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
})

test('project loading and failure never reuse another project’s facts, cases or evidence', async ({
  page,
  request,
}) => {
  const id = 'isolated-project'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...approvalSeed,
          id,
          title: 'Isolated guide',
          features: [{ ...approvalFeature, id: 'booking' }],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  await page.getByRole('button', { name: 'Why this outcome?' }).click()
  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  let release!: () => void
  const hold = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route(`**/api/v1/projects/${id}`, async (route) => {
    await hold
    await route.abort()
  })
  await page.getByRole('link', { name: 'Isolated guide', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Loading saved guide…')
  await expect(page.getByText('Reschedule a booking')).toHaveCount(0)
  await expect(
    page.getByText('Atlas authored fixture', { exact: true }),
  ).toHaveCount(0)
  release()
  await expect(page.getByRole('alert')).toContainText('Guide unavailable')
  await page.unroute(`**/api/v1/projects/${id}`)
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await page.getByRole('link', { name: /Explore the story/ }).click()
  await expect(page).toHaveURL(new RegExp(`/projects/${id}/explore/booking`))
  await expect(
    page.getByRole('heading', { name: 'Request approved', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Why this outcome?' }),
  ).toHaveAttribute('aria-expanded', 'false')
})

test('empty, unknown, incompatible and unavailable knowledge have distinct states', async ({
  page,
  request,
}) => {
  await page.route('**/api/v1/projects', (route) => route.fulfill({ json: [] }))
  await page.goto('/#/')
  await expect(
    page.getByRole('heading', { name: 'No saved projects yet' }),
  ).toBeVisible()
  await page.unroute('**/api/v1/projects')
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 1,
          id: 'empty-guide',
          title: 'Empty guide',
          features: [],
          relations: [],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto('/#/projects/empty-guide')
  await expect(
    page.getByRole('heading', { name: 'No activities incorporated yet' }),
  ).toBeVisible()
  await page.goto('/#/projects/not-saved')
  await expect(page.getByRole('alert')).toContainText('Project unavailable')
  await page.route('**/api/v1/projects/empty-guide', (route) =>
    route.fulfill({ json: { contractVersion: 999 } }),
  )
  await page.goto('/#/projects/empty-guide')
  await expect(page.getByRole('alert')).toContainText('Guide incompatible')
  await page.unroute('**/api/v1/projects/empty-guide')
  const id = 'no-cases'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...approvalSeed,
          id,
          features: [{ ...approvalFeature, cases: [] }],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto(`/#/projects/${id}/explore/approval`)
  await expect(
    page.getByRole('heading', { name: 'No saved cases' }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/approval?case=missing`)
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
})

test('grouped search and related evidence stay scoped and work with keyboard at narrow widths', async ({
  page,
  request,
}) => {
  const id = 'grouped-guide'
  const related = {
    ...approvalFeature,
    id: 'moderation',
    title: 'Review a moderation request',
    group: 'Moderation',
    evidence: { ...approvalFeature.evidence, status: 'uncertain' },
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...approvalSeed,
          id,
          features: [approvalFeature, related],
          relations: [
            {
              id: 'needs-moderation',
              from: 'approval',
              to: 'moderation',
              kind: 'requires',
            },
          ],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.setViewportSize({ width: 375, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`/#/projects/${id}/explore`)
  await expect(
    page.getByRole('heading', { name: 'Publishing / 1 activity' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Moderation / 1 activity' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: approvalFeature.title, exact: true })
    .focus()
  await page.keyboard.press('Enter')
  const choice = page.getByRole('button', { name: 'Own request', exact: true })
  await choice.focus()
  await expect(choice).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'A reviewer is needed', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Why this outcome?' }).click()
  await expect(
    page.getByText('Illustrative publishing review only', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Requires:', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Close detail' }).click()
  await expect(
    page.getByRole('button', { name: 'Why this outcome?' }),
  ).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Why this outcome?' }).click()
  await page.getByRole('link', { name: related.title, exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/projects/${id}/explore/moderation`))
  await expect(page.getByText(/Uncertain evidence/)).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('button', { name: 'Own request', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('history is bounded by loaded revision and retries without claiming unavailable history is empty', async ({
  page,
  request,
}) => {
  const id = 'history-guide'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...approvalSeed, id },
      })
    ).ok(),
  ).toBeTruthy()
  await page.goto(`/#/projects/${id}`)
  await expect(
    page.getByRole('heading', { name: 'Start here', exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: [{ ...approvalFeature, requiredApprovals: 2 }],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await expect(
    page.getByText('No recorded behavior changes between saved revisions.'),
  ).toBeVisible()
  await page.route(`**/api/v1/projects/${id}/history`, (route) => route.abort())
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Saved history unavailable',
  )
  await page.unroute(`**/api/v1/projects/${id}/history`)
  await page.getByRole('button', { name: 'Retry history' }).click()
  await expect(
    page.getByText('1 → 2 independent approvals', { exact: true }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/approval?case=at-limit`)
  await expect(
    page.getByRole('heading', { name: 'More reviews needed', exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 2,
          upsertFeatures: [
            {
              ...approvalFeature,
              requiredApprovals: 2,
              cases: approvalFeature.cases.filter((c) => c.id !== 'at-limit'),
            },
          ],
        },
      })
    ).ok(),
  ).toBeTruthy()
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
})
