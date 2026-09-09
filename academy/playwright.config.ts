import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"
import { resolveTestDatabaseUrl } from "./lib/test-database"

dotenv.config({ path: ".env.test.local", override: true })
dotenv.config({ path: ".env.local" })
const testDatabaseUrl = resolveTestDatabaseUrl()
process.env.ACADEMY_TEST_DATABASE_URL = testDatabaseUrl
process.env.ACADEMY_DATABASE_URL = testDatabaseUrl
process.env.ACADEMY_DIRECT_DATABASE_URL = testDatabaseUrl
Object.assign(process.env, { NODE_ENV: "test" })
process.env.PAYNOW_TEST_MODE = "mock"
process.env.E2E_TEST_MODE = "1"
process.env.ACADEMY_HOSTS = [process.env.ACADEMY_HOSTS, "127.0.0.1", "localhost"].filter(Boolean).join(",")

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000"
// Reuse an already-running `npm run dev` locally; always start fresh in CI.
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "node ../node_modules/next/dist/bin/next build && node ../node_modules/next/dist/bin/next start",
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 240_000,
  },
})
