import { test as base, expect, type Page } from "@playwright/test";

/** Phone-first: this is the viewport the product is designed at. */
export const PHONE = { width: 390, height: 844 };
export const DESKTOP = { width: 1440, height: 900 };

/** Every route in the product. */
export const ROUTES = [
  "/",
  "/create",
  "/build",
  "/brand",
  "/website",
  "/studio",
  "/grow",
  "/content",
  "/social",
  "/marketing",
  "/revenue",
  "/crm",
  "/analytics",
  "/services",
];

/**
 * A fresh browser context is, correctly, a first-time visitor — so it gets
 * redirected to onboarding. Every suite except the first-run one wants a
 * returning visitor, so this fixture seeds the flag before the first
 * navigation.
 */
export const test = base.extend<{ seeded: void }>({
  seeded: [
    async ({ context }, use) => {
      await context.addInitScript(() => {
        try {
          localStorage.setItem("ogmj.onboarded", "1");
        } catch {
          /* fail open, same as the product */
        }
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect };

/** Collects console and page errors for the life of a page. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

/** Relative luminance per WCAG 2.x. */
export function luminance([r, g, b]: number[]): number {
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: number[], b: number[]): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
