import { test, expect, PHONE } from "./helpers";

/**
 * AMBIENT MOTION — the rules from lib/motion.ts, enforced.
 *
 * A marquee and a parallax are the two easiest ways to make a product look
 * cheap, so the constraints that keep them honest are tested rather than
 * documented.
 */

const RAIL = '[aria-label="Services connected to your business"]';

test("the rail drifts", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
  await page.waitForTimeout(1200);

  const track = page.locator(".ogmj-marquee").first();
  await expect(track).toHaveCount(1);

  const before = await track.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(1300);
  const after = await track.evaluate((el) => getComputedStyle(el).transform);
  expect(after, "marquee transform should advance").not.toBe(before);
});

test("the rail pauses on hover, so it can be read", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
  await page.waitForTimeout(1200);

  /* Hover the static container: Playwright refuses to hover a moving
     element ("not stable"), which is itself evidence it is animating. */
  await page.locator(RAIL).hover();
  await page.waitForTimeout(400);

  const track = page.locator(".ogmj-marquee").first();
  const a = await track.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(900);
  const b = await track.evaluate((el) => getComputedStyle(el).transform);
  expect(b, "marquee must pause under the pointer").toBe(a);
});

test("nothing inside a rail is interactive", async ({ page }) => {
  await page.setViewportSize(PHONE);

  for (const route of ["/", "/services"]) {
    await page.goto(route);
    await page.waitForTimeout(900);

    const focusables = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".ogmj-marquee")).reduce(
        (n, m) =>
          n + m.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])').length,
        0,
      ),
    );

    /* A moving tap target is a usability failure: the user aims and the
       thing has left. Rails carry display content only. */
    expect(focusables, `${route} has interactive content in a drifting rail`).toBe(0);
  }
});

test("a screen reader hears the rail once, not twice", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.waitForTimeout(900);

  const ok = await page.evaluate(() => {
    const m = document.querySelector(".ogmj-marquee");
    if (!m) return false;
    /* The track is duplicated to make the loop seamless; the copy must be
       hidden from assistive tech. */
    return m.children.length === 2 && m.children[1].getAttribute("aria-hidden") === "true";
  });
  expect(ok).toBe(true);
});

test("reduced motion stops the rail dead, without hiding its content", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("ogmj.onboarded", "1");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
  await page.waitForTimeout(1000);

  const track = page.locator(".ogmj-marquee").first();
  const state = await track.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { name: cs.animationName, transform: cs.transform };
  });
  expect(state.name, "animation must be removed, not merely sped to zero").toBe("none");

  const visible = await track.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  expect(visible, "stopping the motion must not remove the content").toBe(true);

  await context.close();
});

test("reduced motion leaves nothing stuck invisible", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("ogmj.onboarded", "1");
    } catch {}
  });
  const page = await context.newPage();

  /* Motion reduces to a state change; it never reduces to nothing. If a
     reveal animation is skipped by setting opacity 0 and never restoring
     it, content silently disappears for these users. */
  for (const route of ["/", "/create", "/analytics", "/crm", "/studio"]) {
    await page.goto(route);
    await page.waitForTimeout(1200);
    const hidden = await page.evaluate(() => {
      let n = 0;
      document.querySelectorAll("h1,h2,p,li,button").forEach((el) => {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.08 && el.getBoundingClientRect().height > 0) n++;
      });
      return n;
    });
    expect(hidden, `${route} hides content under reduced motion`).toBe(0);
  }

  await context.close();
});

test("parallax stays inside its 8px ceiling and never collides", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/studio");
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 150));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(1400);

  const offsets = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".break-inside-avoid")).map((tile) => {
      /* The Parallax wrapper is unclassed; the translated node is inside. */
      let best = 0;
      tile.querySelectorAll("div").forEach((el) => {
        const m = new DOMMatrix(getComputedStyle(el).transform);
        if (Math.abs(m.m42) > Math.abs(best)) best = m.m42;
      });
      return Math.round(best * 10) / 10;
    }),
  );

  expect(offsets.length).toBeGreaterThan(3);
  /* Irregular rates: a shared rate resolves into visible rows and defeats
     the depth the technique exists for. */
  expect(new Set(offsets).size, "tiles must travel at differing rates").toBeGreaterThan(1);
  for (const y of offsets) {
    expect(Math.abs(y), "parallax exceeds the 8px ceiling").toBeLessThanOrEqual(8.5);
  }

  const overlaps = await page.evaluate(() => {
    const boxes = Array.from(document.querySelectorAll(".break-inside-avoid")).map((t) =>
      t.getBoundingClientRect(),
    );
    let hits = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2)
          hits++;
      }
    }
    return hits;
  });
  expect(overlaps, "parallax travel must never close the gap between tiles").toBe(0);
});
