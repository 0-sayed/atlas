import { expect, test } from '@playwright/test'
import { authoredFeature, authoredSeed } from '../fixtures/authored'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}
test('authored outcome, conditions and steps remain separated at desktop and narrow widths', async ({
  page,
  request,
}, info) => {
  const id = `authored-spacing-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id },
      })
    ).status(),
  ).toBe(201)
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const selected of ['ready', 'incomplete', 'unknown', 'conflict']) {
      await page.goto(`/#/projects/${id}/explore/handoff?case=${selected}`)
      await expect(page.getByRole('status')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const scene = page.locator('.authored-scene')
      const outcome = scene.getByRole('status')
      const conditions = scene.getByRole('heading', {
        name: 'Conditions in this case',
        exact: true,
      })
      const steps = scene.getByRole('heading', {
        name: 'Recorded steps',
        exact: true,
      })
      const outcomeBox = (await outcome.boundingBox())!
      const conditionsBox = (await conditions.boundingBox())!
      const listBox = (await scene
        .locator('.authored-conditions')
        .boundingBox())!
      const stepsBox = (await steps.boundingBox())!
      expect(
        conditionsBox.y - (outcomeBox.y + outcomeBox.height),
      ).toBeGreaterThanOrEqual(16)
      expect(
        listBox.y - (conditionsBox.y + conditionsBox.height),
      ).toBeGreaterThanOrEqual(8)
      expect(stepsBox.y - (listBox.y + listBox.height)).toBeGreaterThanOrEqual(
        16,
      )
      const iconBox = (await outcome.locator('.atlas-icon').boundingBox())!
      const labelBox = (await outcome.locator('.eyebrow').boundingBox())!
      expect(
        Math.abs(
          iconBox.y + iconBox.height / 2 - labelBox.y - labelBox.height / 2,
        ),
      ).toBeLessThanOrEqual(1)
      expect(labelBox.x - (iconBox.x + iconBox.width)).toBeGreaterThanOrEqual(8)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
    }
  }
})
test('authored relationships retain Explore filters and discard another feature case', async ({
  page,
  request,
}, info) => {
  const id = `authored-related-browser-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const next = {
    ...authoredFeature,
    id: 'next-handoff',
    title: 'Next parcel activity',
    cases: [authoredFeature.cases[0]],
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features: [authoredFeature, next],
          relations: [
            {
              id: 'handoff-blocks',
              from: 'handoff',
              to: next.id,
              kind: 'blocks',
              evidenceIds: ['source'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(
    `/#/projects/${id}/explore/handoff?case=incomplete&from=explore&q=parcel`,
  )
  await expect(page.getByRole('status')).toContainText('Blocked')
  await page.getByText('Source and evidence', { exact: true }).click()
  await page.getByRole('link', { name: next.title, exact: true }).click()
  await expect(
    page.getByRole('heading', { name: next.title, exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toContainText('Allowed')
  const relatedQuery = new URLSearchParams(page.url().split('?')[1])
  expect(relatedQuery.get('from')).toBe('explore')
  expect(relatedQuery.get('q')).toBe('parcel')
  expect(relatedQuery.has('case')).toBe(false)
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('parcel')
})
test('authored cases round-trip actors, conditions, outcome, evidence, direct links and Back', async ({
  page,
  request,
}, testInfo) => {
  const id = `authored-browser-${testInfo.parallelIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}`
  const created = await request.post('/api/v1/projects', {
    headers,
    data: { ...authoredSeed, id },
  })
  expect(created.status()).toBe(201)
  await page.goto(`/#/projects/${id}/explore?q=parcel`)
  await page
    .getByRole('link', { name: authoredFeature.title, exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toContainText('Allowed')
  await expect(
    page.getByText('The required checklist is complete.', { exact: true }),
  ).toBeVisible()
  await expect(page.locator('[data-step-id="receive"]')).toHaveAttribute(
    'data-active',
    'true',
  )
  await page
    .getByRole('button', { name: 'Incomplete handoff', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Blocked')
  await expect(
    page.getByText('The required checklist is incomplete.', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toBeInViewport()
  await expect(page.locator('[data-step-id="receive"]')).toHaveAttribute(
    'data-active',
    'false',
  )
  await expect(page.getByText('Not met', { exact: true })).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Incomplete handoff', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()
  await expect(page.getByRole('status')).toContainText('Allowed')
  await page
    .getByRole('button', { name: 'Conflicting handoff', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Conflicting')
  await expect(page.getByRole('status')).toBeInViewport()
  await expect(
    page.locator('.claim-warning').filter({
      hasText: 'The inspected examples record incompatible outcomes.',
    }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('authored-conflicting-desktop.png'),
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('parcel')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(
    `/#/projects/${id}/explore/handoff?case=incomplete&from=start`,
  )
  const unknown = page.getByRole('button', {
    name: 'Unverified handoff',
    exact: true,
  })
  await page.keyboard.press('Tab')
  await unknown.focus()
  await expect(unknown).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('Unknown')
  await expect(page.getByRole('status')).toBeInViewport()
  await expect(
    page.getByText('No reason has been recorded.', { exact: true }),
  ).toBeVisible()
  await expect(
    page
      .locator('.claim-warning')
      .filter({ hasText: 'Checklist state has not been established.' }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('authored-unknown-narrow.png'),
    fullPage: true,
  })
  await page
    .getByRole('link', { name: 'Back to Start here', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Start here', exact: true }),
  ).toBeVisible()
})

test('sparse and long authored facts stay explicit and project scoped', async ({
  page,
  request,
}, info) => {
  const id = `authored-sparse-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const feature = {
    ...authoredFeature,
    title: 'x'.repeat(160),
    purpose: 'x'.repeat(4000),
    actorIds: [],
    ruleIds: [],
    steps: [],
    cases: [],
    assetIds: [],
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features: [feature],
          journeys: [],
          glossary: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}/explore/handoff`)
  await expect(
    page.getByText('No saved cases have been recorded.', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('No participating actors have been recorded.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByText('No ordered steps have been recorded.', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('No conditions have been recorded.', { exact: true }),
  ).toBeVisible()
  await page.setViewportSize({ width: 375, height: 800 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.goto(`/#/projects/${id}/explore/handoff?case=foreign`)
  await expect(
    page.getByRole('heading', { name: 'This guide is not here yet' }),
  ).toBeVisible()
  const otherId = id + '-other'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id: otherId },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${otherId}/explore/handoff?case=ready`)
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/handoff`)
  await expect(
    page.getByText('No saved cases have been recorded.', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toHaveCount(0)
})

test('160 activities remain reachable by search within the local browser budget', async ({
  page,
  request,
}, testInfo) => {
  const id = `authored-capacity-browser-${testInfo.parallelIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}`
  const features = Array.from({ length: 160 }, (_, i) => ({
    ...authoredFeature,
    id: `activity-${i + 1}`,
    title: `Parcel activity ${i + 1}`,
  }))
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features: features.slice(0, 100),
          journeys: [],
          glossary: [],
        },
      })
    ).status(),
  ).toBe(201)
  const updated = await request.post(`/api/v1/projects/${id}/changes`, {
    headers,
    data: {
      contractVersion: 2,
      expectedRevision: 1,
      upsertFeatures: features.slice(100),
    },
  })
  expect(updated.status()).toBe(201)
  expect(Buffer.byteLength(await updated.text())).toBeLessThanOrEqual(
    1024 * 1024,
  )
  const start = performance.now()
  await page.goto(`/#/projects/${id}/explore`)
  await expect(
    page.getByRole('link', { name: 'Parcel activity 160', exact: true }),
  ).toBeVisible()
  const loadMs = performance.now() - start
  const searchStart = performance.now()
  await page.getByRole('searchbox').fill('activity 160')
  await expect(page.locator('.collection-card')).toHaveCount(1)
  const searchMs = performance.now() - searchStart
  const detailStart = performance.now()
  await page
    .getByRole('link', { name: 'Parcel activity 160', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  const detailMs = performance.now() - detailStart
  expect(loadMs).toBeLessThanOrEqual(3000)
  expect(searchMs).toBeLessThanOrEqual(3000)
  expect(detailMs).toBeLessThanOrEqual(3000)
  await testInfo.attach('local-capacity-timings', {
    body: JSON.stringify({ loadMs, searchMs, detailMs }),
    contentType: 'application/json',
  })
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Parcel activity 160', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Back to Explore', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('activity 160')
})

test('registered art failure preserves authored outcomes and long content stays inside its panels', async ({
  page,
  request,
}, testInfo) => {
  const id = `authored-art-browser-${testInfo.parallelIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}`
  const feature = {
    ...authoredFeature,
    steps: authoredFeature.steps.map((s) => ({
      ...s,
      description: 'x'.repeat(4000),
    })),
    cases: [
      {
        ...authoredFeature.cases[0],
        label: 'x'.repeat(160),
        outcome: {
          ...authoredFeature.cases[0].outcome,
          reason: 'r'.repeat(4000),
        },
      },
    ],
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id, features: [feature] },
      })
    ).status(),
  ).toBe(201)
  expect(
    (
      await request.post(`/api/v1/projects/${id}/assets`, {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 1,
          id: 'parcel-image',
          mediaType: 'image/png',
          provenance: 'Synthetic test pixel',
          base64:
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=',
        },
      })
    ).status(),
  ).toBe(201)
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 2,
          upsertFeatures: [{ ...feature, assetIds: ['parcel-image'] }],
        },
      })
    ).status(),
  ).toBe(201)
  await page.route(`**/api/v1/projects/${id}/assets/parcel-image`, (route) =>
    route.fulfill({ status: 404 }),
  )
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.goto(`/#/projects/${id}/explore/handoff?case=ready`)
  await expect(
    page.getByText('Illustration unavailable', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  const contained = await page.locator('.atlas-panel').evaluateAll((panels) =>
    panels.every((panel) => {
      const box = panel.getBoundingClientRect()
      return [...panel.children].every((child) => {
        const rect = child.getBoundingClientRect()
        return (
          rect.left >= box.left &&
          rect.right <= box.right + 1 &&
          rect.bottom <= box.bottom + 1
        )
      })
    }),
  )
  expect(contained).toBe(true)
  await page.setViewportSize({ width: 375, height: 800 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('authored-long-narrow.png'),
    fullPage: true,
  })
})

test('one unchanged authored renderer explains a second domain from saved facts', async ({
  page,
  request,
}, info) => {
  const id = `support-domain-demo-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const source = {
    ...authoredSeed,
    id,
    title: 'Support Lab · synthetic',
    purpose: {
      text: 'Explain illustrative support request resolution.',
      evidenceIds: ['source'],
    },
    actors: [
      { id: 'dispatcher', name: 'Support agent', evidenceIds: ['source'] },
      { id: 'courier', name: 'Requester', evidenceIds: ['source'] },
    ],
    rules: [
      {
        ...authoredSeed.rules[0],
        title: 'Resolution recorded',
        statement:
          'A resolution must be recorded before a request can be closed.',
      },
    ],
    areas: [{ ...authoredSeed.areas[0], title: 'Support' }],
    journeys: [],
    glossary: [],
    features: [
      {
        ...authoredFeature,
        title: 'Resolve a support request',
        actor: 'Support agent and requester',
        purpose: 'Explain recorded support resolution.',
        steps: [
          {
            ...authoredFeature.steps[0],
            title: 'Record a resolution',
            description: 'The support agent records the resolution.',
          },
          {
            ...authoredFeature.steps[1],
            title: 'Close the request',
            description: 'The requester sees the closed request.',
          },
        ],
        cases: [
          {
            ...authoredFeature.cases[0],
            label: 'Recorded resolution',
            outcome: {
              status: 'allowed',
              result: 'Request closed',
              reason: 'The resolution was recorded.',
            },
          },
        ],
      },
    ],
  }
  expect(
    (
      await request.post('/api/v1/projects', { headers, data: source })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}/explore/handoff`)
  await expect(
    page.getByRole('heading', { name: 'Request closed', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Support agent', exact: true }),
  ).toBeVisible()
  await expect(
    page
      .getByText(
        'A resolution must be recorded before a request can be closed.',
        { exact: true },
      )
      .first(),
  ).toBeVisible()
  await expect(page.getByText('Dispatcher', { exact: true })).toHaveCount(0)
  const otherId = id + '-other'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id: otherId },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${otherId}/explore/handoff?case=ready`)
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Support agent', exact: true }),
  ).toHaveCount(0)
})
