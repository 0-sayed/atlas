import { expect, test } from '@playwright/test'
import { authoredSeed } from '../fixtures/authored'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}
const id = 'sources-demo'
test.beforeAll(async ({ request }) => {
  if ((await request.get('/api/v1/projects/' + id)).ok()) return
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id },
      })
    ).status(),
  ).toBe(201)
})

test('six destinations omit repeated source blocks and keep shared sources available once', async ({
  page,
  request,
}) => {
  const before = await (await request.get('/api/v1/projects/' + id)).json()
  let writes = 0
  page.on('request', (r) => {
    if (r.url().includes('/api/') && r.method() !== 'GET') writes++
  })
  for (const route of [
    '',
    '/map?group=area%3Adispatch',
    '/actors',
    '/rules',
    '/journeys',
    '/glossary',
  ]) {
    await page.goto('/#/projects/' + id + route)
    await expect(page.locator('.claim-evidence details')).toHaveCount(0)
    const sources = page.locator('details.project-sources')
    await expect(sources).toHaveCount(1)
    await expect(sources).not.toHaveAttribute('open')
    await expect(sources.locator('.project-source')).toHaveCount(3)
    const url = page.url()
    await sources.locator('summary').click()
    const rows = await sources
      .locator('summary, .project-source')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect()
          return { top: box.top, bottom: box.bottom }
        }),
      )
    for (let i = 1; i < rows.length; i++)
      expect(rows[i].top).toBeGreaterThanOrEqual(rows[i - 1].bottom)
    await expect(page).toHaveURL(url)
    await expect(
      sources.locator('[data-source-id="source"]').getByRole('heading', {
        name: authoredSeed.evidenceRecords[0].source,
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      sources
        .locator('[data-source-id="source"]')
        .getByText(authoredSeed.evidenceRecords[0].scope, { exact: true }),
    ).toBeVisible()
    await expect(sources.getByText('demo-1', { exact: true })).toHaveCount(3)
    await expect(
      sources.getByText('Case: Hand off a parcel — Unverified handoff', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      sources.getByText('Case: Hand off a parcel — Conflicting handoff', {
        exact: true,
      }),
    ).toBeVisible()
    await sources.locator('summary').click()
    await expect(sources).not.toHaveAttribute('open')
  }
  expect(writes).toBe(0)
  expect(await (await request.get('/api/v1/projects/' + id)).json()).toEqual(
    before,
  )
})

test('activity facts and attached uncertainty remain visible while source details are optional', async ({
  page,
}) => {
  await page.goto(
    '/#/projects/' +
      id +
      '/explore/handoff?case=unknown&from=rules&item=complete',
  )
  await expect(page.getByRole('status')).toContainText('Unknown')
  await expect(
    page
      .locator('.claim-warning')
      .filter({ hasText: 'Checklist state has not been established.' }),
  ).toBeVisible()
  await expect(page.locator('.claim-evidence details')).toHaveCount(0)
  const url = page.url()
  const sources = page.locator('details.project-sources')
  await sources.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(sources).toHaveAttribute('open')
  await expect(page).toHaveURL(url)
  await page.keyboard.press('Enter')
  await expect(sources).not.toHaveAttribute('open')
  await expect(sources.locator('summary')).toBeFocused()
  await page
    .getByRole('button', { name: 'Conflicting handoff', exact: true })
    .click()
  await expect(
    page.locator('.claim-warning').filter({
      hasText: 'The inspected examples record incompatible outcomes.',
    }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toContainText('Conflicting')
  await expect(
    page.getByText('Conflicting recorded outcomes', { exact: true }),
  ).toBeVisible()
})

test('source context stays within its project and fits long text at narrow widths', async ({
  page,
  request,
}) => {
  const long = 'W'.repeat(160)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id: 'sources-long',
          title: 'Long source · synthetic QA',
          purpose: { text: 'Long context', evidenceIds: ['long'] },
          evidenceRecords: [
            {
              ...authoredSeed.evidenceRecords[0],
              id: 'long',
              source: long,
              description: 'D'.repeat(4000),
              scope: 'S'.repeat(4000),
            },
          ],
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id: 'sources-empty',
          title: 'No sources',
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('/#/projects/sources-long')
  await page.locator('.project-sources summary').click()
  await expect(
    page
      .locator('.project-sources')
      .getByRole('heading', { name: long, exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page
    .getByRole('combobox', {
      name: 'Choose project: Long source · synthetic QA',
      exact: true,
    })
    .selectOption('sources-empty')
  await expect(page).toHaveURL(/projects\/sources-empty$/)
  await expect(page.locator('.project-sources')).toHaveCount(0)
  await expect(page.getByText('Long context', { exact: true })).toHaveCount(0)
})
