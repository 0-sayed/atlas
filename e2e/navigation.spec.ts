import { expect, test } from '@playwright/test'
import { navigationFeature, navigationSeed } from '../fixtures/navigation'
import { approvalFeature } from '../fixtures/approval'
import { seed } from '../fixtures/booking'
const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('related navigation retains Explore search and return position without the previous case', async ({
  page,
  request,
}) => {
  const id = `navigation-related-return-${Date.now()}`
  const related = {
    ...navigationFeature,
    id: 'another-guide',
    title: 'Open another saved guide',
    cases: [{ ...navigationFeature.cases[0], id: 'another-case' }],
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...navigationSeed,
          id,
          features: [navigationFeature, related],
          relations: [
            {
              id: 'related-guides',
              from: 'navigation',
              to: related.id,
              kind: 'related',
            },
          ],
        },
      })
    ).ok(),
  ).toBe(true)

  await page.setViewportSize({ width: 375, height: 400 })
  await page.goto(`/#/projects/${id}/explore?q=guide`)
  await expect(
    page.getByRole('link', { name: navigationFeature.title, exact: true }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const exploreScroll = await page.evaluate(() => window.scrollY)
  expect(exploreScroll).toBeGreaterThan(0)
  await page
    .getByRole('link', { name: navigationFeature.title, exact: true })
    .click()
  await page.getByRole('link', { name: related.title, exact: false }).click()
  await expect(page.getByRole('heading', { name: related.title })).toBeVisible()
  const relatedParams = new URL(page.url().split('#')[1], 'http://atlas.test')
    .searchParams
  expect(relatedParams.get('from')).toBe('explore')
  expect(relatedParams.get('q')).toBe('guide')
  expect(relatedParams.has('case')).toBe(false)

  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('guide')
  expect(await page.evaluate(() => window.scrollY)).toBe(exploreScroll)
})

test('navigation cases support scoped search, direct links, Back, evidence and keyboard', async ({
  page,
  request,
}, testInfo) => {
  const id = 'navigation-reader'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...navigationSeed,
          id,
          features: [navigationFeature, ...seed.features, approvalFeature],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.goto(`/#/projects/${id}/explore?q=saved`)
  await page
    .getByRole('link', { name: navigationFeature.title, exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Guide opens', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Selected saved case', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Missing guide', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Guide unavailable', exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Missing guide', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Guide opens', exact: true }),
  ).toBeVisible()
  await page.getByText('Source and evidence', { exact: true }).click()
  await expect(
    page.getByText('Authored navigation fixture', { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('saved')
  await page.screenshot({
    path: testInfo.outputPath('navigation-desktop.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 375, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`/#/projects/${id}/explore/navigation?case=saved&from=start`)
  const unknown = page.getByRole('button', {
    name: 'Unverified destination',
    exact: true,
  })
  await page.keyboard.press('Tab')
  await unknown.focus()
  await expect(unknown).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('Unknown')
  await expect(
    page.getByRole('heading', { name: 'Destination not established' }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('navigation-mobile.png'),
    fullPage: true,
  })
  await page
    .getByRole('link', { name: 'Back to Start here', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Start here', exact: true }),
  ).toBeVisible()
})

test('navigation snapshots preserve authored outcomes and handle empty or missing cases', async ({
  page,
  request,
}) => {
  const id = 'navigation-history'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...navigationSeed, id },
      })
    ).ok(),
  ).toBe(true)
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: [
            {
              ...navigationFeature,
              rules: ['A new saved destination is used.'],
              evidence: {
                ...navigationFeature.evidence,
                sourceRevision: 'fixture-' + 'a'.repeat(64),
              },
              cases: [
                { ...navigationFeature.cases[0], result: 'New guide opens' },
              ],
            },
          ],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(`/#/projects/${id}/changes`)
  await expect(page.getByText('Source-supported', { exact: true })).toHaveCount(
    0,
  )
  const history = page.locator('.saved-change').filter({
    has: page.getByRole('heading', {
      name: navigationFeature.title,
      exact: true,
    }),
  })
  const disclosures = history.getByText('Recorded rules, cases and evidence', {
    exact: true,
  })
  await expect(disclosures).toHaveCount(2)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  for (const disclosure of await disclosures.all()) await disclosure.click()
  await expect(history.getByText('Guide opens', { exact: true })).toBeVisible()
  await expect(
    history.getByText('New guide opens', { exact: true }),
  ).toBeVisible()
  await expect(
    history.getByText('Only saved guides can be opened.', { exact: true }),
  ).toBeVisible()
  await expect(history.getByText(/Action: Open guide/).first()).toBeVisible()
  await expect(history.getByText(/Outcome: unknown/)).toBeVisible()
  await history.getByRole('link', { name: 'Explore current activity' }).click()
  await expect(
    page.getByRole('heading', { name: 'New guide opens', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Back to What changed', exact: true })
    .click()
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 2,
          upsertFeatures: [{ ...navigationFeature, cases: [] }],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.goto(`/#/projects/${id}/explore/navigation`)
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'No saved cases', exact: true }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/navigation?case=missing`)
  await expect(
    page.getByRole('heading', {
      name: 'This guide is not here yet',
      exact: true,
    }),
  ).toBeVisible()
})

test('valid long navigation rules and case labels fit a narrow viewport', async ({
  page,
  request,
}) => {
  const id = 'navigation-long-text'
  const label = 'x'.repeat(160)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...navigationSeed,
          id,
          features: [
            {
              ...navigationFeature,
              rules: ['https://example.test/' + 'a'.repeat(160)],
              cases: [{ ...navigationFeature.cases[0], label }],
            },
          ],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(`/#/projects/${id}/explore/navigation`)
  const choice = page.getByRole('button', { name: label, exact: true })
  await expect(choice).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.keyboard.press('Tab')
  await choice.focus()
  await expect(choice).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Guide opens', exact: true }),
  ).toBeVisible()
})

test('evidence corrections remain visible in history without claiming a behavior change', async ({
  page,
  request,
}) => {
  const id = 'navigation-correction'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...navigationSeed, id },
      })
    ).ok(),
  ).toBe(true)
  const description =
    'Correction: the example requires a saved activity as well as a guide.'
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: 1,
          upsertFeatures: [
            {
              ...navigationFeature,
              evidence: { ...navigationFeature.evidence, description },
            },
          ],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.goto(`/#/projects/${id}/changes`)
  await expect(
    page.getByText('Evidence updated', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Recorded behavior changed', { exact: true }),
  ).toHaveCount(0)
  const disclosures = page.getByText('Recorded rules, cases and evidence', {
    exact: true,
  })
  await expect(disclosures).toHaveCount(2)
  await disclosures.nth(0).click()
  await disclosures.nth(1).click()
  await expect(
    page.getByText(navigationFeature.evidence.description, { exact: true }),
  ).toBeVisible()
  await expect(page.getByText(description, { exact: true })).toBeVisible()
  await expect(page.getByText('Guide opens', { exact: true })).toHaveCount(2)
})
