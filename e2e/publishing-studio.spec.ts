import { expect, test } from '@playwright/test'
import { seedPublishingStudioApi } from '../scripts/seed'
import { publishingStudioSeed } from '../fixtures/publishing-studio'
import { isNavigationFeature } from '../shared/contracts'

test('Publishing Studio explains a connected journey and its changed approval rule', async ({
  page,
  baseURL,
}, testInfo) => {
  await seedPublishingStudioApi(
    Number(new URL(baseURL!).port),
    'e2e-only-token-not-a-production-secret',
  )
  const base = '/#/projects/publishing-studio'
  await page.goto(base)
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await expect(page.locator('.activity-hero')).toHaveCount(3)
  await expect(page.locator('.island-sea')).toBeVisible()
  for (const terrain of await page.locator('.island-terrain').all()) {
    await expect(terrain).toBeVisible()
    await expect
      .poll(() =>
        terrain.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0)
  }
  await page.evaluate(() => document.fonts.ready)
  await expect(
    page.getByText('Publishing Studio · Demo', { exact: true }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('publishing-studio-desktop.png'),
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page.locator('.activity-card')).toHaveCount(5)
  await page.getByRole('searchbox').fill('review')
  await expect(page.locator('.activity-card').first()).toBeVisible()

  for (const activity of publishingStudioSeed.features.filter(
    isNavigationFeature,
  )) {
    for (const example of activity.cases) {
      await page.goto(`${base}/explore/${activity.id}?case=${example.id}`)
      await expect(
        page.getByRole('heading', { name: example.result, exact: true }),
      ).toBeVisible()
      await expect(page.locator('.navigation-result .eyebrow')).toHaveText(
        example.outcome === 'available'
          ? 'Available'
          : example.outcome === 'unavailable'
            ? 'Unavailable'
            : 'Unknown',
      )
    }
  }

  await page.goto(
    `${base}/explore/prepare-article?case=draft-complete&from=start`,
  )
  await expect(
    page.getByRole('heading', { name: 'How it works', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Business rules', exact: true }),
  ).toBeVisible()
  await expect(page.locator('.navigation-scene svg')).toHaveCount(3)
  await page.getByRole('button', { name: /credit/i }).click()
  await expect(page.locator('.navigation-result .eyebrow')).toHaveText(
    'Unavailable',
  )
  await page.goBack()
  await expect(page.locator('.navigation-result .eyebrow')).toHaveText(
    'Available',
  )
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('publishing-studio-feature-desktop.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 375, height: 812 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('publishing-studio-feature-mobile.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 1280, height: 720 })

  await page.goto(`${base}/explore/approve-article?case=one-review`)
  await expect(
    page.getByRole('heading', { name: 'More reviews needed', exact: true }),
  ).toBeVisible()
  await page.locator('.case-picker button').nth(1).click()
  await expect(
    page.getByRole('heading', { name: 'Ready for approval', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'More reviews needed', exact: true }),
  ).toBeVisible()
  await page.goto(`${base}/explore/approve-article?case=own-request`)
  await expect(
    page.getByRole('heading', { name: 'A reviewer is needed', exact: true }),
  ).toBeVisible()
  await page.goto(`${base}/explore/approve-article?case=unknown-reviews`)
  await expect(
    page.getByRole('heading', { name: 'Outcome not established', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Why this outcome?' }).click()
  await expect(
    page.getByRole('heading', { name: 'About this evidence' }),
  ).toBeVisible()
  await expect(page.locator('.fixture-label')).toContainText(
    'Illustrative fixture',
  )
  await page.locator('a[href$="/explore/request-review"]').click()
  await expect(page).toHaveURL(/\/explore\/request-review$/)

  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await expect(
    page.getByText('1 → 2 independent approvals', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Ready for approval → More reviews needed', { exact: true }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('publishing-studio-history.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(base)
  await expect(page.locator('.activity-hero')).toHaveCount(3)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('publishing-studio-mobile.png'),
    fullPage: true,
  })
})
