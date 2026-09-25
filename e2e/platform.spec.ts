import { expect, test } from '@playwright/test'
test('an API rule edit updates current views on refresh, preserving history', async ({
  page,
  request,
}) => {
  await page.goto('/#/explore/booking?case=at-limit')
  await expect(
    page.getByRole('heading', { name: 'Booking moved', exact: true }),
  ).toBeVisible()
  const original = await (
    await request.get('/api/v1/projects/booking-demo')
  ).json()
  const headers = {
    authorization: 'Bearer e2e-only-token-not-a-production-secret',
  }
  try {
    const update = await request.post('/api/v1/projects/booking-demo/changes', {
      headers,
      data: {
        contractVersion: 1,
        expectedRevision: original.revision,
        upsertFeatures: [{ ...original.features[0], noticeHours: 30 }],
      },
    })
    expect(update.ok()).toBeTruthy()
    await page.getByRole('button', { name: 'Refresh guide' }).click()
    await expect(page.getByLabel('Essential restrictions')).toContainText(
      '30 hours',
    )
    await expect(
      page.getByRole('heading', { name: 'Too late to move', exact: true }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'What changed', exact: true }).click()
    await expect(
      page.getByText('At least 48 hours’ notice', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('At least 30 hours’ notice', { exact: true }),
    ).toBeVisible()
  } finally {
    const current = await (
      await request.get('/api/v1/projects/booking-demo')
    ).json()
    expect(
      (
        await request.post('/api/v1/projects/booking-demo/changes', {
          headers,
          data: {
            contractVersion: 1,
            expectedRevision: current.revision,
            upsertFeatures: original.features,
          },
        })
      ).ok(),
    ).toBeTruthy()
  }
})
test('refresh failure labels retained knowledge and initial failure has a retry', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.route('**/api/v1/projects/booking-demo', (route) => route.abort())
  await page.getByRole('button', { name: 'Refresh guide' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Showing last-loaded revision',
  )
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Guide unavailable')
  await page.unroute('**/api/v1/projects/booking-demo')
  await page.getByRole('button', { name: 'Retry' }).click()
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
})
test('saved case identity, actor and registered artwork reach current UI', async ({
  page,
  request,
}) => {
  const original = await (
    await request.get('/api/v1/projects/booking-demo')
  ).json()
  const headers = {
    authorization: 'Bearer e2e-only-token-not-a-production-secret',
  }
  const assetId = `art-${Date.now()}`
  try {
    const uploaded = await request.post(
      '/api/v1/projects/booking-demo/assets',
      {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: original.revision,
          id: assetId,
          mediaType: 'image/png',
          provenance: 'Test pixel',
          base64:
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=',
        },
      },
    )
    expect(uploaded.ok()).toBeTruthy()
    const feature = {
      ...original.features[0],
      actor: 'Member',
      assetIds: [assetId],
      cases: [{ ...original.features[0].cases[0], id: 'eligible' }],
    }
    expect(
      (
        await request.post('/api/v1/projects/booking-demo/changes', {
          headers,
          data: {
            contractVersion: 1,
            expectedRevision: (await uploaded.json()).revision,
            upsertFeatures: [feature],
          },
        })
      ).ok(),
    ).toBeTruthy()
    await page.goto('/#/')
    await page.getByRole('link', { name: /Explore the story/ }).click()
    await expect(page).toHaveURL(/case=eligible/)
    await expect(
      page.getByRole('heading', { name: 'Booking moved', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('Booking / Member', { exact: true }),
    ).toBeVisible()
    const art = page.getByRole('img', {
      name: 'Reschedule a booking illustration',
    })
    await expect(art).toBeVisible()
    await expect
      .poll(() =>
        art.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBe(1)
    await page.goto('/#/explore')
    await page
      .getByRole('link', { name: 'Reschedule a booking', exact: true })
      .click()
    await expect(page).toHaveURL(/case=eligible/)
    await page.goto('/#/explore/booking')
    await expect(
      page.getByRole('heading', { name: 'Booking moved', exact: true }),
    ).toBeVisible()
    await page.route(`**/assets/${assetId}`, (route) => route.abort())
    await page.reload()
    await expect(
      page.getByText('Illustration unavailable', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Booking moved', exact: true }),
    ).toBeVisible()
  } finally {
    const current = await (
      await request.get('/api/v1/projects/booking-demo')
    ).json()
    expect(
      (
        await request.post('/api/v1/projects/booking-demo/changes', {
          headers,
          data: {
            contractVersion: 1,
            expectedRevision: current.revision,
            upsertFeatures: original.features,
          },
        })
      ).ok(),
    ).toBeTruthy()
  }
})
