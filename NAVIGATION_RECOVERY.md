# Navigation recovery and keyboard access

Branch: `navigation-recovery`. Customer web unknown routes show a bilingual
recovery page with Home and Services links. The page preserves language/theme
preferences. A keyboard skip link moves focus to page content below the sticky
header; Escape closes the phone menu and returns focus to its trigger.

This is a recovery view inside the existing SPA, not a server HTTP status change.
The build, 48 React tests and all 74 Playwright cases passed on desktop/mobile
with zero failures, skips or flaky tests. New cases verify translated recovery
links, retained dark appearance, skip-link focus and Escape focus restoration.
Generated SQL test database cleanup was verified. No backend/API changes.
