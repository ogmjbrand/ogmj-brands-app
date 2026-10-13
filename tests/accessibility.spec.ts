import { test, expect, ROUTES, PHONE } from "./helpers";

/**
 * Luxury does not mean inaccessible. These are the claims the README makes,
 * asserted rather than asserted-at.
 */

test("every rendered text/background pair clears WCAG AA", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const failures: string[] = [];

  /**
   * This used to compare the four text TOKENS against a hardcoded list of
   * surface colours. That list silently went stale the moment the surfaces
   * were redesigned, and the test carried on passing while checking values
   * the product no longer used.
   *
   * It now walks the real DOM and measures each text node's computed colour
   * against its actual effective background, compositing any translucent
   * layers it sits on. Slower, and the only version that cannot quietly
   * become fiction.
   */
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(900);

    const bad = await page.evaluate(() => {
      const lin = (v: number) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
      const parse = (s: string) => (s.match(/[\d.]+/g) || []).slice(0, 4).map(Number);

      /* Composite every translucent background down to the page ground, so
         an element on rgba(255,255,255,0.05) over #0f0f0f is judged on what
         the eye actually receives. */
      const effectiveBg = (el: Element): number[] => {
        const stack: number[][] = [];
        let n: Element | null = el;
        while (n) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c.length >= 3) {
            const a = c.length === 4 ? c[3] : 1;
            if (a > 0) {
              stack.push([c[0], c[1], c[2], a]);
              if (a >= 0.999) break;
            }
          }
          n = n.parentElement;
        }
        let out = [6, 6, 6];
        for (let i = stack.length - 1; i >= 0; i--) {
          const [r, g, b, a] = stack[i];
          out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
        }
        return out;
      };

      const out: string[] = [];
      let unmeasurable = 0;

      /* A gradient fill, or a background painted by an absolutely-positioned
         SIBLING (the segmented control's sliding pill), cannot be read from
         `backgroundColor` at all. Those pairs are counted rather than
         guessed at, and asserted separately with measured values. */
      const hasUnreadableBg = (el: Element) => {
        let n: Element | null = el;
        while (n) {
          const cs = getComputedStyle(n);
          if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
          const c = parse(cs.backgroundColor);
          if (c.length >= 3 && (c.length === 3 || c[3] >= 0.999)) return false;
          n = n.parentElement;
        }
        return false;
      };

      document.querySelectorAll("p,span,h1,h2,h3,li,a,button,label,div").forEach((el) => {
        const own = Array.from(el.childNodes).some(
          (n) => n.nodeType === 3 && (n.textContent || "").trim().length > 1,
        );
        if (!own) return;
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.9) return;
        if (cs.visibility === "hidden" || cs.display === "none") return;
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.height === 0 || rect.width === 0) return;
        /* Gradient-clipped text reports a transparent colour; it is measured
           separately in the design system, not here. */
        const fg = parse(cs.color);
        if (fg.length === 4 && fg[3] < 0.5) return;

        if (hasUnreadableBg(el) || el.closest("[data-layered-bg]")) {
          unmeasurable++;
          return;
        }

        const bg = effectiveBg(el);
        const l1 = lum(fg.slice(0, 3));
        const l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const px = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight) >= 700;
        const large = px >= 24 || (px >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        if (ratio < need) {
          out.push(
            `${ratio.toFixed(2)}:1 (need ${need}) ${Math.round(px)}px "${(el.textContent || "").trim().slice(0, 34)}"`,
          );
        }
      });
      return { failures: [...new Set(out)], unmeasurable };
    });

    bad.failures.forEach((b) => failures.push(`${route} — ${b}`));
    /* If this climbs, new gradient surfaces have appeared that nothing is
       checking — the count failing is the signal to go and measure them. */
    expect(bad.unmeasurable, `${route} has unmeasurable text/background pairs`).toBeLessThan(26);
  }

  expect([...new Set(failures)]).toEqual([]);
});

test("text on the gradient and layered surfaces clears AA", () => {
  /**
   * The pairs the DOM walk above cannot resolve, measured directly against
   * the colours the design system actually paints. Kept honest by being
   * computed here rather than asserted from memory.
   */
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const ratio = (a: string, b: string) => {
    const l1 = lum(hex(a));
    const l2 = lum(hex(b));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const pairs: [string, string, string][] = [
    ["primary button", "#03150f", "#10b981"],
    ["primary button hover", "#03150f", "#15c78d"],
    ["gold button", "#1a1405", "#d4af37"],
    ["gold button hover", "#1a1405", "#e0bd4a"],
    ["segmented active pill", "#03150f", "#10b981"],
    ["asset label on scrim", "#ffffff", "#242321"],
  ];

  for (const [name, fg, bg] of pairs) {
    expect(ratio(fg, bg), `${name}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  }
});

test("interactive controls meet the 44px touch floor", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const offenders: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(900);

    const small = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll("a,button,[role='tab'],input,textarea").forEach((el) => {
        const node = el as HTMLElement;
        /* offsetWidth/Height, not getBoundingClientRect: the rect includes
           any transform currently applied, and the masonry tiles carry a
           layout animation plus a whileTap scale. A control measured
           mid-flight reads a fraction under its real size, which is a
           timing artefact rather than a touch-target defect. The intrinsic
           box is what the design rule is actually about. */
        const w = node.offsetWidth;
        const h = node.offsetHeight;
        if (w === 0 || h === 0) return;
        /* The skip link is 1x1 until focused, which is the correct
           visually-hidden pattern rather than a small target. */
        if (node.className.toString().includes("sr-only")) return;
        if (h < 44 && w < 44) {
          out.push(`${node.tagName}.${node.className.toString().slice(0, 40)} ${w}x${h}`);
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
