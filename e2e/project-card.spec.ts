import { expect, test } from '@playwright/test'

test('project cards stay compact with one or several projects and contain long names', async ({
  page,
}) => {
  for (const count of [1, 5]) {
    await page.route('**/api/v1/projects', (route) =>
      route.fulfill({
        json: Array.from({ length: count }, (_, index) => ({
          id: `card-${index}`,
          title:
            index === 0
              ? 'Publishing Studio · Demo'
              : 'Long project name '.repeat(8),
          revision: 1,
        })),
      }),
    )
    for (const width of [1920, 1440, 375]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('about:blank')
      await page.goto('/#/')
      await expect(page.locator('.project-card')).toHaveCount(count)
      await page.evaluate(() => document.fonts.ready)
      const cards = await page
        .locator('.project-card')
        .evaluateAll((elements) =>
          elements.map((element) => {
            const box = element.getBoundingClientRect()
            const title = element.querySelector('h2')!.getBoundingClientRect()
            return {
              width: box.width,
              height: box.height,
              containsTitle:
                title.bottom <= box.bottom && title.right <= box.right,
            }
          }),
        )
      expect(
        cards.every((card) => card.width <= 400 && card.containsTitle),
      ).toBe(true)
      if (width > 900) expect(cards[0].height).toBeLessThan(110)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
    }
    await page.unrouteAll()
  }
})
