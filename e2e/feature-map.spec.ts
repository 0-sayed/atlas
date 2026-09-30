import { expect, test } from '@playwright/test'
import { authoredFeature, authoredSeed } from '../fixtures/authored'
const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}
const id = 'map-capacity'
test.beforeAll(async ({ request }) => {
  if ((await request.get('/api/v1/projects/' + id)).ok()) return
  const features = Array.from({ length: 160 }, (_, i) => ({
    ...authoredFeature,
    id: 'activity-' + String(i + 1).padStart(3, '0'),
    title: 'Parcel activity ' + String(i + 1).padStart(3, '0'),
    areaId: 'area-' + Math.floor(i / 20),
  }))
  const areas = Array.from({ length: 8 }, (_, i) => ({
    id: 'area-' + i,
    title: 'Dispatch area ' + i,
    evidenceIds: ['source'],
  }))
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features: features.slice(0, 100),
          areas,
          journeys: [],
          glossary: [],
          relations: [
            {
              id: 'blocks',
              from: 'activity-001',
              to: 'activity-002',
              kind: 'blocks',
              evidenceIds: ['disagreement'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  expect(
    (
      await request.post('/api/v1/projects/' + id + '/changes', {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 1,
          upsertFeatures: features.slice(100),
          upsertRelations: [
            {
              id: 'remote',
              from: 'activity-001',
              to: 'activity-160',
              kind: 'requires',
              evidenceIds: ['source'],
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
})
test('rapid map controls preserve the selected view while searching', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/projects/' + id + '/map?group=area%3Aarea-0')
  await page
    .getByRole('button', { name: 'Parcel activity 001', exact: true })
    .click()
  await page.getByRole('link', { name: 'Open activity', exact: true }).click()
  await page
    .getByRole('button', { name: 'Conflicting handoff', exact: true })
    .click()
  await page
    .getByRole('link', { name: 'Back to Feature Map', exact: true })
    .click()
  await page
    .getByRole('combobox', { name: 'Area', exact: true })
    .selectOption('')
  await expect(page).not.toHaveURL(/group=/)
  // Dispatch while the preceding navigation is pending, as on a busy browser.
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find(
      (b) => b.textContent === 'List view',
    )!
    button.click()
    const input = document.querySelector<HTMLInputElement>(
      'input[type="search"]',
    )!
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(input, 'activity 160')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await expect(page.locator('.map-list-item')).toHaveCount(1)
  await expect(page).toHaveURL(/view=list/)
  await expect(
    page.getByRole('link', { name: 'Parcel activity 160', exact: true }),
  ).toBeVisible()
})
test('160 saved activities are grouped, searchable, listable and directly reachable', async ({
  page,
}, info) => {
  const started = performance.now()
  await page.goto('/#/projects/' + id + '/map')
  await expect(
    page.getByRole('heading', { name: 'Feature Map', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('160 activities · 8 groups', { exact: true }),
  ).toBeVisible()
  await expect(page.locator('.map-node')).toHaveCount(6)
  await page.getByRole('button', { name: 'Next map page', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Open Dispatch area 7', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Open Dispatch area 7', exact: true })
    .click()
  await expect(
    page.getByRole('combobox', { name: 'Area', exact: true }),
  ).toHaveValue('area:area-7')
  await page.getByRole('button', { name: 'List view', exact: true }).click()
  await expect(page.locator('.map-list-item')).toHaveCount(20)
  await page.getByRole('searchbox').fill('activity 160')
  await expect(page.locator('.map-list-item')).toHaveCount(1)
  await page
    .getByRole('link', { name: 'Parcel activity 160', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Conflicting handoff', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Conflicting')
  await page
    .getByRole('link', { name: 'Back to Feature Map', exact: true })
    .click()
  await expect(page.getByRole('searchbox')).toHaveValue('activity 160')
  await expect(
    page.getByRole('combobox', { name: 'Area', exact: true }),
  ).toHaveValue('area:area-7')
  expect(performance.now() - started).toBeLessThan(10000)
  await page.screenshot({
    path: info.outputPath('map-search-list.png'),
    fullPage: true,
  })
})
test('camera, background dragging, focus, selected relationships and Back share bounds without writes', async ({
  page,
  request,
}, info) => {
  let writes = 0
  page.on('request', (r) => {
    if (r.url().includes('/api/') && r.method() !== 'GET') writes++
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/projects/' + id + '/map?group=area%3Aarea-0')
  const canvas = page.getByRole('region', {
    name: 'Interactive feature map',
    exact: true,
  })
  await expect(canvas).toBeVisible()
  const before = await canvas.getAttribute('data-camera')
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await expect(canvas).not.toHaveAttribute('data-camera', before!)
  await canvas.focus()
  const zoomed = await canvas.getAttribute('data-camera')
  await page.keyboard.press('ArrowRight')
  await expect(canvas).not.toHaveAttribute('data-camera', zoomed!)
  const box = (await canvas.boundingBox())!
  const panned = await canvas.getAttribute('data-camera')
  await page.mouse.move(box.x + box.width - 15, box.y + box.height - 20)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width - 130, box.y + box.height - 70, {
    steps: 10,
  })
  await page.mouse.up()
  await expect(canvas).not.toHaveAttribute('data-camera', panned!)
  await expect(page).not.toHaveURL(/selected=/)
  await page
    .getByRole('button', { name: 'Fit all islands', exact: true })
    .click()
  const fit = JSON.parse((await canvas.getAttribute('data-camera'))!)
  const bounds = JSON.parse((await canvas.getAttribute('data-world'))!)
  expect(fit.scale).toBeCloseTo(
    Math.min(box.width / bounds.width, box.height / bounds.height),
    2,
  )
  const mini = page.locator('.map-minimap-viewport')
  expect(Number(await mini.getAttribute('width'))).toBeCloseTo(
    Math.min(bounds.width, box.width / fit.scale),
    1,
  )
  await page.setViewportSize({ width: 1000, height: 900 })
  await page
    .getByRole('button', { name: 'Fit all islands', exact: true })
    .click()
  const resized = (await canvas.boundingBox())!
  await expect
    .poll(
      async () => JSON.parse((await canvas.getAttribute('data-camera'))!).scale,
    )
    .toBeCloseTo(
      Math.min(resized.width / bounds.width, resized.height / bounds.height),
      2,
    )
  await expect
    .poll(async () => Number(await mini.getAttribute('width')))
    .toBeCloseTo(
      Math.min(
        bounds.width,
        resized.width /
          JSON.parse((await canvas.getAttribute('data-camera'))!).scale,
      ),
      1,
    )
  await page
    .getByRole('button', { name: 'Parcel activity 001', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Recorded connections', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Blocks:', { exact: true })).toBeVisible()
  await expect(page.locator('.map-relationship-layer line')).toHaveCount(1)
  await expect(page.locator('.claim-warning')).toContainText(
    'Conflicting evidence',
  )
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  const remembered = await canvas.getAttribute('data-camera')
  await page.getByRole('link', { name: 'Open activity', exact: true }).click()
  await page.goBack()
  await expect(
    page.getByRole('region', { name: 'Interactive feature map' }),
  ).toHaveAttribute('data-camera', remembered!)
  await page.reload()
  await expect(
    page.getByRole('region', { name: 'Interactive feature map' }),
  ).toHaveAttribute('data-camera', remembered!)
  await page
    .getByRole('button', { name: 'Map overview: move viewport', exact: true })
    .click({ position: { x: 100, y: 70 } })
  await expect(
    page.getByRole('region', { name: 'Interactive feature map' }),
  ).not.toHaveAttribute('data-camera', remembered!)
  const node = page.getByRole('button', {
    name: 'Parcel activity 006',
    exact: true,
  })
  await node.focus()
  await expect(node).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/selected=activity-006/)
  expect(writes).toBe(0)
  expect(
    (await (await request.get('/api/v1/projects/' + id)).json()).revision,
  ).toBe(2)
  await page.screenshot({
    path: info.outputPath('map-camera.png'),
    fullPage: true,
  })
})
test('refresh retains existing slots through additions and removals and isolates identical IDs', async ({
  page,
  request,
}) => {
  const features = Array.from({ length: 4 }, (_, i) => ({
    ...authoredFeature,
    id: 'stable-' + i,
    title: 'Stable activity ' + i,
  }))
  const seed = {
    ...authoredSeed,
    features,
    journeys: [],
    glossary: [],
    relations: [],
  }
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...seed, id: 'map-stable' },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/map-stable/map?group=area%3Adispatch')
  const positions = () =>
    page
      .locator('.map-node')
      .evaluateAll((nodes) =>
        Object.fromEntries(
          nodes.map((n) => [
            n.getAttribute('data-node-id'),
            [(n as HTMLElement).style.left, (n as HTMLElement).style.top],
          ]),
        ),
      )
  await expect(page.locator('.map-node')).toHaveCount(4)
  const before = await positions()
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  const camera = await page
    .getByRole('region', { name: 'Interactive feature map' })
    .getAttribute('data-camera')
  expect(
    (
      await request.post('/api/v1/projects/map-stable/changes', {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 1,
          upsertFeatures: [
            {
              ...features[0],
              id: 'aaa-new',
              title: 'New earlier-sorting activity',
            },
          ],
          removeFeatureIds: ['stable-0'],
        },
      })
    ).status(),
  ).toBe(201)
  await page.reload()
  await expect(
    page.getByRole('button', {
      name: 'New earlier-sorting activity',
      exact: true,
    }),
  ).toBeAttached()
  const after = await positions()
  for (const id of ['stable-1', 'stable-2', 'stable-3'])
    expect(after[id]).toEqual(before[id])
  await page.goto(
    '/#/projects/map-stable/map?group=area%3Adispatch&selected=stable-0',
  )
  await expect(
    page.getByText('This map location is unavailable.', { exact: true }),
  ).toBeVisible()
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...seed,
          id: 'map-identical',
          title: 'Separate project with identical IDs',
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/map-identical/map?group=area%3Adispatch')
  await expect(
    page.getByRole('region', { name: 'Interactive feature map' }),
  ).not.toHaveAttribute('data-camera', camera!)
  await expect(
    page.getByRole('button', { name: 'Stable activity 0', exact: true }),
  ).toBeAttached()
  await expect(page.locator('.map-feature-preview')).toHaveCount(0)
  await expect(page.getByRole('searchbox')).toHaveValue('')
})
test('empty, no results, missing group/selection and cross-project camera stay honest', async ({
  page,
  request,
}) => {
  const other = 'map-empty'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          contractVersion: 2,
          id: other,
          title: 'Empty map',
          features: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/' + other + '/map')
  await expect(
    page.getByText('No activities recorded yet.', { exact: true }),
  ).toBeVisible()
  await page.goto('/#/projects/' + id + '/map?q=no-match')
  await expect(
    page.getByText('No matching activities.', { exact: true }),
  ).toBeVisible()
  await page.goto('/#/projects/' + id + '/map?group=foreign')
  await expect(
    page.getByText('This map location is unavailable.', { exact: true }),
  ).toBeVisible()
  await page.goto('/#/projects/' + id + '/map?selected=foreign')
  await expect(
    page.getByText('This map location is unavailable.', { exact: true }),
  ).toBeVisible()
  await page.goto('/#/projects/' + id + '/map?group=area%3Aarea-0')
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  const camera = await page
    .getByRole('region', { name: 'Interactive feature map' })
    .getAttribute('data-camera')
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...authoredSeed, id: 'map-other' },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/map-other/map')
  await expect(
    page.getByRole('region', { name: 'Interactive feature map' }),
  ).not.toHaveAttribute('data-camera', camera!)
  await expect(page.getByRole('searchbox')).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Area' })).toHaveValue('')
})
test('node-origin dragging does not activate an island, while clicks and keyboard still do', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/#/projects/' + id + '/map?group=area%3Aarea-0')
  await page
    .getByRole('button', { name: 'Fit all islands', exact: true })
    .click()
  const node = page.getByRole('button', {
    name: 'Parcel activity 001',
    exact: true,
  })
  const box = (await node.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    box.x + box.width / 2 + 20,
    box.y + box.height / 2 + 10,
    { steps: 5 },
  )
  await page.mouse.up()
  await expect(page).not.toHaveURL(/selected=/)
  await node.click()
  await expect(page).toHaveURL(/selected=activity-001/)
  const second = page.getByRole('button', {
    name: 'Parcel activity 002',
    exact: true,
  })
  await second.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/selected=activity-002/)
})
test('Tab traversal keeps complete long labels visible and minimap aligned without native scrolling', async ({
  page,
  request,
}, info) => {
  const projectId = `map-tab-${info.repeatEachIndex}`
  const title = 'W'.repeat(160)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id: projectId,
          features: Array.from({ length: 6 }, (_, i) => ({
            ...authoredFeature,
            id: 'tab-' + i,
            title,
          })),
          journeys: [],
          glossary: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`/#/projects/${projectId}/map?group=area%3Adispatch`)
  const fit = page.getByRole('button', { name: 'Fit all islands', exact: true })
  await expect(fit).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await fit.click()
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  const canvas = page.getByRole('region', {
    name: 'Interactive feature map',
    exact: true,
  })
  await canvas.focus()
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    const node = page.locator('.map-node').nth(i)
    await expect(node).toBeFocused()
    await expect
      .poll(() =>
        node.evaluate((el) => {
          const region = el.closest('.map-camera')!
          const viewport = region.getBoundingClientRect()
          const title = el
            .querySelector('.map-node-title')!
            .getBoundingClientRect()
          const wrapper = region.querySelector('.react-transform-wrapper')!
          return {
            visible:
              title.top >= viewport.top - 1 &&
              title.bottom <= viewport.bottom + 1 &&
              title.left >= viewport.left - 1 &&
              title.right <= viewport.right + 1,
            scrollTop: wrapper.scrollTop,
            scrollLeft: wrapper.scrollLeft,
            regionScrollTop: region.scrollTop,
            regionScrollLeft: region.scrollLeft,
          }
        }),
      )
      .toEqual({
        visible: true,
        scrollTop: 0,
        scrollLeft: 0,
        regionScrollTop: 0,
        regionScrollLeft: 0,
      })
    const camera = JSON.parse((await canvas.getAttribute('data-camera'))!)
    const world = JSON.parse((await canvas.getAttribute('data-world'))!)
    const box = (await canvas.boundingBox())!
    const mini = page.locator('.map-minimap-viewport')
    expect(Number(await mini.getAttribute('x'))).toBeCloseTo(
      Math.max(0, Math.min(world.width, -camera.positionX / camera.scale)),
      1,
    )
    expect(Number(await mini.getAttribute('y'))).toBeCloseTo(
      Math.max(0, Math.min(world.height, -camera.positionY / camera.scale)),
      1,
    )
    const actual = await node.boundingBox()
    const offset = await node.evaluate((el) => ({
      x: (el as HTMLElement).offsetLeft,
      y: (el as HTMLElement).offsetTop,
    }))
    expect(actual!.x).toBeCloseTo(
      box.x + camera.positionX + offset.x * camera.scale,
      1,
    )
    expect(actual!.y).toBeCloseTo(
      box.y + camera.positionY + offset.y * camera.scale,
      1,
    )
  }
  await expect(page).not.toHaveURL(/selected=/)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/selected=tab-5/)
})
test('long labels fit their surfaces with loaded native art and fonts at desktop and narrow widths', async ({
  page,
  request,
}, info) => {
  const long = 'x'.repeat(160)
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id: 'map-long',
          features: Array.from({ length: 6 }, (_, i) => ({
            ...authoredFeature,
            id: i ? 'long-' + i : authoredFeature.id,
            title: long,
          })),
          areas: [{ ...authoredSeed.areas[0], title: long }],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto('/#/projects/map-long/map')
  await page.getByRole('button', { name: 'Open ' + long, exact: true }).click()
  const node = page.getByRole('button', { name: long, exact: true }).first()
  await node.focus()
  await expect(node).toBeInViewport()
  expect(await node.evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(
    true,
  )
  expect(
    await node.evaluate((el) => {
      const art = el
        .querySelector('.atlas-activity-icon')!
        .getBoundingClientRect()
      const title = el.querySelector('.map-node-title')!.getBoundingClientRect()
      return art.bottom <= title.top && art.width <= 60
    }),
  ).toBe(true)
  await expect(node).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  expect(
    await page.locator('.map-world').evaluate((world) => {
      const bounds = world.getBoundingClientRect()
      return [...world.querySelectorAll('.map-node')].every((node) => {
        const rect = node.getBoundingClientRect()
        return rect.bottom <= bounds.bottom && rect.right <= bounds.right
      })
    }),
  ).toBe(true)
  await expect(page.locator('.map-node-title').first()).toHaveCSS(
    'font-family',
    /Patrick Hand/,
  )
  expect(
    await page
      .locator('.map-scenery img')
      .evaluateAll((imgs) =>
        imgs.every(
          (i) =>
            (i as HTMLImageElement).complete &&
            (i as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true)
  await page.screenshot({
    path: info.outputPath('map-long.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 375, height: 800 })
  await page.getByRole('button', { name: 'List view', exact: true }).click()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('changed maps recover a camera that no longer shows a remaining island', async ({
  page,
  request,
}, info) => {
  const id = `map-camera-recovery-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const features = Array.from({ length: 6 }, (_, i) => ({
    ...authoredFeature,
    id: `recovery-${i}`,
    title: `Recovery activity ${i}`,
  }))
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features,
          journeys: [],
          glossary: [],
          relations: [],
        },
      })
    ).status(),
  ).toBe(201)
  await page.setViewportSize({ width: 1000, height: 1000 })
  await page.goto(`/#/projects/${id}/map?group=area%3Adispatch`)
  for (let i = 0; i < 5; i++)
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await page
    .getByRole('button', { name: 'Recovery activity 5', exact: true })
    .focus()
  const region = page.getByRole('region', { name: 'Interactive feature map' })
  const savedCamera = await region.getAttribute('data-camera')
  await page.reload()
  await expect(region).toHaveAttribute('data-camera', savedCamera!)
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 1,
          removeFeatureIds: features.slice(1).map((f) => f.id),
        },
      })
    ).status(),
  ).toBe(201)
  await page.reload()
  await expect(page.locator('.map-node')).toHaveCount(1)
  await expect
    .poll(() =>
      page.locator('.map-node').evaluateAll((nodes) =>
        nodes.some((node) => {
          const box = node.getBoundingClientRect(),
            region = node.closest('.map-camera')!.getBoundingClientRect()
          return (
            box.right > region.left &&
            box.left < region.right &&
            box.bottom > region.top &&
            box.top < region.bottom
          )
        }),
      ),
    )
    .toBe(true)
  await expect(region).not.toHaveAttribute('data-camera', savedCamera!)
})
test('removing an earlier activity reconciles the selected island with its current page', async ({
  page,
  request,
}, info) => {
  const id = `map-page-recovery-${info.parallelIndex}-${info.retry}-${info.repeatEachIndex}`
  const features = Array.from({ length: 8 }, (_, i) => ({
    ...authoredFeature,
    id: `paged-${i}`,
    title: `Paged activity ${i}`,
  }))
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: {
          ...authoredSeed,
          id,
          features,
          journeys: [],
          glossary: [],
          relations: [
            {
              id: 'selection-link',
              from: 'paged-6',
              to: 'paged-5',
              kind: 'related',
            },
          ],
        },
      })
    ).status(),
  ).toBe(201)
  await page.goto(
    `/#/projects/${id}/map?group=area%3Adispatch&page=2&selected=paged-6`,
  )
  await expect(
    page.getByRole('button', { name: 'Paged activity 6', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(
    (
      await request.post(`/api/v1/projects/${id}/changes`, {
        headers,
        data: {
          contractVersion: 2,
          expectedRevision: 1,
          removeFeatureIds: ['paged-0'],
        },
      })
    ).status(),
  ).toBe(201)
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Paged activity 6', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.map-relationship-layer line')).toHaveCount(1)
  await expect(page).not.toHaveURL(/page=2/)
  await expect(page.locator('.map-feature-preview')).toContainText(
    'Paged activity 6',
  )
})
