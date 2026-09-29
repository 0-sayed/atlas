import { expect, test } from '@playwright/test'
import { seed } from '../fixtures/booking'

test('booking with no saved cases shows its current rule without inventing an outcome', async ({
  page,
  request,
}) => {
  const id = `booking-no-cases-${Date.now()}`
  const response = await request.post('/api/v1/projects', {
    headers: {
      authorization: 'Bearer e2e-only-token-not-a-production-secret',
    },
    data: {
      ...seed,
      id,
      title: 'Booking guide with no saved cases',
      features: [{ ...seed.features[0], cases: [] }],
    },
  })
  expect(response.ok()).toBe(true)
  await page.goto(`/#/projects/${id}/explore/booking`)
  await expect(
    page.getByRole('heading', { name: 'No saved cases' }),
  ).toBeVisible()
  await expect(page.getByLabel('Essential restrictions')).toContainText(
    'At least 24 hours before the original start',
  )
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'More detail' }).click()
  await expect(
    page.getByRole('heading', { name: 'Evidence for this activity' }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/booking?case=missing`)
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
})

test('saved cases change the scene and explain isolated conditions', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('24 hours remaining', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('At least 24 hours before the original start', {
      exact: true,
    }),
  ).toBeVisible()
  for (const [label, outcome] of [
    ['Less than 24 hours', 'Too late to move'],
    ['Slot occupied', 'Choose another slot'],
    ['Someone else’s booking', 'Not yours to move'],
    ['Availability unknown', 'Outcome not established'],
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await expect(
      page.getByRole('heading', { name: outcome, exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: label, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
  }
  await expect(
    page.getByText('Slot availability unknown', { exact: true }),
  ).toBeVisible()
  const reason = page.getByRole('button', { name: 'Why this outcome?' })
  await reason.click()
  await expect(
    page.getByText(/does not establish whether the replacement slot is free/),
  ).toBeVisible()
  await expect(
    page.getByText(
      /No source application, PR or deployed behavior has been verified/,
    ),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Close detail' }).click()
  await expect(reason).toBeFocused()
  await expect(page).toHaveURL(/case=unknown/)
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Outcome not established' }),
  ).toBeVisible()
})

test('search opens the activity directly and return preserves the query', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/explore')
  const search = page.getByRole('searchbox', { name: 'Search activities' })
  await search.fill('MOVE')
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  await page.getByRole('button', { name: 'Slot occupied', exact: true }).click()
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(search).toHaveValue('MOVE')
  await search.fill('refund')
  await expect(
    page.getByRole('heading', { name: 'No activity matched “refund”' }),
  ).toBeVisible()
  await expect(search).toHaveValue('refund')
  await page.getByRole('button', { name: 'Return to all activities' }).click()
  await expect(
    page.getByRole('link', { name: 'Reschedule a booking', exact: true }),
  ).toBeVisible()
})

test('browser Back restores the selected case and earlier search', async ({
  page,
}) => {
  await page.goto('/#/projects/booking-demo/explore?q=booking')
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Less than 24 hours', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Too late to move' }),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('searchbox', { name: 'Search activities' }),
  ).toHaveValue('booking')
})

test('missing activity and case links cannot show a successful booking', async ({
  page,
}) => {
  await page.goto(
    '/#/projects/booking-demo/explore/booking?case=missing&q=move',
  )
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Return to Explore', exact: true })
    .click()
  await expect(
    page.getByRole('searchbox', { name: 'Search activities' }),
  ).toHaveValue('move')

  for (const route of [
    '/explore/missing',
    '/explore/booking?case=missing',
    '/explore/booking?case=',
  ]) {
    await page.goto(`/#/projects/booking-demo${route}`)
    await expect(
      page.getByRole('heading', { name: 'This guide is not here yet' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Booking moved', exact: true }),
    ).toHaveCount(0)
  }
})

test('the learning loop works by keyboard, at narrow widths and with reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/projects/booking-demo/')
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  const choice = page.getByRole('button', {
    name: 'Less than 24 hours',
    exact: true,
  })
  await choice.focus()
  await expect(choice).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Too late to move', exact: true }),
  ).toBeVisible()
  const reason = page.getByRole('button', { name: 'Why this outcome?' })
  await reason.focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Close detail', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(reason).toBeFocused()
  const transitionDuration = await page
    .locator('.recorded-case-outcome')
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration),
    )
  expect(
    await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
  ).toBe(true)
  expect(transitionDuration).toBeLessThan(0.001)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
})

test('return restores the actual Explore position', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 600 })
  await page.goto('/#/projects/booking-demo/explore?q=move')
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 220))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
  const activity = page.getByRole('link', {
    name: 'Reschedule a booking',
    exact: true,
  })
  await activity.scrollIntoViewIfNeeded()
  const explorePosition = await page.evaluate(() => window.scrollY)
  await activity.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(
    page.getByRole('searchbox', { name: 'Search activities' }),
  ).toHaveValue('move')
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(explorePosition)
})

test('unavailable guide return restores the actual Explore position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 600 })
  await page.goto('/#/projects/booking-demo/explore?q=move')
  await expect(
    page.getByRole('heading', { name: 'Browse recorded activities' }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 220))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '#/projects/booking-demo/explore/booking?case=missing&q=move'
    link.textContent = 'Open unavailable guide'
    document.body.append(link)
    link.click()
  })
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Return to Explore', exact: true })
    .click()
  await expect(
    page.getByRole('searchbox', { name: 'Search activities' }),
  ).toHaveValue('move')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
})

test('changing a saved case preserves the viewport position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 600 })
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 450))
  const choice = page.getByRole('button', {
    name: 'Less than 24 hours',
    exact: true,
  })
  await choice.scrollIntoViewIfNeeded()
  const previousPosition = await page.evaluate(() => window.scrollY)
  await choice.click()
  await expect(page).toHaveURL(/case=too-late/)
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(previousPosition)
})
