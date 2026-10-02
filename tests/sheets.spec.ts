import { test, expect, PHONE } from "./helpers";

/**
 * SHEETS
 *
 * The sheet is portalled to <body> because `position: fixed` resolves against
 * the nearest ancestor with a transform, filter or backdrop-filter — and the
 * mobile top bar animates backdrop-filter from blur(0px), which is not
 * `none` and creates a containing block permanently. A sheet rendered inside
 * it anchored to a 64px bar and hung off the top of the screen.
 *
 * These assertions are what stop that regressing for the next sheet anyone
 * adds, wherever they nest it.
 */

const SHEETS: [string, string | RegExp, string][] = [
  ["/", "Your account", "account"],
  ["/crm", /Adaeze/, "lead detail"],
  ["/content", /40-label/, "content piece"],
  ["/brand", "Open brand guidelines", "brand guidelines"],
];

for (const [route, opener, label] of SHEETS) {
  test(`the ${label} sheet anchors to the viewport`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(route);
    await page.waitForTimeout(1200);

    await page.getByRole("button", { name: opener }).click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(700);

    const box = await dialog.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight };
    });

    expect(Math.abs(box.bottom - box.vh), `${label} is not sitting on the viewport bottom`).toBeLessThanOrEqual(2);
    expect(box.top, `${label} hangs off the top of the screen`).toBeGreaterThanOrEqual(0);
  });
}

test("a sheet traps focus and gives it back", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/crm");
  await page.waitForTimeout(900);

  const trigger = page.getByRole("button", { name: /Adaeze/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(800);

  const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  expect(inside, "focus must move into the sheet").toBe(true);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);

  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  const returned = await page.evaluate(() => (document.activeElement?.textContent || "").includes("Adaeze"));
  expect(returned, "focus must return to the control that opened it").toBe(true);
});

test("a sheet locks the page behind it", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/crm");
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /Adaeze/ }).click();
  await page.waitForTimeout(700);

  const locked = await page.evaluate(() => getComputedStyle(document.body).overflow);
  expect(locked).toBe("hidden");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const restored = await page.evaluate(() => getComputedStyle(document.body).overflow);
  expect(restored, "scroll must be given back on close").not.toBe("hidden");
});
