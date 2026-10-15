# Automated testing

Verified on 15 October 2026: 9 frontend tests, 29 backend tests and all 14
Playwright system tests passed. Backend build, React production build and Android
bundle export succeeded. The browser run confirmed test-database cleanup.

Use Node.js 22, .NET SDK 8 or 9, and a local SQL Server default instance. The Windows
account running the tests needs permission to create and drop test databases.
Both the frontend and backend repositories must be checked out next to each other
as `web/` and `backend/`.

## Frontend regression tests

From `web/`:

```powershell
npm ci
npm test -- --watchAll=false --runInBand
npm run build
```

## Backend integration tests

From `backend/`:

```powershell
dotnet restore CleanMate.sln
dotnet build CleanMate.sln --no-restore
dotnet test CleanMate.Tests/CleanMate.Tests.csproj --no-build --no-restore
```

These tests migrate a fresh SQL Server database before exercising authentication,
booking pricing, validation, cancellation, concurrent claims and the cleaner portal.
They also compare both provider models with their migration snapshots and generate
the PostgreSQL migration script without connecting to PostgreSQL.

## Playwright system tests

After building the backend, run from `web/`:

```powershell
npx playwright install chromium
npm run build:e2e
npm run test:e2e
```

Playwright starts the real React production build, API and MVC cleaner portal on
loopback ports `13000`, `15238` and `15080`. Stop any processes already using those
ports first. The test build goes into `.e2e-build/`; it does not change `.env` or
the normal deployment build.

The suite runs seven scenarios on desktop Chromium and a Pixel 7 browser viewport:

- Guest route protection and disabled online payment confirmation.
- Browser registration, login, booking, cleaner acceptance, start, completion and
  cash collection; dismissing collection confirmation leaves the order unpaid.
  Customer progress, payment state and UTC timestamps persist across reloads.
- Pending-order cancellation with history retained after reload.
- Cleaner permissions and order ownership.
- Invalid booking rejection and protection against client-supplied prices.
- MVC cleaner registration, acceptance, start, completion and cash collection
  through the API, with the paid state visible to the customer.
- Conflicting updates from another device reload the actual server state.

No business API responses are mocked. Test accounts are synthetic. Every run uses
a new `CleanMateSystemTests_<guid>` database, and teardown waits for confirmation
that this database was deleted. The integration suite uses `CleanMateTests_<guid>`.
Neither suite uses application connection strings or existing application data.

To use a different SQL Server instance, set `CLEANMATE_TEST_SQL` in the test terminal.
The test host always replaces its database name with a generated test-only name.
Do not commit credentials.

Reports are generated under `playwright-report/` and `test-results/`:

```powershell
npm run test:e2e:report
```

The HTML and JSON reports include per-scenario results. Failed runs retain browser
traces, screenshots and video. These artifacts are ignored by Git.

## Scope

The mobile Chromium project tests the responsive website, not the native Expo app.
Native Android bundle generation is a separate check. Real Google OAuth, MoMo,
production deployment, other browser engines and a live PostgreSQL upgrade are
outside this suite.
