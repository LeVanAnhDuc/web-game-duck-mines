import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
// Second static server for the flag-ON build (pnpm build:e2e-auth -> out-auth/),
// used only by e2e/ducker-id-sign-in.spec.ts. The flag-off build above is untouched.
const AUTH_PORT = 4391;
const AUTH_URL = `http://127.0.0.1:${AUTH_PORT}`;
const AUTH_SPEC = /ducker-id-sign-in\.spec\.ts/;

/**
 * The e2e suite runs against the STATIC EXPORT, not a dev server: that is what
 * GitHub Pages will serve, so it is what gets tested. `next start` cannot serve an
 * exported site, hence scripts/serve.mjs over `out/` - concurrent, because four
 * projects run in parallel and a single-threaded server starves under them in a way
 * that reads exactly like application bugs.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile-375", testIgnore: AUTH_SPEC, use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 720 } } },
    { name: "tablet-768", testIgnore: AUTH_SPEC, use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 900 } } },
    { name: "laptop-1024", testIgnore: AUTH_SPEC, use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "desktop-1440", testIgnore: AUTH_SPEC, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // A real touch screen, because the two-phase gesture cannot be exercised with a
    // mouse - the whole point of it is that it branches on pointerType (ADR-0004).
    { name: "touch-phone", testIgnore: AUTH_SPEC, use: { ...devices["Pixel 5"] } },
    // Ducker ID sign-in against the flag-on build (ADR-0013).
    {
      name: "auth-375",
      testMatch: AUTH_SPEC,
      use: { ...devices["Desktop Chrome"], baseURL: AUTH_URL, viewport: { width: 375, height: 720 } },
    },
    {
      name: "auth-1024",
      testMatch: AUTH_SPEC,
      use: { ...devices["Desktop Chrome"], baseURL: AUTH_URL, viewport: { width: 1024, height: 768 } },
    },
  ],
  webServer: [
    {
      command: `node scripts/serve.mjs ${PORT} out`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: `node scripts/serve.mjs ${AUTH_PORT} out-auth`,
      url: AUTH_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
