const { spawnSync } = require("node:child_process");

// Build a separate artifact; never change .env or the normal deployment build.
const result = spawnSync(process.execPath, [require.resolve("react-scripts/scripts/build")], {
  stdio: "inherit",
  env: { ...process.env, REACT_APP_API_URL: "http://127.0.0.1:15238", BUILD_PATH: ".e2e-build" },
});
process.exit(result.status ?? 1);
