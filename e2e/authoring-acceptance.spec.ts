import { expect, test } from '@playwright/test'
import { authoredFeature, authoredSeed } from '../fixtures/authored'
import { validateDocument } from '../shared/contracts'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('scoped authoring changes refresh facts, evidence and registered art while preserving the selected case and unrelated activity', async ({
  page,
  request,
}, info) => {
  const id = `authoring-lifecycle-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const unrelated = {
    ...authoredFeature,
    id: 'inventory',
    title: 'Check inventory · synthetic QA',
  }
  const created = await request.post('/api/v1/projects', {
    headers,
    data: { ...authoredSeed, id, features: [authoredFeature, unrelated] },
  })
  expect(created.status()).toBe(201)
  const initial = validateDocument(await created.json())
  await page.goto(
    `/#/projects/${id}/explore/handoff?case=incomplete&from=rules&item=complete`,
  )
  await expect(
    page.locator('.authored-scene').getByRole('status'),
  ).toContainText('Blocked')

  const uploaded = await request.post(`/api/v1/projects/${id}/assets`, {
    headers,
    data: {
      contractVersion: 2,
      expectedRevision: initial.revision,
      id: 'updated-art',
      mediaType: 'image/png',
      provenance: 'Synthetic QA pixel; no source-product artwork claim.',
      base64:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=',
    },
  })
  expect(uploaded.status()).toBe(201)
  const withAsset = validateDocument(await uploaded.json())
  const evidence = {
    ...authoredSeed.evidenceRecords[0],
    sourceRevision: 'demo-2',
    description:
      'Corrected synthetic checklist evidence; no real-source claim.',
  }
  // Evidence records use an ID; inline feature evidence does not.
  const { id: evidenceId, ...inlineEvidence } = evidence
  const updatedFeature = {
    ...authoredFeature,
    evidence: inlineEvidence,
    assetIds: ['updated-art'],
    cases: authoredFeature.cases.map((c) =>
      c.id === 'incomplete'
        ? {
            ...c,
            stepIds: ['prepare', 'receive'],
            conditions: [{ ruleId: 'complete', state: 'met' as const }],
            outcome: {
              status: 'allowed' as const,
              result: 'Corrected handoff recorded',
              reason: 'The corrected checklist records every required entry.',
            },
          }
        : c,
    ),
  }
  const updated = await request.post(`/api/v1/projects/${id}/changes`, {
    headers,
    data: {
      contractVersion: 2,
      expectedRevision: withAsset.revision,
      upsertFeatures: [
        updatedFeature,
        { ...authoredFeature, id: 'receipt', title: 'Record a receipt' },
      ],
      upsertRules: [
        {
          ...authoredSeed.rules[0],
          statement: 'The corrected handoff requires every manifest entry.',
        },
      ],
      upsertEvidenceRecords: [{ ...inlineEvidence, id: evidenceId }],
    },
  })
  expect(updated.status()).toBe(201)
  const current = validateDocument(await updated.json())
  expect(current.revision).toBe(3)
  expect(current.features.find((f) => f.id === unrelated.id)).toEqual(
    initial.features.find((f) => f.id === unrelated.id),
  )
  for (const key of [
    'actors',
    'areas',
    'journeys',
    'glossary',
    'relations',
  ] as const)
    expect(current[key]).toEqual(initial[key])

  await page.getByRole('button', { name: 'Refresh guide', exact: true }).click()
  await expect(
    page.locator('.authored-scene').getByRole('status'),
  ).toContainText('Allowed')
  await expect(
    page.getByRole('heading', {
      name: 'Corrected handoff recorded',
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Incomplete handoff', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/case=incomplete&from=rules&item=complete$/)
  await expect(
    page
      .locator('.navigation-rules')
      .getByText('The corrected handoff requires every manifest entry.', {
        exact: true,
      }),
  ).toBeVisible()
  const art = page.getByRole('img', {
    name: 'Hand off a parcel illustration',
    exact: true,
  })
  await expect(art).toHaveAttribute(
    'src',
    `/api/v1/projects/${id}/assets/updated-art`,
  )
  await expect
    .poll(() => art.evaluate((img) => (img as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0)
  const sources = page.locator('details.project-sources')
  await sources.locator('summary').click()
  await expect(
    sources.getByText(evidence.description, { exact: true }).first(),
  ).toBeVisible()
  await expect(
    sources.getByText('demo-2', { exact: true }).first(),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Back to Rules', exact: true }).click()
  await expect(page).toHaveURL(/rules\?item=complete$/)
  await expect(
    page.getByRole('link', {
      name: 'Incomplete handoff · Allowed',
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('link', { name: unrelated.title, exact: true }).click()
  await expect(
    page.locator('.authored-scene').getByRole('status'),
  ).toContainText('Allowed')
  await expect(
    page.getByRole('heading', { name: 'Parcel handed over', exact: true }),
  ).toBeVisible()
  await expect(page.locator('.registered-art')).toHaveCount(0)
  await page.goto(`/#/projects/${id}/explore?q=receipt`)
  await expect(
    page.getByRole('link', { name: 'Record a receipt', exact: true }),
  ).toBeVisible()

  for (const [patch, status] of [
    [{ expectedRevision: 1, title: 'Stale edit must not persist' }, 409],
    [
      {
        expectedRevision: 3,
        removeRuleIds: ['complete'],
        title: 'Invalid removal',
      },
      400,
    ],
  ] as const) {
    const rejected = await request.post(`/api/v1/projects/${id}/changes`, {
      headers,
      data: { contractVersion: 2, ...patch },
    })
    expect(rejected.status()).toBe(status)
    expect(
      validateDocument(
        await (await request.get(`/api/v1/projects/${id}`)).json(),
      ),
    ).toEqual(current)
  }
})

test('atomic removals invalidate old knowledge links without changing another project with identical IDs', async ({
  page,
  request,
}, info) => {
  const id = `authoring-removal-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const otherId = id + '-other'
  const survivor = {
    ...authoredFeature,
    id: 'inventory',
    title: 'Retained inventory activity',
    purpose: 'Explain the saved inventory count.',
    actorIds: [],
    ruleIds: [],
    steps: [],
    cases: [],
  }
  const seed = { ...authoredSeed, features: [authoredFeature, survivor] }
  for (const projectId of [id, otherId])
    expect(
      (
        await request.post('/api/v1/projects', {
          headers,
          data: { ...seed, id: projectId },
        })
      ).status(),
    ).toBe(201)
  const initial = validateDocument(
    await (await request.get(`/api/v1/projects/${id}`)).json(),
  )
  const otherBefore = validateDocument(
    await (await request.get(`/api/v1/projects/${otherId}`)).json(),
  )
  await page.goto(`/#/projects/${id}/rules?item=complete`)
  await expect(
    page.getByRole('heading', { name: 'Checklist complete', exact: true }),
  ).toBeVisible()
  const removed = await request.post(`/api/v1/projects/${id}/changes`, {
    headers,
    data: {
      contractVersion: 2,
      expectedRevision: initial.revision,
      removeFeatureIds: ['handoff'],
      removeActorIds: ['dispatcher', 'courier'],
      removeRuleIds: ['complete'],
      removeJourneyIds: ['delivery'],
      removeGlossaryIds: ['checklist'],
    },
  })
  expect(removed.status()).toBe(201)
  const current = validateDocument(await removed.json())
  expect(current.features).toEqual([survivor])
  expect(current.evidenceRecords).toEqual(initial.evidenceRecords)
  expect(current.purpose).toEqual(initial.purpose)
  expect(current.areas).toEqual(initial.areas)
  await page.getByRole('button', { name: 'Refresh guide', exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: 'This record is unavailable',
      exact: true,
    }),
  ).toBeVisible()
  for (const route of [
    'actors?item=courier',
    'rules?item=complete',
    'journeys?item=delivery',
    'glossary?item=checklist',
  ]) {
    await page.goto(`/#/projects/${id}/${route}`)
    await expect(
      page.getByRole('heading', {
        name: 'This record is unavailable',
        exact: true,
      }),
    ).toBeVisible()
  }
  await page.goto(`/#/projects/${id}/explore/handoff?case=incomplete`)
  await expect(
    page.getByRole('heading', {
      name: 'This guide is not here yet',
      exact: true,
    }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/map?selected=handoff`)
  await expect(
    page.getByText('This map location is unavailable.', { exact: true }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore?q=handoff`)
  await expect(
    page.getByRole('heading', {
      name: 'No activity matched “handoff”',
      exact: true,
    }),
  ).toBeVisible()
  await page.goto(`/#/projects/${id}/explore/inventory`)
  await expect(
    page.getByRole('heading', { name: survivor.title, exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('No saved cases have been recorded.', { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  // Identical titles are expected: project identities, not labels, scope knowledge.
  await page.locator(`a[href="#/projects/${otherId}"]`).click()
  await expect(page).toHaveURL(new RegExp(`/projects/${otherId}$`))
  await page.goto(`/#/projects/${otherId}/rules?item=complete`)
  await expect(
    page.getByRole('heading', { name: 'Checklist complete', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Incomplete handoff · Blocked', exact: true })
    .click()
  await expect(
    page.locator('.authored-scene').getByRole('status'),
  ).toContainText('Blocked')
  await page.goBack()
  await expect(page).toHaveURL(/rules\?item=complete$/)
  expect(
    validateDocument(
      await (await request.get(`/api/v1/projects/${otherId}`)).json(),
    ),
  ).toEqual(otherBefore)
  expect(
    validateDocument(
      await (await request.get(`/api/v1/projects/${id}`)).json(),
    ),
  ).toEqual(current)
})
