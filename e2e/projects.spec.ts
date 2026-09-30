import { expect, test } from '@playwright/test'
import { approvalSeed, approvalFeature } from '../fixtures/approval'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

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
  await page.locator('.island-link').first().click()
  await expect(
    page.getByRole('heading', { name: 'Ready for approval', exact: true }),
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
    page.getByRole('heading', { name: 'Ready for approval', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Search activities', exact: true })
    .click()
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
  await page
    .getByRole('link', { name: 'Search activities', exact: true })
    .click()
  await expect(page.getByRole('searchbox')).toHaveValue('')
  await expect(page.getByText(approvalFeature.title)).toHaveCount(0)
  await page.getByRole('searchbox').fill('publishing')
  await expect(
    page.getByRole('heading', { name: 'No activity matched “publishing”' }),
  ).toBeVisible()
})

test('rule updates preserve selected cases in one running build', async ({
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
    page.getByRole('heading', { name: 'Ready for approval', exact: true }),
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
  await expect(page.getByLabel('Essential restrictions')).toContainText(
    'At least 2 independent approvals',
  )
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
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
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
  await page.locator('.island-link').first().click()
  await expect(page).toHaveURL(new RegExp(`/projects/${id}/explore/booking`))
  await expect(
    page.getByRole('heading', { name: 'Ready for approval', exact: true }),
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
    page.getByRole('heading', { name: 'Your product’s story starts here.' }),
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
    page.getByRole('heading', { name: 'No implemented activities found' }),
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

test('missing project offers a route back to the project picker', async ({
  page,
}) => {
  await page.goto('/#/projects/not-saved')
  await expect(page.getByRole('alert')).toContainText('Project unavailable')
  await page.getByRole('link', { name: 'Choose a project' }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose a project' }),
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
    page.getByRole('heading', { name: 'Publishing, 1 activity' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Moderation, 1 activity' }),
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
  await expect(
    page
      .getByRole('status', { name: 'Selected outcome' })
      .getByText(/Uncertain evidence/),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('button', { name: 'Own request', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
})
