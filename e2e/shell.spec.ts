import { expect, test } from '@playwright/test'

test('the three foundation destinations are reachable and Back restores the prior view', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible()
  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'What changed' }),
  ).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible()
})

test('a direct hash link loads, and an unknown destination states that it is unavailable', async ({
  page,
}) => {
  await page.goto('/#/changes')
  await expect(
    page.getByRole('heading', { name: 'What changed' }),
  ).toBeVisible()
  await page.goto('/#/explore/missing?case=unknown')
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Return to Explore' }),
  ).toBeVisible()
})

test('navigation stays usable by keyboard and at narrow widths', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await expect(page.locator('main')).toHaveCSS('outline-style', 'solid')
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.setViewportSize({ width: 375, height: 800 })
  await expect(
    page.getByRole('link', { name: 'What changed', exact: true }),
  ).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('link', { name: 'Explore', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible()
})

test('keyboard navigation reaches the home link after the skip link', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Atlas home' })).toBeFocused()
})
