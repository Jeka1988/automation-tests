import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const browserProjectIgnore = [/.*authenticated\/.*\.spec\.ts/, /.*api\/.*\.api\.spec\.ts/];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: !isCI,
  timeout: 45_000,
  expect: {
    timeout: 7_000
  },
  retries: isCI ? 2 : 1,
  workers: isCI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/junit.xml" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://www.saucedemo.com",
    testIdAttribute: "data-test",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/
    },
    {
      name: "api",
      testMatch: /.*api\/.*\.api\.spec\.ts/
    },
    {
      name: "chromium",
      testIgnore: browserProjectIgnore,
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      testIgnore: browserProjectIgnore,
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      testIgnore: browserProjectIgnore,
      use: { ...devices["Desktop Safari"] }
    },
    {
      name: "chromium-auth",
      dependencies: ["setup"],
      testMatch: /.*auth-session\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/standard-user.json"
      }
    }
  ]
});
