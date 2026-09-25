import { expect, test } from '@playwright/test'

test('saved cases change the scene and explain isolated conditions', async ({
  page,
}) => {
  await page.goto('/#/explore/booking?case=at-limit')
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
  await page.goto('/#/explore')
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
    page.getByText('No matching activity', { exact: true }),
  ).toBeVisible()
  await expect(search).toHaveValue('refund')
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(
    page.getByRole('link', { name: 'Reschedule a booking', exact: true }),
  ).toBeVisible()
})

test('browser Back restores the selected case and earlier search', async ({
  page,
}) => {
  await page.goto('/#/explore?q=booking')
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Less than 24 hours', exact: true })
    .click()
  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await page.goBack()
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
  await page.goto('/#/explore/booking?case=missing&q=move')
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
    await page.goto(`/#${route}`)
    await expect(
      page.getByRole('heading', { name: 'This guide is not here yet' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Booking moved', exact: true }),
    ).toHaveCount(0)
  }
})

test('a historical comparison keeps the same 36-hour booking and links to its current case', async ({
  page,
}) => {
  await page.goto('/#/changes')
  await expect(
    page.getByRole('heading', { name: 'Previously blocked' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Now allowed' })).toBeVisible()
  await expect(
    page.getByText('Booking fixture v1 · Historical', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Booking fixture v2 · Current', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('At least 48 hours’ notice', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('At least 24 hours’ notice', { exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Explore this change', exact: true })
    .click()
  await expect(
    page.getByText('36 hours remaining', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Now allowed', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Less than 24 hours', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: '36 hours · Current rule', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: '36 hours · Current rule', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Now allowed', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Back to What changed', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Previously blocked' }),
  ).toBeVisible()
})

test('the learning loop works by keyboard, at narrow widths and with reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/')
  await page.getByRole('link', { name: /Explore the story/ }).focus()
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
    .locator('.outcome-banner')
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
  await page.getByRole('link', { name: 'What changed', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Now allowed', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
})

test('return restores the actual Explore position and new destinations start at the top', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 600 })
  await page.goto('/#/explore?q=move')
  await expect(
    page.getByRole('heading', { name: 'Explore', exact: true }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 220))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(
    page.getByRole('searchbox', { name: 'Search activities' }),
  ).toHaveValue('move')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
  await page
    .getByRole('link', { name: 'Reschedule a booking', exact: true })
    .click()
  const reason = page.getByRole('button', { name: 'Why this outcome?' })
  await reason.scrollIntoViewIfNeeded()
  const previousPosition = await page.evaluate(() => window.scrollY)
  expect(previousPosition).toBeGreaterThan(0)
  expect(
    await reason.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return rect.top >= 0 && rect.bottom <= window.innerHeight
    }),
  ).toBe(true)
  await reason.click()
  await page
    .getByRole('link', { name: 'See what changed', exact: true })
    .click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.goBack()
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(previousPosition)
})

test('unavailable guide return restores the actual Explore position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 600 })
  await page.goto('/#/explore?q=move')
  await expect(
    page.getByRole('heading', { name: 'Explore', exact: true }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 220))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(220)
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '#/explore/booking?case=missing&q=move'
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
  await page.goto('/#/explore/booking?case=at-limit')
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 450))
  const previousPosition = await page.evaluate(() => window.scrollY)
  await page
    .getByRole('button', { name: 'Less than 24 hours', exact: true })
    .click()
  await expect(page).toHaveURL(/case=too-late/)
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(previousPosition)
})
