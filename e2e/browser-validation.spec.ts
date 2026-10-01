import { expect, test } from '@playwright/test'

test('saved knowledge validates without blocked script evaluation and uses the approved favicon', async ({
  page,
  request,
}) => {
  await page.addInitScript(() => {
    const violations: string[] = []
    Object.assign(window, { atlasPolicyViolations: violations })
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(event.effectiveDirective + ': ' + event.blockedURI)
    })
  })
  await page.goto('/#/projects/booking-demo')
  await expect(
    page.getByRole('heading', { name: 'Start here', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () =>
        (window as Window & { atlasPolicyViolations?: string[] })
          .atlasPolicyViolations,
    ),
  ).toEqual([])
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    'href',
    '/art/penpot/mountain.svg',
  )
  expect((await request.get('/art/penpot/mountain.svg')).status()).toBe(200)
})
