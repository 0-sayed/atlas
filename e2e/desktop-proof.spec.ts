import { expect, test } from '@playwright/test'
import { navigationFeature } from '../fixtures/navigation'
import { publishingStudioSeed } from '../fixtures/publishing-studio'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('desktop proof has a shared header and separate content-fitting overview surfaces', async ({
  page,
  request,
}, testInfo) => {
  const id = `desktop-proof-${testInfo.parallelIndex}-${testInfo.retry}`
  const response = await request.post('/api/v1/projects', {
    headers,
    data: { ...publishingStudioSeed, id },
  })
  expect(response.ok()).toBe(true)
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.goto(`/#/projects/${id}`)
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Atlas home' }),
  ).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const header = await page.getByRole('banner').boundingBox()
  const logo = await page.locator('.brand-mark .atlas-icon').boundingBox()
  expect(header!.height).toBeLessThanOrEqual(84)
  expect(logo!.width).toBeLessThanOrEqual(42)
  expect(logo!.height).toBeLessThanOrEqual(42)
  const typography = await page.evaluate(() => ({
    heading: getComputedStyle(document.querySelector('#page-title')!)
      .fontFamily,
    label: getComputedStyle(document.querySelector('.island-name')!).fontFamily,
    body: getComputedStyle(document.querySelector('.island-overview-deck')!)
      .fontFamily,
    loaded: ['700 40px Kalam', '24px "Patrick Hand"', '16px Nunito'].every(
      (font) => document.fonts.check(font),
    ),
  }))
  expect(typography.heading).toContain('Kalam')
  expect(typography.label).toContain('Patrick Hand')
  expect(typography.body).toContain('Nunito')
  expect(typography.loaded).toBe(true)
  const terrain = page.locator('.island-terrain').first()
  await expect(terrain).toHaveAttribute('src', '/art/penpot/island.png')
  await expect(page.locator('.island-panorama')).toHaveAttribute(
    'src',
    '/art/penpot/panorama.png',
  )
  await expect
    .poll(() =>
      page
        .locator('.island-terrain, .island-panorama, .atlas-icon')
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true)
  // Sparse content must not leave a fixed-height ocean below the islands.
  const field = await page.locator('.island-field').boundingBox()
  const scene = await page.locator('.island-sea').boundingBox()
  expect(
    scene!.y + scene!.height - (field!.y + field!.height),
  ).toBeLessThanOrEqual(32)
  await expect(
    page.getByRole('banner').getByRole('link', { name: /Choose project/ }),
  ).toBeVisible()
  const summary = await page.locator('.island-summary').boundingBox()
  expect(summary!.x - (scene!.x + scene!.width)).toBeGreaterThanOrEqual(16)
  await page.screenshot({
    path: testInfo.outputPath('t008-start-desktop.png'),
    fullPage: true,
  })
  await page
    .getByRole('link', { name: 'Prepare the Field Notes article', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'How it works', exact: true }),
  ).toBeVisible()
  await expect(
    page.locator('.navigation-meta').getByText('Illustrative fixture', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.locator('.navigation-meta').getByText('Publishing Studio fixture v1', {
      exact: true,
    }),
  ).toBeVisible()
  const heroIsland = page.locator('.navigation-hero-scenery > img').first()
  await expect(heroIsland).toHaveAttribute('src', '/art/penpot/island.png')
  await expect
    .poll(() =>
      heroIsland.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)
  const featureUrl = page.url()
  const sections = page.getByRole('navigation', { name: 'Feature sections' })
  await sections.getByRole('button', { name: 'Rules' }).click()
  await expect(page.locator('#rules-heading')).toBeFocused()
  await expect(page).toHaveURL(featureUrl)
  await sections.getByRole('button', { name: 'Overview' }).click()
  await expect(page.locator('#how-heading')).toBeFocused()
  await expect(page).toHaveURL(featureUrl)
  const metadata = await page.locator('.navigation-meta').boundingBox()
  const hero = await page.locator('.navigation-hero').boundingBox()
  expect(metadata!.y).toBeGreaterThanOrEqual(hero!.y + hero!.height)
  const how = await page.locator('.navigation-how').boundingBox()
  const rules = await page.locator('.navigation-rules').boundingBox()
  expect(rules!.height).toBeLessThan(how!.height)
  await page.screenshot({
    path: testInfo.outputPath('t008-feature-desktop.png'),
    fullPage: true,
  })
})

test('proof case controls retain contrast, keyboard focus, direct URLs and Back', async ({
  page,
  request,
}, testInfo) => {
  const id = `desktop-cases-${testInfo.parallelIndex}-${testInfo.retry}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...publishingStudioSeed, id },
      })
    ).ok(),
  ).toBe(true)
  const base = `/#/projects/${id}`
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(
    `${base}/explore/prepare-article?case=draft-complete&from=start`,
  )
  const selected = page.getByRole('button', {
    name: 'Story and image ready',
    exact: true,
  })
  const contrast = await selected.evaluate((node) => {
    const luminance = (color: string) => {
      const channels = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map((value) => {
          const channel = Number(value) / 255
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4
        })
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
    }
    const foreground = luminance(
      getComputedStyle(node.querySelector('.navigation-case-title')!).color,
    )
    const background = luminance(getComputedStyle(node).backgroundColor)
    return (
      (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05)
    )
  })
  expect(contrast).toBeGreaterThanOrEqual(4.5)
  for (const [label, outcome] of [
    ['Image credit missing', 'Unavailable'],
    ['Image rights unclear', 'Unknown'],
  ] as const) {
    const control = page.getByRole('button', { name: label, exact: true })
    await control.focus()
    await page.keyboard.press('Enter')
    await expect(control).toBeFocused()
    await expect(control).toHaveAttribute('aria-pressed', 'true')
    expect(
      await control.evaluate((node) =>
        parseFloat(getComputedStyle(node).outlineWidth),
      ),
    ).toBeGreaterThanOrEqual(2)
    await expect(page.locator('.navigation-result .eyebrow')).toHaveText(
      outcome,
    )
  }
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Image rights unclear', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByText('Source and evidence', { exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'About this evidence' }),
  ).toBeVisible()
  await page.goBack()
  await expect(page.locator('.navigation-result .eyebrow')).toHaveText(
    'Unavailable',
  )
  await page.getByRole('link', { name: 'Back to Start here' }).click()
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  expect(
    await page
      .locator('.island-link')
      .first()
      .evaluate((node) =>
        parseFloat(getComputedStyle(node).transitionDuration),
      ),
  ).toBeLessThanOrEqual(0.0001)
})

test('long and absent facts stay inside proof cards at desktop and narrow widths', async ({
  page,
  request,
}, testInfo) => {
  const id = `desktop-content-${testInfo.parallelIndex}-${testInfo.retry}`
  const longFeature = {
    ...navigationFeature,
    id: 'long',
    title: 'Activity' + 'x'.repeat(145),
    actor: 'Actor' + 'y'.repeat(150),
    purpose: 'Recorded purpose. '.repeat(60),
    rules: ['LongRule' + 'z'.repeat(500), 'A second recorded condition.'],
    cases: [
      {
        ...navigationFeature.cases[0],
        label: 'Case' + 'c'.repeat(150),
        start: 'Starting condition. '.repeat(45),
        reason: 'Recorded reason. '.repeat(50),
      },
    ],
  }
  const sparseFeature = {
    ...navigationFeature,
    id: 'sparse',
    title: 'Sparse activity',
    group: undefined,
    presentation: undefined,
    rules: [],
    cases: [],
  }
  const longProjectTitle = 'Project' + 'p'.repeat(145)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 1,
          id,
          title: longProjectTitle,
          features: [longFeature, sparseFeature],
          relations: [],
        },
      })
    ).ok(),
  ).toBe(true)
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`/#/projects/${id}`)
    await expect(
      page.getByRole('heading', { name: 'Start here' }),
    ).toBeVisible()
    const projectControl = page.getByRole('banner').getByRole('link', {
      name: `Choose project: ${longProjectTitle}`,
    })
    await expect(projectControl).toHaveAttribute('title', longProjectTitle)
    expect((await projectControl.boundingBox())!.width).toBeLessThanOrEqual(350)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page
      .getByRole('link', { name: longFeature.title, exact: true })
      .click()
    await expect(
      page.getByRole('heading', { name: longFeature.title, exact: true }),
    ).toBeVisible()
    const escaped = await page
      .locator('.atlas-panel, .navigation-meta > div')
      .evaluateAll((cards) =>
        cards.flatMap((card) => {
          const outer = card.getBoundingClientRect()
          return Array.from(card.querySelectorAll('h2, p, button, a, dd'))
            .filter((child) => {
              const inner = child.getBoundingClientRect()
              return (
                inner.left < outer.left - 1 ||
                inner.right > outer.right + 1 ||
                inner.top < outer.top - 1 ||
                inner.bottom > outer.bottom + 1
              )
            })
            .map(
              (child) => child.tagName + ':' + child.textContent?.slice(0, 30),
            )
        }),
      )
    expect(escaped).toEqual([])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath(`t008-long-${width}.png`),
      fullPage: true,
    })
    await page.goto(`/#/projects/${id}/explore/sparse`)
    await expect(
      page.getByRole('heading', { name: 'No saved cases' }),
    ).toBeVisible()
    await expect(
      page.getByText('No business rules have been recorded.', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('No related features have been recorded.', {
        exact: true,
      }),
    ).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
  const emptyId = `${id}-empty`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 1,
          id: emptyId,
          title: 'Empty proof',
          features: [],
          relations: [],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.goto(`/#/projects/${emptyId}`)
  await expect(
    page.getByRole('heading', { name: 'No implemented activities found' }),
  ).toBeVisible()
  await expect(page.locator('.island-link')).toHaveCount(0)
})

test('registered artwork failure leaves the feature explanation available', async ({
  page,
  request,
}, testInfo) => {
  const id = `desktop-art-${testInfo.parallelIndex}-${testInfo.retry}`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 1,
          id,
          title: 'Art failure proof',
          features: [navigationFeature],
          relations: [],
        },
      })
    ).ok(),
  ).toBe(true)
  const upload = await request.post(`/api/v1/projects/${id}/assets`, {
    headers,
    data: {
      contractVersion: 1,
      expectedRevision: 1,
      id: 'supporting-art',
      mediaType: 'image/png',
      provenance: 'Synthetic test pixel',
      base64:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=',
    },
  })
  expect(upload.ok()).toBe(true)
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 1,
          expectedRevision: (await upload.json()).revision,
          upsertFeatures: [
            { ...navigationFeature, assetIds: ['supporting-art'] },
          ],
        },
      })
    ).ok(),
  ).toBe(true)
  await page.route(`**/projects/${id}/assets/supporting-art`, (route) =>
    route.abort(),
  )
  await page.goto(`/#/projects/${id}/explore/${navigationFeature.id}`)
  await expect(
    page.getByText('Illustration unavailable', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: navigationFeature.cases[0].result,
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: navigationFeature.cases[0].label,
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true')
})
