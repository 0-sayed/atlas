import { expect, test } from '@playwright/test'
import { authoredSeed } from '../fixtures/authored'
import { publishingStudioSeed } from '../fixtures/publishing-studio'

const showcaseId = 'usability-publishing-studio'
test.beforeAll(async ({ request }) => {
  if ((await request.get('/api/v1/projects/' + showcaseId)).ok()) return
  expect(
    (
      await request.post('/api/v1/projects', {
        headers: {
          authorization: 'Bearer e2e-only-token-not-a-production-secret',
        },
        data: { ...publishingStudioSeed, id: showcaseId },
      })
    ).status(),
  ).toBe(201)
})

test('sidebar search starts typing immediately and stays marked as the current destination', async ({
  page,
}) => {
  await page.goto('/#/projects/' + showcaseId)
  const searchLink = page.getByRole('link', {
    name: 'Search activities',
    exact: true,
  })
  await searchLink.click()
  const search = page.getByRole('searchbox', { name: 'Search activities' })
  await expect(search).toBeFocused()
  await expect(searchLink).toHaveAttribute('aria-current', 'page')
  await page.keyboard.type('permission')
  await expect(search).toHaveValue('permission')
  await searchLink.click()
  await expect(search).toBeFocused()
  await expect(search).toHaveValue('')
  await page.goBack()
  await expect(search).toHaveValue('permission')
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await expect(search).toHaveValue('')
})

test('map and supporting searches retain fast typing and restore the URL after Back', async ({
  page,
}) => {
  for (const destination of [
    'map',
    'actors',
    'rules',
    'glossary',
    'journeys',
  ]) {
    await page.goto('/#/projects/' + showcaseId + '/' + destination)
    const search = page.getByRole('searchbox')
    await search.focus()
    await page.keyboard.type('permission')
    await expect(search).toHaveValue('permission')
    await expect(page).toHaveURL(/q=permission$/)
    await page.getByRole('link', { name: 'Start here', exact: true }).click()
    await page.goBack()
    await expect(search).toHaveValue('permission')
    await page
      .getByRole('button', {
        name: destination === 'map' ? 'Return to all areas' : 'Clear search',
        exact: true,
      })
      .click()
    await expect(search).toHaveValue('')
    await expect(page).not.toHaveURL(/q=/)
  }
})

test('rule summaries keep cases optional, preserve case links and describe the filtered collection', async ({
  page,
  request,
}, info) => {
  const id = `usability-rules-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers: {
          authorization: 'Bearer e2e-only-token-not-a-production-secret',
        },
        data: {
          ...authoredSeed,
          id,
          rules: [
            ...authoredSeed.rules,
            {
              id: 'other',
              title: 'Unrelated rule',
              statement: 'A separate recorded condition.',
              evidenceIds: ['source'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}/rules`)
  await expect(
    page.getByText(authoredSeed.rules[0].statement, { exact: true }),
  ).toBeVisible()
  const caseLink = page.getByRole('link', {
    name: 'Conflicting handoff · Conflicting',
    exact: true,
  })
  await expect(caseLink).not.toBeVisible()
  await page.getByRole('searchbox').fill('checklist')
  await expect(page.locator('.knowledge-page > .revision-note')).toHaveText(
    '1 of 2 saved records',
  )
  const caseSummary = page.getByText('4 saved cases', { exact: true })
  await caseSummary.focus()
  await page.keyboard.press('Enter')
  await expect(caseLink).toBeVisible()
  await caseLink.click()
  await expect(page.getByRole('status')).toContainText('Conflicting')
  await page.getByRole('link', { name: 'Back to Rules', exact: true }).click()
  await expect(page).toHaveURL(/rules\?q=checklist&item=complete$/)
  await page.getByRole('searchbox').fill('')
  await page
    .locator('.knowledge-index')
    .getByRole('link', {
      name: 'Checklist complete',
      exact: true,
    })
    .click()
  await page
    .getByRole('button', { name: 'Show all Rules', exact: true })
    .click()
  await expect(page.locator('.knowledge-record')).toHaveCount(2)
  await expect(page).not.toHaveURL(/item=/)
})

test('a small desktop map needs no pagination and exposes its controls without scrolling', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/#/projects/' + showcaseId + '/map')
    await expect(page.locator('.map-node')).toHaveCount(2)
    await expect(
      page.getByRole('button', { name: 'Next map page' }),
    ).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: 'Fit all islands' }),
    ).toBeInViewport()
    await expect(
      page.getByRole('button', { name: 'Map overview: move viewport' }),
    ).toBeInViewport()
    for (const name of ['Fit all islands', 'Map overview: move viewport']) {
      const box = await page
        .getByRole('button', { name, exact: true })
        .boundingBox()
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height)
    }
    await expect(
      page.getByText('1 recorded activity', { exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
    await page
      .getByRole('button', { name: 'Fit all islands', exact: true })
      .click()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  }
})
