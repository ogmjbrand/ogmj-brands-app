import { defineConfig, devices } from "@playwright/test";

/**
 * The design rules in this repo are only real if they are enforced. Comments
 * saying "parallax is capped at 8px" or "gold is jewellery" are aspirations;
 * these specs are the mechanism.
 *
 * CHROMIUM_PATH lets an environment that already ships a browser point at it
 * (this one does: /opt/pw-browsers/chromium). Left unset — the normal case
 * for anyone cloning the repo — Playwright uses the browser it manages
 * itself, after `npx playwright install chromium`.
 */
const executablePath = process.env.CHROMIUM_PATH || undefined;

/* Port is configurable so a run can be pinned away from a server left over
   from an earlier one — reusing a stale build is a very convincing way to
   get a false failure. */
const PORT = Number(process.env.PW_PORT || 3100);
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  /* Every assertion here is about rendered layout or animation state, both of
     which need a beat to settle; the default 5s expect timeout is tight for
     spring-damped motion. */
  expect: { timeout: 8_000 },
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: process.env.BASE_URL || BASE,
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : undefined,
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  /* Tests run against a production build, not the dev server: the things
     being asserted — static prerendering, hydration, compositor-driven
     animation — behave differently under dev's HMR runtime. */
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
