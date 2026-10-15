# Automated testing

Verified on 15 October 2026: 14 frontend, 58 backend and 18 Playwright tests passed.
The web production build and Android bundle export succeeded. Test database
cleanup was confirmed.

Use Node.js 22, .NET SDK 8 or 9 and a local SQL Server default instance. Both
repositories must be checked out next to each other as web/ and backend/.

## Frontend regression tests

From web/:

```powershell
npm ci
npm test -- --watchAll=false --runInBand
npm run build
```

## Backend integration tests

From backend/:

```powershell
dotnet restore CleanMate.sln
dotnet build CleanMate.sln --no-restore
dotnet test CleanMate.Tests/CleanMate.Tests.csproj --no-build --no-restore
```

The Windows account running the tests needs permission to create and drop test
databases. Tests use generated database names and never use application data.
Both provider models and the generated PostgreSQL migration script are checked.

## Playwright system tests

After building the backend, run from web/:

```powershell
npx playwright install chromium
npm run build:e2e
npm run test:e2e
```

Playwright starts the real React production build, API and MVC cleaner portal on
loopback ports 13000, 15238 and 15080. The production test build is written to
.e2e-build/ without modifying .env or the normal deployment build.

Nine scenarios run on desktop Chromium and a Pixel 7 browser viewport:

- Guest routes require login; the legacy QR page explains direct cash payment.
- Browser registration, booking, cleaner acceptance, start and completion;
  the customer's order shows the assigned cleaner's name and phone after refresh,
  with a telephone link. Unassigned orders show no contact or call link.
  Booking uses a different contact name/phone from the account; cleaner lists
  and customer order history show that booking contact. Invalid contact phone
  is blocked before confirmation.
  Customer confirmation and rating do not mark cash received. The assigned
  cleaner separately declares receipt of cash. Both records survive reloads.
- Cancellation retains pending-order history.
- Cleaner permissions and order ownership are enforced.
- Invalid bookings and client-supplied prices are rejected; provider checkout
  routes return 410 Gone and availability always reports direct cash only.
- MVC cleaner registration and job progression through cash confirmation.
- A conflicting update from another device reloads the actual job state.
- A stale overlapping claim is rejected and removed on refresh; adjacent jobs
  can be accepted, but starting the next job waits until the active one finishes.
- The MVC portal displays a concurrent-start conflict from the API, disables
  starting another job, and unlocks it after completion.

No business API responses are mocked. There is no payment gateway or simulated
provider. Test accounts are synthetic. Each run creates its own
CleanMateSystemTests_<guid> database. Teardown waits for confirmation that this
database was deleted. The integration suite uses CleanMateTests_<guid>.

To override the local SQL Server connection, set CLEANMATE_TEST_SQL in the test
terminal; its database name is always replaced with a generated test-only name.

Reports are written under playwright-report/ and test-results/:

```powershell
npm run test:e2e:report
```

Failed runs retain traces, screenshots and video. Artifacts are ignored by Git.

## Product model and scope

The customer hands cash to the cleaner after the job. CleanMate does not collect,
hold, transfer or refund funds and does not calculate commissions or payouts.
The payment label explicitly attributes receipt confirmation to the cleaner.
Customer confirmation/rating records service quality independently of cash.

Accepted and InProgress jobs reserve their scheduled start/end interval. Jobs
overlapping a cleaner's reservations are hidden and cannot be claimed through
either acceptance route. Adjacent jobs are allowed without a travel buffer.
Only one job may be InProgress per cleaner. Web, native mobile and MVC show
planned start/end times and disable starting another job while one is active.
The server enforces these rules for stale screens and concurrent requests.

Customer orders show the assigned cleaner's current name and phone number. Web
offers a status refresh button and a telephone link; native mobile opens the
device dialer with an error message if unavailable. Missing or unusable numbers
have no call action. The owner-scoped orders API supplies this contact; it does
not include cleaner email, home address or authentication data in the object.
Playwright checks the link target without placing a call. Native dialer behavior
requires a device check.

Booking name/phone are persisted per order and shown as the contact person,
independently of account ownership and the assigned cleaner's contact details.
Changes to the customer's profile do not alter the contact on new bookings.
Legacy rows retain their previous profile fallback. Deploy the backend booking
contact migration before serving the updated API. Tests migrate isolated local
databases; they do not update application databases.

Earlier online-payment API routes are retired even if old enabled configuration
values remain. Old provider schema/history is retained, not relabelled as cash.
The interface exposes no online checkout options, payment links or gateway calls.

The mobile Chromium project tests the responsive website, not the native Expo
app. Native Android export is a separate build check. Device interaction, real
Google OAuth, deployment and a live PostgreSQL upgrade require separate checks.
