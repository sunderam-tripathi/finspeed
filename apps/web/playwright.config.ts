import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.WEB_E2E_PORT || '3100';
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`
  },
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome']
    }
  ],
  webServer: skipWebServer
    ? undefined
    : {
        command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
        url: `http://127.0.0.1:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...process.env,
          // Dev/CI invitation passphrase is the well-known word "preview"
          // (WEB-040). Production uses a steward-set secret; this hash never
          // gates anything real.
          DISTRIBUTOR_ACCESS_HASH:
            'scrypt$16384$8$1$Zmluc3BlZWQtZGV2LXByZQ$x65US9uga_xLKxytyfAhVT_i7ZPVkOBp6J1KVhkoiGY'
        }
      }
});
