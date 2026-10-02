import { test as base, expect } from "@playwright/test";
import { PHONE } from "./helpers";

/**
 * FIRST RUN
 *
 * Deliberately NOT using the seeded fixture: a fresh context is a genuine
 * first-time visitor, which is the thing under test.
 */
const test = base;

test("a first-time visitor meets onboarding, not someone else's dashboard", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.waitForTimeout(1500);

  expect(page.url()).toContain("/onboarding");
  await expect(page.getByText("Let's build something remarkable.")).toBeVisible();
});

test("completing onboarding sticks across a reload", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/onboarding");
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: "Begin" }).click();
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: /Beauty/ }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: /Grow revenue/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /Personalise OGMJ/ }).click();
  await page.waitForTimeout(5200);

  expect(new URL(page.url()).pathname).toBe("/");
  expect(await page.evaluate(() => localStorage.getItem("ogmj.onboarded"))).toBe("1");

  await page.goto("/");
  await page.waitForTimeout(1400);
  expect(page.url(), "a returning visitor must not be sent round again").not.toContain("/onboarding");
  await expect(page.getByText("is accelerating.")).toBeVisible();
});

test("blocked storage fails OPEN rather than trapping the user", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE });
  /* Private browsing, blocked site data, an embedded webview. Guessing wrong
     here costs one skipped intro; guessing wrong the other way locks someone
     out of their own product with no way back. */
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("blocked", "SecurityError");
      },
    });
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(1500);

  expect(page.url()).not.toContain("/onboarding");
  await expect(page.getByText("is accelerating.")).toBeVisible();
  await context.close();
});

test("the account sheet replays onboarding", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("ogmj.onboarded", "1");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(1300);

  /* The avatar was once a labelled control that did nothing. */
  await page.getByRole("button", { name: "Your account" }).click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  await page.getByRole("button", { name: /Replay onboarding/ }).click();
  await page.waitForTimeout(1600);

  expect(page.url()).toContain("/onboarding");
  expect(await page.evaluate(() => localStorage.getItem("ogmj.onboarded"))).toBeNull();
  await context.close();
});
