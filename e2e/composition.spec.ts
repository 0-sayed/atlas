import { expect, test } from '@playwright/test'
import { publishingStudioSeed } from '../fixtures/publishing-studio'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('desktop browse uses compact two-column cards and a centered search recovery', async ({
  page,
  request,
}, testInfo) => {
  const id = `composition-browse-${testInfo.parallelIndex}-${testInfo.retry}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...publishingStudioSeed, id },
      })
    ).ok(),
  ).toBe(true)
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.goto(`/#/projects/${id}/explore`)
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
  const firstGroup = page.locator('.collection-group').first()
  const cards = firstGroup.locator('.collection-card')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThanOrEqual(2)
  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(first).not.toBeNull()
  expect(second).not.toBeNull()
  expect(second!.x - (first!.x + first!.width)).toBeGreaterThanOrEqual(16)
  expect(Math.abs(second!.y - first!.y)).toBeLessThanOrEqual(2)
  await expect(firstGroup.locator('.collection-group-badge')).toBeVisible()
  await expect(cards.first().locator('.atlas-activity-icon')).toBeVisible()
  await expect(cards.first().locator('.activity-island-scenery')).toHaveCount(0)

  const search = page.getByRole('searchbox', { name: 'Search activities' })
  await search.fill('no-matching-activity')
  await expect(
    page.getByRole('heading', {
      name: 'No activity matched “no-matching-activity”',
    }),
  ).toBeVisible()
  const panel = page.locator('.collection-no-results')
  const island = panel.locator('.collection-island')
  await expect(island).toBeVisible()
  await expect
    .poll(() =>
      island
        .locator('img')
        .first()
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)
  const panelBox = await panel.boundingBox()
  const islandBox = await island.boundingBox()
  expect(
    Math.abs(
      islandBox!.x + islandBox!.width / 2 - (panelBox!.x + panelBox!.width / 2),
    ),
  ).toBeLessThanOrEqual(2)
  await page.getByRole('button', { name: 'Return to all activities' }).click()
  await expect(search).toHaveValue('')
  await expect(cards.first()).toBeVisible()
})

test('true empty workspace centers approved island and hides project navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.route('**/api/v1/projects', (route) => route.fulfill({ json: [] }))
  await page.goto('/#/')
  await expect(
    page.getByRole('heading', { name: 'Your product’s story starts here.' }),
  ).toBeVisible()
  await expect(page.locator('.project-picker--empty')).toBeVisible()
  await expect(page.locator('.atlas-sidebar')).toBeHidden()
  const island = page.locator('.project-picker--empty .collection-island')
  await expect(island).toBeVisible()
  await expect(island.locator('.atlas-icon')).toBeVisible()
  await expect
    .poll(() =>
      island
        .locator('img')
        .first()
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)
  const content = await page.locator('.workspace-content').boundingBox()
  const artwork = await island.boundingBox()
  expect(
    Math.abs(
      artwork!.x + artwork!.width / 2 - (content!.x + content!.width / 2),
    ),
  ).toBeLessThanOrEqual(2)
  await expect(
    page.getByRole('button', { name: 'Refresh projects' }),
  ).toBeVisible()
})

test('loading and API failure retain the shared frame and retry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 })
  let release!: () => void
  const hold = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/api/v1/projects/booking-demo', async (route) => {
    await hold
    await route.abort()
  })
  await page.goto('/#/projects/booking-demo')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.locator('.atlas-sidebar')).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Loading saved guide…')
  await expect(page.locator('.knowledge-state-card')).toBeVisible()
  release()
  await expect(page.getByRole('alert')).toContainText('Guide unavailable')
  await expect(page.locator('.knowledge-state-error')).toBeVisible()
  await page.unroute('**/api/v1/projects/booking-demo')
  await page.getByRole('button', { name: 'Retry' }).click()
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
})

test('recorded case selection keeps outcome beside choices and browser Back restores it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  const grid = page.locator('.recorded-case-grid')
  const picker = grid.locator('.recorded-case-picker')
  const outcome = grid.locator('.recorded-case-outcome')
  await expect(picker).toBeVisible()
  await expect(outcome).toBeVisible()
  const left = await picker.boundingBox()
  const right = await outcome.boundingBox()
  expect(right!.x - (left!.x + left!.width)).toBeGreaterThanOrEqual(16)
  expect(Math.abs(right!.y - left!.y)).toBeLessThanOrEqual(2)
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  const late = picker.getByRole('button', {
    name: 'Less than 24 hours',
    exact: true,
  })
  await late.click()
  await expect(late).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/case=too-late/)
  await expect(
    outcome.getByRole('heading', { name: 'Too late to move', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/case=at-limit/)
  await expect(
    outcome.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
})
