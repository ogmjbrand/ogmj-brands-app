import { test, expect, ROUTES } from "./helpers";

/**
 * The body must never scroll horizontally, at any width, in any scroll
 * position. Tables, diagrams and code may overflow inside their own
 * container; the page may not.
 *
 * Scrolled-to-bottom matters: `w-max` marquee tracks and parallax transforms
 * only reach their extremes once the section is in view, so a check at the
 * top of the document would miss both.
 */
const WIDTHS = [390, 430, 768, 1024, 1440, 2200];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const offenders: string[] = [];

    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForTimeout(250);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(350);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) offenders.push(`${route} overflows by ${overflow}px`);
    }

    expect(offenders).toEqual([]);
  });
}

test("a side gutter survives the narrowest supported width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForTimeout(900);

  /* Headings must never touch the screen edge. */
  const left = await page.evaluate(() => {
    const h = document.querySelector("h1");
    return h ? h.getBoundingClientRect().left : -1;
  });
  expect(left).toBeGreaterThanOrEqual(16);
});
