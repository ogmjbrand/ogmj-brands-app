import { test, expect, contrast, ROUTES, PHONE } from "./helpers";

/**
 * Luxury does not mean inaccessible. These are the claims the README makes,
 * asserted rather than asserted-at.
 */

test("every text step clears WCAG AA against the lightest surface", async ({ page }) => {
  await page.goto("/");

  /* Worst case is the lightest ground in the system, not pure black —
     checking only against #050505 is how a ramp passes review and still
     fails in a lifted card. */
  const grounds = [
    [9, 10, 10],
    [13, 15, 14],
    [19, 21, 19],
    [25, 29, 27],
  ];

  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return ["--color-t-high", "--color-t-mid", "--color-t-low", "--color-t-faint"].map((n) => ({
      name: n,
      value: cs.getPropertyValue(n).trim(),
    }));
  });

  expect(tokens.length).toBe(4);

  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  for (const t of tokens) {
    const worst = Math.min(...grounds.map((g) => contrast(hex(t.value), g)));
    expect(worst, `${t.name} (${t.value}) worst-case contrast`).toBeGreaterThanOrEqual(4.5);
  }
});

test("interactive controls meet the 44px touch floor", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const offenders: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(400);

    const small = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll("a,button,[role='tab'],input,textarea").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        /* The skip link is 1x1 until focused, which is the correct
           visually-hidden pattern rather than a small target. */
        if (el.className.toString().includes("sr-only")) return;
        if (r.height < 44 && r.width < 44) {
          out.push(`${el.tagName}.${el.className.toString().slice(0, 40)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      return out;
    });

    small.forEach((s) => offenders.push(`${route}: ${s}`));
  }

  expect([...new Set(offenders)]).toEqual([]);
});

test("every control has an accessible name", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const unnamed: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(400);

    /* Computed in one pass in the page rather than one round-trip per
       element: the assertion is identical, the wall time is not. */
    const found = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll("button, a, input, textarea, select").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const labelled = el.getAttribute("aria-label")?.trim();
        const described = el.getAttribute("aria-labelledby");
        const id = el.getAttribute("id");
        const label = id ? document.querySelector(`label[for="${id}"]`)?.textContent?.trim() : "";
        const text = (el.textContent || "").trim();
        const title = el.getAttribute("title")?.trim();
        if (!labelled && !described && !label && !text && !title) {
          out.push(`${el.tagName}.${el.className.toString().slice(0, 40)}`);
        }
      });
      return out;
    });

    found.forEach((f) => unnamed.push(`${route}: ${f}`));
  }

  expect([...new Set(unnamed)]).toEqual([]);
});

test("direction is never carried by colour alone", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(900);

  /* A delta must pair its colour with a glyph and a word, so the figure
     reads the same to someone who cannot distinguish the hues. */
  const delta = page.locator("text=/^\\+?\\d+\\.\\d%$/").first();
  const hasArrow = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("span")).find((s) =>
      /\+32\.8%/.test(s.textContent || ""),
    );
    return !!el?.querySelector("svg") && /increase|decrease/.test(el.textContent || "");
  });
  expect(hasArrow, "delta must include an arrow and a screen-reader word").toBe(true);
  await expect(delta.first()).toBeVisible();
});

test("the skip link is the first tab stop and becomes visible", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(800);
  await page.keyboard.press("Tab");

  const first = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    return { text: (el.textContent || "").trim(), height: Math.round(r.height) };
  });

  expect(first.text).toMatch(/skip/i);
  expect(first.height, "skip link must be visible once focused").toBeGreaterThan(36);
});

test("every focused control shows a focus ring", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(800);

  const missing: string[] = [];
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
        ring: cs.boxShadow !== "none" || cs.outlineStyle !== "none",
        visible: r.width > 0 && r.height > 0,
      };
    });
    if (info?.visible && !info.ring) missing.push(`${info.tag} "${info.text}"`);
  }

  expect([...new Set(missing)]).toEqual([]);
});
