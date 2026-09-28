import { expect, test } from '@playwright/test'
import { navigationFeature } from '../fixtures/navigation'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('two saved projects share navigation but retain distinct live illustration settings', async ({
  page,
  request,
}, testInfo) => {
  for (const [id, title, illustration, accent] of [
    ['visual-sky', 'Sky project', 'compass', 'sky'],
    ['visual-peach', 'Peach project', 'parcel', 'peach'],
  ] as const) {
    const response = await request.post('/api/v1/projects', {
      headers,
      data: {
        contractVersion: 1,
        id,
        title,
        relations: [],
        features: [
          {
            ...navigationFeature,
            title: `${title} activity`,
            presentation: { illustration, accent },
          },
        ],
      },
    })
    expect(response.ok()).toBe(true)
  }

  await page.goto('/#/projects/visual-sky')
  await expect(
    page.getByRole('navigation', { name: 'Guide navigation' }),
  ).toBeVisible()
  await expect(page.getByText('Sky project', { exact: true })).toBeVisible()
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-illustration',
    'compass',
  )
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-accent',
    'sky',
  )
  const artBounds = await page
    .locator('.hero-art')
    .first()
    .evaluate((hero) => {
      const frame = hero.getBoundingClientRect()
      const svg = hero.querySelector('svg')!.getBoundingClientRect()
      return {
        frameTop: frame.top,
        frameBottom: frame.bottom,
        svgTop: svg.top,
        svgBottom: svg.bottom,
      }
    })
  expect(artBounds.svgTop).toBeGreaterThanOrEqual(artBounds.frameTop)
  expect(artBounds.svgBottom).toBeLessThanOrEqual(artBounds.frameBottom + 1)
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page).toHaveURL(/visual-sky\/explore$/)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('visual-foundation-desktop.png'),
    fullPage: true,
  })

  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await page.getByRole('link', { name: 'Peach project', exact: true }).click()
  await expect(page.getByText('Peach project', { exact: true })).toBeVisible()
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-illustration',
    'parcel',
  )
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-accent',
    'peach',
  )

  const update = await request.post('/api/v1/projects/visual-peach/changes', {
    headers,
    data: {
      contractVersion: 1,
      expectedRevision: 1,
      upsertFeatures: [
        {
          ...navigationFeature,
          title: 'Peach project activity',
          presentation: { illustration: 'people', accent: 'sage' },
        },
      ],
    },
  })
  expect(update.ok()).toBe(true)
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-illustration',
    'people',
  )
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-accent',
    'sage',
  )
  await page.reload()
  await expect(page.locator('.activity-art').first()).toHaveAttribute(
    'data-illustration',
    'people',
  )
})

test('empty picker and 100 long activities remain usable at 375px', async ({
  page,
  request,
}, testInfo) => {
  await page.route('**/api/v1/projects', (route) => route.fulfill({ json: [] }))
  await page.goto('/#/')
  await expect(
    page.getByRole('heading', { name: 'No saved projects yet' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start here' })).toHaveCount(0)
  await page.unroute('**/api/v1/projects')

  const longLabel = 'Activity' + 'x'.repeat(145)
  const response = await request.post('/api/v1/projects', {
    headers,
    data: {
      contractVersion: 1,
      id: 'visual-long',
      title: 'Project' + 'y'.repeat(145),
      relations: [],
      features: Array.from({ length: 100 }, (_, index) => ({
        ...navigationFeature,
        id: `activity-${String(index).padStart(3, '0')}`,
        title: index === 0 ? longLabel : `Activity ${index}`,
        essentialOrder: index,
        presentation: { illustration: 'document', accent: 'sage' },
      })),
    },
  })
  expect(response.ok()).toBe(true)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/projects/visual-long')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await expect(
    page.getByRole('link', { name: longLabel, exact: true }),
  ).toBeVisible()
  await expect(page.locator('.island-link')).toHaveCount(6)
  await page.getByRole('button', { name: /Show more activities/ }).click()
  await expect(page.locator('.island-link')).toHaveCount(12)
  await expect(page.getByRole('link', { name: 'What changed' })).toBeVisible()
  expect(
    await page
      .locator('.hero-art')
      .first()
      .evaluate(
        (hero) =>
          hero.querySelector('svg')!.getBoundingClientRect().bottom <=
          hero.getBoundingClientRect().bottom + 1,
      ),
  ).toBe(true)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('visual-foundation-mobile.png'),
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page.locator('.activity-card')).toHaveCount(100)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('an explicitly selected essential activity alone appears on Start', async ({
  page,
  request,
}) => {
  const response = await request.post('/api/v1/projects', {
    headers,
    data: {
      contractVersion: 1,
      id: 'visual-essential-selection',
      title: 'Essential selection',
      relations: [],
      features: [
        { ...navigationFeature, id: 'a-unmarked', title: 'Unmarked activity' },
        {
          ...navigationFeature,
          id: 'z-marked',
          title: 'Selected activity',
          essentialOrder: 100,
        },
      ],
    },
  })
  expect(response.ok()).toBe(true)
  await page.goto('/#/projects/visual-essential-selection')
  await expect(page.locator('.activity-hero')).toHaveCount(1)
  await expect(
    page.getByRole('link', { name: 'Selected activity', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Unmarked activity', { exact: true }),
  ).toHaveCount(0)
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Unmarked activity' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Selected activity' }),
  ).toBeVisible()
})
