import { test, expect, PHONE } from "./helpers";

/**
 * PERFORMANCE
 *
 * The brief asks for 60fps animation, GPU-friendly transforms and no jank.
 * Those were asserted in comments for most of this project's life; this is
 * where they become checkable.
 *
 * Thresholds are deliberately generous relative to what the product
 * currently measures, because a CI runner is noisy and a flaky performance
 * test gets disabled, which is worse than no test. They are set to catch a
 * real regression — a chart library added to the bundle, an animation moved
 * off the compositor, a layout shift introduced by a late-loading element —
 * not to police single-digit variance.
 *
 * Measured locally under a 4x CPU throttle (mid-range phone): first paint
 * ~440ms, LCP 230-980ms, CLS <= 0.008, median frame ~16ms, zero frames
 * below 30fps on any route.
 */

/* Core Web Vitals "good" thresholds, which is the right bar for a product
   that claims to feel expensive. */
const CLS_BUDGET = 0.1;
const LCP_BUDGET_MS = 2500;
/* Measured over the wire: 185kB before load, 17kB of route prefetch.
   Budgets carry headroom for ordinary growth but would catch something
   like a charting library being pulled in. */
const INITIAL_JS_BUDGET_KB = 260;
const PREFETCH_BUDGET_KB = 80;

test("no route shifts its layout while loading", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const offenders: string[] = [];

  for (const route of ["/", "/studio", "/analytics", "/crm", "/social"]) {
    await page.goto(route);
    await page.waitForTimeout(2500);

    const cls = await page.evaluate(
      () =>
        new Promise<number>((res) => {
          let total = 0;
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) {
              const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!s.hadRecentInput) total += s.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => res(Number(total.toFixed(4))), 600);
        }),
    );

    if (cls > CLS_BUDGET) offenders.push(`${route}: CLS ${cls}`);
  }

  expect(offenders).toEqual([]);
});

test("the dashboard paints its largest element quickly", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.waitForTimeout(2500);

  const lcp = await page.evaluate(
    () =>
      new Promise<number>((res) => {
        let v = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) v = Math.max(v, e.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => res(Math.round(v)), 600);
      }),
  );

  expect(lcp, `LCP ${lcp}ms`).toBeLessThan(LCP_BUDGET_MS);
});

test("scrolling the heaviest screens holds frame rate", async ({ page }) => {
  await page.setViewportSize(PHONE);
  const offenders: string[] = [];

  /* The dashboard runs the marquee, the scroll-linked energy spine, counters
     and drawn charts at once; Studio runs per-tile parallax over a masonry
     layout. If anything has fallen off the compositor, it shows up here. */
  for (const route of ["/", "/studio"]) {
    await page.goto(route);
    await page.waitForTimeout(1500);

    const pacing = await page.evaluate(
      () =>
        new Promise<{ dropped: number; frames: number; worst: number }>((res) => {
          const times: number[] = [];
          let last = performance.now();
          let y = 0;
          const target = document.body.scrollHeight - window.innerHeight;
          const step = () => {
            const now = performance.now();
            times.push(now - last);
            last = now;
            y = Math.min(y + 24, target);
            window.scrollTo(0, y);
            if (y < target && times.length < 180) requestAnimationFrame(step);
            else {
              /* Ignore the first frames: they include the scroll starting up
                 rather than steady-state rendering. */
              const steady = times.slice(3);
              res({
                frames: steady.length,
                dropped: steady.filter((t) => t > 50).length,
                worst: Math.round(Math.max(...steady)),
              });
            }
          };
          requestAnimationFrame(step);
        }),
    );

    const droppedPct = (pacing.dropped / Math.max(pacing.frames, 1)) * 100;
    if (droppedPct > 10) {
      offenders.push(`${route}: ${droppedPct.toFixed(1)}% of frames over 50ms (worst ${pacing.worst}ms)`);
    }
  }

  expect(offenders).toEqual([]);
});

test("the JavaScript budget holds", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(2500);

  /**
   * encodedBodySize — bytes over the wire, which is what actually costs the
   * user. Reading response bodies instead measures DECOMPRESSED size and
   * reports roughly three times the real figure; a budget set against that
   * number would be meaningless.
   *
   * Prefetch is counted separately rather than lumped in: Next prefetches
   * route chunks for visible links, and that is a deliberate trade of a few
   * kilobytes for instant navigation. A budget that punished it would be
   * pushing the product the wrong way.
   */
  const size = await page.evaluate(() => {
    const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const loadEnd = nav?.loadEventEnd ?? 0;
    const js = entries.filter((e) => e.name.includes("/_next/static/") && e.name.endsWith(".js"));
    const sum = (list: PerformanceResourceTiming[]) =>
      Math.round(list.reduce((t, e) => t + (e.encodedBodySize || 0), 0) / 1024);
    return {
      initial: sum(js.filter((e) => e.startTime <= loadEnd)),
      prefetch: sum(js.filter((e) => e.startTime > loadEnd)),
    };
  });

  expect(size.initial, `dashboard shipped ${size.initial}kB of JS before load`).toBeLessThan(
    INITIAL_JS_BUDGET_KB,
  );
  expect(size.prefetch, `route prefetch pulled ${size.prefetch}kB`).toBeLessThan(PREFETCH_BUDGET_KB);
});

test("ambient animation is driven by transform, never by layout", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await page.waitForTimeout(1200);

  /* An animation on width/left/top forces layout on every frame and is the
     usual cause of scroll jank. The marquee and the energy flow must both
     animate transform only. */
  const animated = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(".ogmj-marquee, .energy-flow"))) {
      const names = getComputedStyle(el).animationName.split(",").map((n) => n.trim());
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSKeyframesRule && names.includes(rule.name)) {
            for (const frame of Array.from(rule.cssRules) as CSSStyleRule[]) {
              const text = frame.style.cssText;
              if (/(^|[^-])(width|height|top|left|right|bottom|margin)\s*:/.test(text)) {
                out.push(`${rule.name} animates layout: ${text.slice(0, 60)}`);
              }
            }
          }
        }
      }
    }
    return out;
  });

  expect([...new Set(animated)]).toEqual([]);
});
