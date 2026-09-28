import { expect, test, type TestInfo } from '@playwright/test'
import { navigationFeature } from '../fixtures/navigation'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

const projectId = (base: string, testInfo: TestInfo) =>
  `${base}-${testInfo.parallelIndex}-${testInfo.retry}`

test('two saved projects share navigation but retain distinct live illustration settings', async ({
  page,
  request,
}, testInfo) => {
  const skyId = projectId('visual-sky', testInfo)
  const peachId = projectId('visual-peach', testInfo)
  for (const [id, title, illustration, accent] of [
    [skyId, 'Sky project', 'compass', 'sky'],
    [peachId, 'Peach project', 'parcel', 'peach'],
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

  await page.goto(`/#/projects/${skyId}`)
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
  await expect(page).toHaveURL(new RegExp(`${skyId}/explore$`))
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

  const update = await request.post(`/api/v1/projects/${peachId}/changes`, {
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
  const longId = projectId('visual-long', testInfo)
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
      id: longId,
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
  await page.goto(`/#/projects/${longId}`)
  await expect(
    page.getByRole('link', { name: longLabel, exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#workspace-content')).toBeFocused()
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
}, testInfo) => {
  const selectionId = projectId('visual-essential-selection', testInfo)
  const response = await request.post('/api/v1/projects', {
    headers,
    data: {
      contractVersion: 1,
      id: selectionId,
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
  await page.goto(`/#/projects/${selectionId}`)
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

test('expanded Start activities survive return navigation without leaking to another project', async ({
  page,
  request,
}, testInfo) => {
  const firstId = projectId('visual-expanded-one', testInfo)
  const secondId = projectId('visual-expanded-two', testInfo)
  for (const id of [firstId, secondId]) {
    const response = await request.post('/api/v1/projects', {
      headers,
      data: {
        contractVersion: 1,
        id,
        title: id,
        relations: [],
        features: Array.from({ length: 8 }, (_, index) => ({
          ...navigationFeature,
          id: `activity-${index}`,
          title: `Activity ${index}`,
        })),
      },
    })
    expect(response.ok()).toBe(true)
  }

  await page.goto(`/#/projects/${firstId}`)
  await page.getByRole('button', { name: /Show more activities/ }).click()
  await expect(page.locator('.island-link')).toHaveCount(8)
  const eighth = page.locator('.island-link').nth(7)
  await eighth.scrollIntoViewIfNeeded()
  const originalScroll = await page.evaluate(() => window.scrollY)
  expect(originalScroll).toBeGreaterThan(0)
  await eighth.click()
  await page.getByRole('link', { name: 'Back to Start here' }).click()
  await expect(page.locator('.island-link')).toHaveCount(8)
  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBeGreaterThanOrEqual(originalScroll - 2)

  await page.locator('.island-link').nth(7).click()
  await page.goBack()
  await expect(page.locator('.island-link')).toHaveCount(8)

  await page.goto(`/#/projects/${secondId}`)
  await expect(page.locator('.island-link')).toHaveCount(6)
  await page.goto(`/#/projects/${firstId}`)
  await expect(page.locator('.island-link')).toHaveCount(8)
})

test('Start tiles identify each activity evidence status', async ({
  page,
  request,
}, testInfo) => {
  const evidenceId = projectId('visual-evidence-status', testInfo)
  const response = await request.post('/api/v1/projects', {
    headers,
    data: {
      contractVersion: 1,
      id: evidenceId,
      title: 'Evidence status',
      relations: [],
      features: [
        ['demo', 'Demo activity'],
        ['uncertain', 'Uncertain activity'],
        ['supported', 'Supported activity'],
      ].map(([status, title]) => ({
        ...navigationFeature,
        id: status,
        title,
        evidence: { ...navigationFeature.evidence, status },
      })),
    },
  })
  expect(response.ok()).toBe(true)

  await page.goto(`/#/projects/${evidenceId}`)
  for (const [title, label] of [
    ['Demo activity', 'Illustrative fixture'],
    ['Uncertain activity', 'Uncertain evidence'],
    ['Supported activity', 'Source-supported'],
  ]) {
    await expect(
      page.locator('.island-link').filter({ hasText: title }).getByText(label),
    ).toBeVisible()
  }
})
