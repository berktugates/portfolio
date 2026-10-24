import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL=https://berktugberke.com runs against a deployed site (no local dev server).
// Prod CI: pnpm test:e2e:prod (see e2e/README.md).
const remoteBaseURL = process.env.E2E_BASE_URL?.replace(/\/$/, "");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: remoteBaseURL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: remoteBaseURL
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        // Yerel .env.local içinde VERCEL_ENV=production olsa bile /gundem e2e'de localhost'ta kalsın.
        env: { ...process.env, VERCEL_ENV: "preview" },
      },
});
