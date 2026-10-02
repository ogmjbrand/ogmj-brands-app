import { test, expect, ROUTES, PHONE } from "./helpers";
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * ROUTE INTEGRITY
 *
 * These exist because of a real failure: `.gitignore` carried a bare `build`
 * pattern, which matches a directory named `build` at ANY depth — including
 * the `src/app/build` route. The Build hub, one of five primary navigation
 * destinations, was therefore never committed. Every check passed locally
 * because the working directory had the file; a fresh clone did not, and the
 * tab led to a 404.
 *
 * A browser test alone would not have caught it either, since it ran against
 * the same working directory. So one test checks the running app, and one
 * checks the repository.
 */

const APP_DIR = path.join(process.cwd(), "src", "app");

test("every route on disk is tracked by git", () => {
  const tracked = new Set(
    execFileSync("git", ["ls-files", "src/app"], { encoding: "utf8" }).trim().split("\n"),
  );

  const untracked: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/^(page|layout|not-found)\.tsx$/.test(entry.name)) {
        const rel = path.relative(process.cwd(), full);
        if (!tracked.has(rel)) untracked.push(rel);
      }
    }
  };
  walk(APP_DIR);

  expect(untracked, "a route exists on disk but is excluded from version control").toEqual([]);
});

test("every route the app advertises has a page on disk", () => {
  const missing = ROUTES.filter((r) => {
    const dir = r === "/" ? APP_DIR : path.join(APP_DIR, r.slice(1));
    return !existsSync(path.join(dir, "page.tsx"));
  });
  expect(missing).toEqual([]);
});

test("no primary navigation destination is a dead end", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await expect(page.getByText("is accelerating.")).toBeVisible();

  /* Collect every internal href the chrome offers, then confirm each one
     resolves to a real page rather than the not-found surface. */
  const hrefs: string[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll('nav a[href^="/"]'))
      .map((a) => a.getAttribute("href")!)
      .filter((h, i, all) => all.indexOf(h) === i),
  );

  expect(hrefs.length).toBeGreaterThan(4);

  const dead: string[] = [];
  for (const href of hrefs) {
    const res = await page.request.get(href);
    if (res.status() === 404) dead.push(`${href} -> 404`);
  }
  expect(dead, "a navigation tab points at a route that does not exist").toEqual([]);
});
