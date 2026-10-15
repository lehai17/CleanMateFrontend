const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  globalTeardown: require.resolve("./e2e/teardown.cjs"),
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:13000",
    timezoneId: "Asia/Bangkok",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "dotnet run --no-build --no-launch-profile --project CleanMate.SystemTests.Host/CleanMate.SystemTests.Host.csproj",
    cwd: path.resolve(__dirname, "../backend"),
    env: { CLEANMATE_E2E_WEB_ROOT: path.resolve(__dirname, ".e2e-build") },
    url: "http://127.0.0.1:13000",
    timeout: 60000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
  },
});
