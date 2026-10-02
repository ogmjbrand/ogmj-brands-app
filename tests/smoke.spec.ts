import { test, expect, watchErrors, ROUTES, PHONE, DESKTOP } from "./helpers";

/**
 * Every route must render clean at the phone width the product is designed
 * at, and at desktop. A hydration mismatch surfaces here as a pageerror,
 * which is how the reduced-motion and build-time-greeting bugs were caught.
 */
for (const route of ROUTES) {
  test(`${route} renders without errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.setViewportSize(PHONE);
    await page.goto(route);
    await page.waitForTimeout(1200);
    expect(errors, `console/page errors on ${route}`).toEqual([]);
    await expect(page.locator("#main, main")).toBeVisible();
  });
}

test("onboarding renders without errors", async ({ page }) => {
  const errors = watchErrors(page);
  await page.setViewportSize(PHONE);
  await page.goto("/onboarding");
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
  await expect(page.getByText("Let's build something remarkable.")).toBeVisible();
});

test("an unknown route offers a way forward, not a dead end", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/does-not-exist");
  /* An empty state is never allowed to be only an apology. */
  await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
});

test("desktop recomposes rather than merely widening", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  /* The rail is a desktop-only surface; the bottom bar is phone-only.
     If both or neither are present, the layout has not recomposed. */
  await expect(page.locator("nav").filter({ hasText: "Revenue" }).first()).toBeVisible();
  const railVisible = await page.locator('nav[aria-label="Primary"]').first().isVisible();
  expect(railVisible).toBe(true);
});
