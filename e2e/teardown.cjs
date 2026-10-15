module.exports = async () => {
  // Windows forcibly kills webServer processes. Ask the isolated host to shut down first
  // so its finally block can remove only the database created for this test run.
  try {
    const fs = require("node:fs");
    const path = require("node:path");
    const cleanupFile = path.resolve(__dirname, "../test-results/system-host-cleanup.json");
    // Clear only this generated run marker, never application or database files.
    if (fs.existsSync(cleanupFile)) fs.unlinkSync(cleanupFile);
    await fetch("http://127.0.0.1:13000/__system-tests/shutdown", {
      method: "POST", signal: AbortSignal.timeout(5000),
    });
    for (let attempt = 0; attempt < 200; attempt++) {
      if (fs.existsSync(cleanupFile)) {
        const cleanup = JSON.parse(fs.readFileSync(cleanupFile, "utf8"));
        if (cleanup.cleaned === true && cleanup.database.startsWith("CleanMateSystemTests_")) return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error("System-test database cleanup did not complete in time.");
  } catch (error) {
    if (error.cause?.code !== "ECONNREFUSED") throw error;
  }
};
