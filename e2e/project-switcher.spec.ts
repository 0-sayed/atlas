import { expect, test } from '@playwright/test'
import { approvalSeed } from '../fixtures/approval'

const headers = {
  authorization: 'Bearer e2e-only-token-not-a-production-secret',
}

test('refreshing a renamed project updates the picker label and current option', async ({
  page,
  request,
}) => {
  const id = 'renamed-picker-project'
  const initialTitle = 'Original project title · synthetic QA'
  const title = 'Updated project title · synthetic QA'
  const created = await request.post('/api/v1/projects', {
    headers,
    data: { ...approvalSeed, id, title: initialTitle },
  })
  expect(created.status()).toBe(201)
  const { revision } = await created.json()
  await page.goto(`/#/projects/${id}`)
  const picker = page.getByRole('combobox', { name: /Choose project/ })
  await expect(picker).toBeEnabled()
  await expect(picker.locator('button')).toHaveText(initialTitle)
  const renamed = await request.post(`/api/v1/projects/${id}/changes`, {
    headers,
    data: { contractVersion: 2, expectedRevision: revision, title },
  })
  expect(renamed.status()).toBe(201)
  await page.getByRole('button', { name: 'Refresh guide', exact: true }).click()
  await expect(picker).toHaveAccessibleName(`Choose project: ${title}`)
  await expect(picker.locator('button')).toHaveText(title)
  await picker.click()
  const current = picker.getByRole('option', { name: title, exact: true })
  await expect(current).toBeVisible()
  await expect(current).toHaveJSProperty('selected', true)
  await expect(
    picker.getByRole('option', { name: initialTitle, exact: true }),
  ).toHaveCount(0)
})

test('the themed picker exposes readable options, dismisses without navigating, and selects by keyboard', async ({
  page,
  request,
}, testInfo) => {
  const id = 'theme-project-picker'
  const title = `A long project name ${'for the Atlas project shelf '.repeat(4)}· synthetic QA`
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...approvalSeed, id, title },
      })
    ).ok(),
  ).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/')
  const homePicker = page.getByRole('combobox', {
    name: 'Choose project',
    exact: true,
  })
  await expect(homePicker).toBeEnabled()
  await expect(homePicker.locator('button')).toHaveText('Choose a project')
  await homePicker.click()
  await expect(homePicker.locator('option[value=""]')).not.toBeVisible()
  await expect(
    homePicker.getByRole('option', { name: title, exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await page.goto('/#/projects/booking-demo')
  const switcher = page.getByRole('combobox', { name: /Choose project/ })
  await expect(switcher).toBeEnabled()
  const initialUrl = page.url()
  await switcher.click()
  const current = switcher.getByRole('option', {
    name: 'Illustrative booking guide',
    exact: true,
  })
  await expect(current).toBeVisible()
  await expect(current).toHaveJSProperty('selected', true)
  await expect(current).toHaveCSS('font-family', 'Nunito, sans-serif')
  await page.keyboard.press('Escape')
  await expect(current).not.toBeVisible()
  await expect(switcher).toBeFocused()
  expect(page.url()).toBe(initialUrl)
  await switcher.click()
  await page.locator('.atlas-header-caption').click()
  await expect(current).not.toBeVisible()
  expect(page.url()).toBe(initialUrl)
  await switcher.selectOption(id)
  await expect(page).toHaveURL(/#\/projects\/theme-project-picker$/)
  await expect(switcher.locator('button')).toHaveText(title)
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await switcher.click()
    const selected = switcher.getByRole('option', { name: title, exact: true })
    await expect(selected).toBeVisible()
    const bounds = await selected.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    expect(
      await selected.evaluate(
        (option) => option.scrollWidth <= option.clientWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath(`themed-project-picker-${width}.png`),
    })
    await page.keyboard.press('Escape')
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
  await switcher.focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('Home')
  await page.keyboard.press('Enter')
  await expect(switcher).not.toHaveValue(id)
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
})

test('header switches directly between saved guides and Back restores the current case', async ({
  page,
  request,
}) => {
  const id = 'aaa-header-switch-guide'
  expect(
    (
      await request.post('/api/v1/projects', {
        headers,
        data: { ...approvalSeed, id, title: 'Header switch · synthetic QA' },
      })
    ).ok(),
  ).toBe(true)
  let writes = 0
  page.on('request', (request) => {
    if (request.method() === 'POST') writes += 1
  })
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  const switcher = page.getByRole('combobox', { name: /Choose project/ })
  await expect(switcher).toHaveValue('booking-demo')
  await expect(switcher).toBeEnabled()
  await switcher.selectOption(id)
  await expect(page).toHaveURL(/#\/projects\/aaa-header-switch-guide$/)
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
  await expect(switcher).toHaveValue(id)
  await expect(
    page.getByRole('heading', { name: 'Choose a project' }),
  ).toHaveCount(0)
  await expect(
    page.getByText('Reschedule a booking', { exact: true }),
  ).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/booking-demo\/explore\/booking\?case=at-limit$/)
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toBeVisible()
  await expect(switcher).toHaveValue('booking-demo')
  await page.reload()
  await expect(switcher).toHaveValue('booking-demo')
  await expect(switcher).toBeEnabled()
  await switcher.focus()
  await expect(switcher).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Space')
  await page.keyboard.press('Home')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/projects\/aaa-header-switch-guide$/)
  expect(writes).toBe(0)
  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose a project' }),
  ).toBeVisible()
  await page
    .getByRole('combobox', { name: 'Choose project', exact: true })
    .selectOption('booking-demo')
  await expect(page).toHaveURL(/#\/projects\/booking-demo$/)
})

test('failed project listing preserves the loaded guide and can be retried', async ({
  page,
}) => {
  await page.route(/\/api\/v1\/projects(?:\?.*)?$/, (route) =>
    route.fulfill({ status: 503, json: {} }),
  )
  await page.goto('/#/projects/booking-demo/explore/booking?case=at-limit')
  const switcher = page.getByRole('combobox', { name: /Choose project/ })
  await expect(switcher).toBeDisabled()
  await expect(switcher).toHaveValue('booking-demo')
  await expect(page.getByRole('alert')).toContainText(
    'Project list unavailable',
  )
  await expect(
    page.getByRole('heading', { name: 'Booking moved' }),
  ).toBeVisible()
  await page.unroute(/\/api\/v1\/projects(?:\?.*)?$/)
  await page.getByRole('button', { name: 'Retry projects' }).click()
  await expect(switcher).toBeEnabled()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page).toHaveURL(/booking-demo\/explore\/booking\?case=at-limit$/)
})

test('an empty saved-project list offers no invented switch targets', async ({
  page,
}) => {
  await page.route(/\/api\/v1\/projects(?:\?.*)?$/, (route) =>
    route.fulfill({ json: [] }),
  )
  await page.goto('/#/projects/booking-demo')
  const switcher = page.getByRole('combobox', { name: /Choose project/ })
  await expect(switcher).toBeDisabled()
  await expect(switcher).toHaveValue('booking-demo')
  await expect(switcher.getByRole('option')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible()
})

test('header includes saved projects beyond the first API page', async ({
  page,
  request,
}) => {
  for (let index = 0; index <= 100; index += 1) {
    expect(
      (
        await request.post('/api/v1/projects', {
          headers,
          data: {
            contractVersion: 1,
            id: `zzz-switch-page-${String(index).padStart(3, '0')}`,
            title: `Paged switch ${index} · synthetic QA`,
            features: [],
            relations: [],
          },
        })
      ).ok(),
    ).toBe(true)
  }
  await page.goto('/#/projects/booking-demo')
  const switcher = page.getByRole('combobox', { name: /Choose project/ })
  await expect(switcher).toBeEnabled()
  await expect(
    switcher.getByRole('option', {
      name: 'Paged switch 100 · synthetic QA',
      exact: true,
    }),
  ).toHaveAttribute('value', 'zzz-switch-page-100')
  await switcher.selectOption('zzz-switch-page-100')
  await expect(page).toHaveURL(/#\/projects\/zzz-switch-page-100$/)
  await expect(
    page.getByRole('heading', { name: 'No implemented activities found' }),
  ).toBeVisible()
})
