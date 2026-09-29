import { expect, test } from '@playwright/test'

test('current guide destinations are reachable and Back restores the prior view', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/')
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
})

test('a direct current-case link loads and a historical destination is unavailable', async ({
  page,
}) => {
  let historyRequests = 0
  await page.route('**/api/v1/projects/*/history', (route) => {
    historyRequests += 1
    return route.abort()
  })
  await page.goto('/#/projects/booking-demo/changes')
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'What changed' })).toHaveCount(0)
  expect(historyRequests).toBe(0)
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toBeVisible()
  await page.goto('/#/projects/booking-demo/explore/missing?case=unknown')
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Return to Explore' }),
  ).toBeVisible()
})

test('a legacy Explore link returns to the project picker', async ({
  page,
}) => {
  await page.goto('/#/explore/booking?case=at-limit')
  await expect(page).toHaveURL(/#\/$/)
  await expect(
    page.getByRole('heading', { name: 'Choose a project' }),
  ).toBeVisible()
})

test('navigation stays usable by keyboard and at narrow widths', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#workspace-content')).toBeFocused()
  await expect(page.locator('#workspace-content')).toHaveCSS(
    'outline-style',
    'solid',
  )
  await page.keyboard.press('Tab')
  await expect(page.locator('#workspace-content a').first()).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.setViewportSize({ width: 375, height: 800 })
  await expect(
    page.getByRole('link', { name: 'Explore', exact: true }),
  ).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
})

test('skip link focuses main on an unknown route', async ({ page }) => {
  await page.goto('/#/not-a-route')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Choose a project' }),
  ).toBeFocused()
})

test('keyboard navigation reaches the home link after the skip link', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await expect(
    page.getByRole('button', { name: 'Refresh guide' }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Atlas home' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: /^Choose project:/ }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Refresh guide' }),
  ).toBeFocused()
})
