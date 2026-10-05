import { readFileSync } from "node:fs";

import { test, expect, PHONE } from "./helpers";

/**
 * INTERACTION STATES
 *
 * The brief names three that the product owed and did not have: saving ->
 * confirmation, deleting -> clear consequence, error -> useful recovery.
 * Each is tested on behaviour, not appearance.
 */

/* ---------------------------------------------------------------- */
/* SAVING -> CONFIRMATION                                            */
/* ---------------------------------------------------------------- */

test("scheduling a piece confirms what happened, naming it", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/content");
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /40-label/ }).click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.getByRole("button", { name: "Schedule" }).click();

  const toast = page.getByRole("status");
  await expect(toast).toBeVisible();
  /* A receipt names the thing. "Saved" would confirm nothing. */
  await expect(toast).toContainText("40-label");
  await expect(toast).toContainText("Thursday");
});

test("a confirmation clears itself; the user never has to tidy up", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/crm");
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /Adaeze/ }).click();
  await page.getByRole("button", { name: "Follow up" }).click();

  const toast = page.getByRole("status");
  await expect(toast).toContainText("Adaeze");
  await expect(toast).toBeHidden({ timeout: 9000 });
});

test("confirmations sit above the tab bar, where the thumb already is", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/crm");
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: /Adaeze/ }).click();
  await page.getByRole("button", { name: "Follow up" }).click();

  const box = await page.getByRole("status").boundingBox();
  const vh = PHONE.height;
  expect(box).not.toBeNull();
  /* Bottom half of the screen, and clear of the 62px tab bar. */
  expect(box!.y).toBeGreaterThan(vh / 2);
  expect(box!.y + box!.height).toBeLessThanOrEqual(vh - 62);
});

/* ---------------------------------------------------------------- */
/* DELETING -> CLEAR CONSEQUENCE                                     */
/* ---------------------------------------------------------------- */

test("deleting asks first, and says what will be lost", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/studio");
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /^Delete Primary mark$/ }).click();

  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Primary mark");
  /* The consequence must be stated in the user's terms, not "Are you sure?" */
  await expect(dialog).toContainText(/post, page or campaign/);

  /* Focus must not start on the destructive control: a stray Enter should
     never delete anything. */
  const focused = await page.evaluate(() => (document.activeElement?.textContent || "").trim());
  expect(focused).toBe("Keep it");
});

test("cancelling a delete keeps the asset", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/studio");
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /^Delete Primary mark$/ }).click();
  await page.getByRole("button", { name: "Keep it" }).click();

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Delete Primary mark$/ })).toBeVisible();
});

test("Escape cancels a delete rather than confirming it", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/studio");
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /^Delete Primary mark$/ }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Delete Primary mark$/ })).toBeVisible();
});

test("a delete is undoable, and the asset returns to where it was", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/studio");
  await page.waitForTimeout(1000);

  const order = () =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll(".break-inside-avoid p")).map((p) => p.textContent?.trim()),
    );
  const before = await order();

  /* Second tile, so a restore appended to the end would be detectable. */
  await page.getByRole("button", { name: /^Delete Ritual grid$/ }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete", exact: true }).click();

  await expect(page.getByRole("button", { name: /^Delete Ritual grid$/ })).toHaveCount(0);

  await page.getByRole("button", { name: "Undo" }).click();
  await page.waitForTimeout(700);

  await expect(page.getByRole("button", { name: /^Delete Ritual grid$/ })).toBeVisible();
  expect(await order(), "undo must restore position, not append").toEqual(before);
});

/* ---------------------------------------------------------------- */
/* ERROR -> USEFUL RECOVERY                                          */
/* ---------------------------------------------------------------- */

/**
 * Honest limitation: error.tsx cannot be rendered from a browser test
 * without shipping a route that deliberately throws, which does not belong
 * in the product. Every route here is statically prerendered, so its HTML
 * arrives intact even when the client chunk is sabotaged — the boundary
 * never gets anything to catch.
 *
 * So these assert the contract at the source level. Weaker than a render
 * test, and named for what they actually check: they catch the boundary
 * being deleted, or its recovery affordances being removed, which is the
 * realistic regression.
 */
test("both error boundaries exist and offer recovery", () => {
  const route = readFileSync("src/app/error.tsx", "utf8");
  const global = readFileSync("src/app/global-error.tsx", "utf8");

  for (const [name, src] of [
    ["error.tsx", route],
    ["global-error.tsx", global],
  ] as const) {
    expect(src, `${name} must be a client component`).toContain('"use client"');
    expect(src, `${name} must accept reset()`).toMatch(/reset/);
    expect(src, `${name} must surface the digest the user can quote`).toMatch(/digest/);
  }

  /* The thing a crash actually makes people afraid of. */
  expect(route).toMatch(/business is fine/i);
  expect(route).toMatch(/Try this page again/);

  /* global-error replaces <html>, so it must not import from the design
     system it may be the casualty of. */
  expect(global).toContain("<html");
  expect(global).not.toMatch(/from "@\/components/);
});

test("a failing route never falls through to Next's default error page", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.route("**/_next/static/chunks/app/analytics/**", (r) => r.abort());
  await page.goto("/analytics").catch(() => {});
  await page.waitForTimeout(2000);

  const body = (await page.locator("body").textContent()) || "";
  expect(body).not.toContain("Application error: a client-side exception");
  /* Whatever happened, the user must still have the product around them. */
  expect(body).toMatch(/OGMJ/);
});
