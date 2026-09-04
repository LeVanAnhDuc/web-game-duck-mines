import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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
    { name: "mobile-375", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 720 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 900 } } },
    { name: "laptop-1024", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // A real touch screen, because the two-phase gesture cannot be exercised with a
    // mouse - the whole point of it is that it branches on pointerType (ADR-0004).
    { name: "touch-phone", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs ${PORT} out`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
