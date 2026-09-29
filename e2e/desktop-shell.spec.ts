import { expect, test } from '@playwright/test'
import { approvalFeature, approvalSeed } from '../fixtures/approval'

test('desktop shell fills the viewport and navigation stays pinned while content scrolls', async ({
  page,
  request,
}, testInfo) => {
  const id = `desktop-shell-proof-${testInfo.parallelIndex}-${testInfo.retry}`
  const response = await request.post('/api/v1/projects', {
    headers: { authorization: 'Bearer e2e-only-token-not-a-production-secret' },
    data: {
      ...approvalSeed,
      id,
      title: 'Desktop shell proof',
      features: Array.from({ length: 30 }, (_, index) => ({
        ...approvalFeature,
        id: `activity-${index}`,
        title: `Recorded activity ${String(index).padStart(2, '0')}`,
      })),
    },
  })
  expect(response.ok()).toBe(true)
  for (const viewport of [
    { width: 1920, height: 1000 },
    { width: 1440, height: 900 },
    { width: 1024, height: 600 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto(`/#/projects/${id}/explore`)
    await page
      .getByRole('heading', { name: 'Browse recorded activities' })
      .waitFor()
    const header = page.locator('.atlas-header')
    const sidebar = page.locator('.atlas-sidebar')
    const initialHeader = (await header.boundingBox())!
    const initialSidebar = (await sidebar.boundingBox())!
    expect(initialHeader.x).toBe(0)
    expect(initialHeader.width).toBe(
      await page.evaluate(() => document.documentElement.clientWidth),
    )
    await page.mouse.move(viewport.width - 100, 500)
    await page.mouse.wheel(0, 650)
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(400)
    expect((await header.boundingBox())!.y).toBe(initialHeader.y)
    expect((await sidebar.boundingBox())!.y).toBe(initialSidebar.y)
    expect((await sidebar.boundingBox())!.height).toBeLessThanOrEqual(
      viewport.height - initialHeader.height,
    )
    const scrollPosition = await page.evaluate(() => window.scrollY)
    await page.getByRole('link', { name: 'Start here', exact: true }).click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await page.goBack()
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBe(scrollPosition)
    expect((await header.boundingBox())!.y).toBe(0)
  }
})
