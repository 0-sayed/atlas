import { expect, test } from '@playwright/test'
import { authoredFeature, authoredSeed } from '../fixtures/authored'
const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}
test('six destinations show explicit facts, evidence and ordered repeated journey visits', async ({
  page,
  request,
}, info) => {
  const id = `destinations-saved-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}`)
  await expect(
    page.getByText(authoredSeed.purpose.text, { exact: true }),
  ).toBeVisible()
  for (const name of [
    'Start here',
    'Feature Map',
    'User Journeys',
    'Actors',
    'Rules',
    'Glossary',
  ])
    await expect(
      page
        .getByRole('navigation', { name: 'Guide navigation' })
        .getByRole('link', { name, exact: true }),
    ).toBeVisible()
  await page.getByRole('link', { name: 'Actors', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveCSS('border-top-width', '1px')
  expect(
    (await page.getByRole('searchbox').boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44)
  await expect(
    page.getByRole('heading', { name: 'Courier', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Receive the parcel', { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Rules', exact: true }).click()
  await expect(
    page.getByText(authoredSeed.rules[0].statement, { exact: true }),
  ).toBeVisible()
  await page.getByText('4 saved cases', { exact: true }).click()
  await page
    .getByRole('link', {
      name: 'Conflicting handoff · Conflicting',
      exact: true,
    })
    .click()
  await expect(page.getByRole('status')).toContainText('Conflicting')
  await page.getByRole('link', { name: 'Back to Rules', exact: true }).click()
  await expect(page).toHaveURL(/rules\?item=complete$/)
  await page.getByRole('link', { name: 'User Journeys', exact: true }).click()
  await expect(page.locator('.journey-step')).toHaveCount(2)
  await expect(page.locator('.journey-scenery > img')).toHaveCount(2)
  await expect(page.locator('.journey-step').nth(0)).toContainText(
    'Prepare the parcel',
  )
  await expect(page.locator('.journey-step').nth(1)).toContainText(
    'Receive the parcel',
  )
  await page.getByRole('link', { name: 'Glossary', exact: true }).click()
  await expect(
    page.getByText(authoredSeed.glossary[0].definition, { exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Checklist complete', exact: true })
    .click()
  await expect(page).toHaveURL(/rules\?item=complete$/)
  await page.screenshot({
    path: info.outputPath('rules-desktop.png'),
    fullPage: true,
  })
})
test('Start here shows saved purpose and evidence even before activities exist', async ({
  page,
  request,
}, info) => {
  const id = `purpose-only-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id,
          title: 'Purpose only · synthetic QA',
          purpose: authoredSeed.purpose,
          evidenceRecords: authoredSeed.evidenceRecords,
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/' + id)
  await expect(
    page.getByText(authoredSeed.purpose.text, { exact: true }),
  ).toBeVisible()
  await expect(page.locator('.claim-evidence details')).toHaveCount(0)
  await page.locator('.project-sources summary').click()
  await expect(
    page.getByText(authoredSeed.evidenceRecords[0].description, {
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'No implemented activities found',
      exact: true,
    }),
  ).toBeVisible()
})
test('each supporting destination is honest when records are absent and rejects foreign selections', async ({
  page,
  request,
}, info) => {
  const id = `destinations-empty-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id,
          title: 'Empty knowledge',
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  for (const [route, title] of [
    ['actors', 'Actors'],
    ['rules', 'Rules'],
    ['journeys', 'User Journeys'],
    ['glossary', 'Glossary'],
  ]) {
    await page.goto(`/#/projects/${id}/${route}`)
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('No saved records yet.', { exact: true }),
    ).toBeVisible()
    await page.goto(`/#/projects/${id}/${route}?item=complete`)
    await expect(
      page.getByRole('heading', {
        name: 'This record is unavailable',
        exact: true,
      }),
    ).toBeVisible()
  }
})
test('search, direct links, long facts and conflicting support survive Back without project leakage', async ({
  page,
  request,
}, info) => {
  const id = `destinations-long-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          actors: [
            ...authoredSeed.actors,
            {
              id: 'unbound',
              name: 'Unbound role ' + 'long '.repeat(25),
              description: 'x'.repeat(4000),
              evidenceIds: ['disagreement'],
            },
          ],
          glossary: [
            ...authoredSeed.glossary,
            {
              id: 'unused',
              term: 'Unreferenced term',
              definition: 'x'.repeat(4000),
              featureIds: [],
              ruleIds: [],
              evidenceIds: ['unverified'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}/actors?q=Unbound`)
  await expect(
    page.getByText('No explicit participation has been recorded.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.locator('.claim-warning')).toContainText(
    'Conflicting evidence',
  )
  await page.getByRole('searchbox').fill('not recorded')
  await expect(
    page.getByText('No matching records.', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await page.screenshot({
    path: info.outputPath('actors-long.png'),
    fullPage: true,
  })
  await page.goto(`/#/projects/${id}/glossary?item=unused`)
  await expect(
    page.getByText('No context links have been recorded.', { exact: true }),
  ).toBeVisible()
  await expect(page.locator('.claim-warning')).toContainText(
    'Uncertain evidence',
  )
  await page.setViewportSize({ width: 375, height: 800 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  const emptyId = id + '-empty'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id: emptyId,
          title: 'Empty destination',
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${emptyId}/glossary`)
  await expect(
    page.getByRole('heading', { name: 'Unreferenced term', exact: true }),
  ).toHaveCount(0)
})
test('legacy specialized activities retain supporting destination return state', async ({
  page,
  request,
}, info) => {
  const { navigationFeature } = await import('../fixtures/navigation')
  const id = `destinations-specialized-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features: [
            authoredFeature,
            {
              ...navigationFeature,
              actorIds: ['courier'],
              ruleIds: ['complete'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(`/#/projects/${id}/actors?q=Courier`)
  await page
    .getByRole('link', { name: navigationFeature.title, exact: true })
    .click()
  await page.getByRole('link', { name: 'Back to Actors', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('Courier')
})

test('directly selected rules and journeys remain in their index when search does not match', async ({
  page,
  request,
}, info) => {
  const id = `selected-index-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id },
      })
    ).status(),
  ).toBe(201)
  for (const [destination, label, record] of [
    ['rules', 'Checklist complete', 'complete'],
    ['journeys', 'Parcel handoff', 'delivery'],
  ]) {
    await page.goto(
      `/#/projects/${id}/${destination}?q=unmatched&item=${record}`,
    )
    await expect(
      page.getByRole('heading', { name: label, exact: true }),
    ).toBeVisible()
    const index = page.locator('.knowledge-index')
    await expect(
      index.getByRole('link', { name: label, exact: true }),
    ).toHaveAttribute('aria-current', 'true')
    await expect(index.getByRole('link')).toHaveCount(1)
  }
})
