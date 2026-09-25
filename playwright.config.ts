import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${process.env.ATLAS_E2E_PORT ?? 4174}`,
    ...devices['Desktop Chrome'],
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && node dist-server/scripts/e2e-server.js',
    url: `http://127.0.0.1:${process.env.ATLAS_E2E_PORT ?? 4174}/api/v1/ready`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
