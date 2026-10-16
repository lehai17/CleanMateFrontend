# Automated testing

Login now renders API errors inline and clears the attempted password. A desktop/
mobile system scenario injects 429, verifies the wait message and retries the real
login successfully. Signup inputs cap new passwords at 72 characters; the backend
enforces the stricter 72 UTF-8 byte bound. See ../backend/AUTH_RATE_LIMITS.md.

Verified on 16 October 2026: 29 frontend, 112 backend and 38 customer-web Playwright
tests passed. The separate admin portal passed 16 Playwright cases and 2 server tests;
cleaner-web passed 22 Playwright cases and 9 Node tests.
The web production build and Android bundle export succeeded. Test database
cleanup was confirmed.

Profile → Đổi mật khẩu opens /security. Confirmation is checked before sending;
wrong current passwords retain the session. Success clears credentials and returns
to login. Protected API 401 responses also remove a revoked session. The new system
scenario changes the password, verifies rejection of the old token and signs in
again using the new password.
The same page can revoke all CleanMate sessions without changing the password.
Tests dismiss then accept confirmation, check old-token rejection, and sign in
again with the unchanged password. This also works for Google-only accounts.

Booking support now covers both booking parties, staff resolution and notification
navigation. A real-API scenario drops a committed report response, retries the same
request ID and confirms that only one ticket exists. Staff actions never change
cash records or booking status. Feature scope and remaining work: ../backend/PROJECT_STATUS.md.

To export the customer Android bundle without changing historically tracked build
files, use `expo export --platform android --output-dir .expo/validation-export`.
Native bundle exports passed for both mobile projects; physical-device UI testing
and signing/distribution remain separate checks.

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

The management portal is maintained separately in ../admin. Its README describes
setup and tests. Run its system tests separately from this suite because both
use the same temporary API/MVC host ports. Customer-web tests also verify
application approval before cleaner access. Booking and service pages load
current prices from the API and reject unavailable catalogs rather than quoting
fallback prices. Configure REACT_APP_ADMIN_URL at build time when the management
portal is hosted somewhere other than http://127.0.0.1:3001.

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

Fourteen scenarios run on desktop Chromium and a Pixel 7 browser viewport:

- Guest routes require login; the legacy QR page explains direct cash payment.
- Customer/cleaner inboxes show their own notifications and correct work links;
  single/all read actions and counts persist through reload and account changes.
- Notification pagination appends older items; marking a viewed inbox read leaves
  a newer arrival unread and refresh displays it.
- A real API booking is committed, its response delivery is interrupted, and a
  browser retry returns that same booking with exactly one order in the database.
- Browser registration, booking, cleaner acceptance, start and completion;
  the customer's order shows the assigned cleaner's name and phone after refresh,
  with a telephone link. Unassigned orders show no contact or call link.
  Booking uses a different contact name/phone from the account; cleaner lists
  and customer order history show that booking contact. Invalid contact phone
  is blocked before confirmation.
  Customer confirmation and rating do not mark cash received. The assigned
  cleaner separately declares receipt of cash. Both records survive reloads.
- Cancellation retains pending-order history.
- Customer rescheduling changes the same order's date/time, survives reload and
  appears in the cleaner's available jobs without changing quote or duration.
- A cleaner claiming while the customer edits causes a conflict; the customer
  sees the actual Accepted state and the original time is preserved.
- Cleaner permissions and order ownership are enforced.
- Invalid bookings and client-supplied prices are rejected; provider checkout
  routes return 410 Gone and availability always reports direct cash only.
- MVC cleaner registration and job progression through cash confirmation.
- A conflicting update from another device reloads the actual job state.
- A stale overlapping claim is rejected and removed on refresh; adjacent jobs
  can be accepted, but starting the next job waits until the active one finishes.
- The MVC portal displays a concurrent-start conflict from the API, disables
  starting another job, and unlocks it after completion.

No business API responses are mocked. The lost-response scenario uses route.fetch
against the real API, then aborts delivery to the browser after the commit.
There is no payment gateway or simulated
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

Web/native booking confirmation disables confirmation and back navigation while
sending, with an immediate guard against multiple clicks before React updates.
An unchanged retry in the mounted form reuses its requestId. Editing the payload
or choosing a new booking creates a fresh key. Keys are not persisted across
page reloads/app restarts, so this does not deduplicate those separate sessions.
Deploy the backend request-ID migration before serving the updated API.
Native interaction and its request-ID generation require a real device check;
Android export is a separate bundle check.

Customers can reschedule future Pending orders before a cleaner accepts. The
web uses local date/time input and native mobile uses date/time pickers, sending
UTC plus the original date as a concurrency check. Quote and duration stay fixed.
An API conflict closes the stale editor and reloads actual order state; other
errors leave the form available to retry. Assigned, cancelled and expired orders
have no rescheduling action. Native picker interaction still needs a device check.

## Notification inbox

Authenticated users have a /notifications inbox and a header bell/unread badge,
including small screens. Native customer and cleaner tabs have an inbox and
badge; the cleaner's placeholder messages tab is replaced by real notifications.
Inbox actions are explicit (opening an order does not silently mark it read),
support retry on load/read failures, and page older records without losing the
newest read-all boundary. Notification content contains booking updates rather
than private contact details.

Badges refresh on web route/focus changes and every 30 seconds while the page is
visible; native polling runs only while foregrounded and refreshes on inbox focus.
Refresh reloads the current inbox. Requests from a previous signed-in user cannot
replace the new user's badge, and the web inbox remounts for an account change.
Read state is stored on the server and shared across devices. Install the backend
notification migration before deployment; tests migrate generated databases only.
These are in-app notifications, not device/browser push. Native interaction and
background delivery are not covered by the mobile Chromium project or export.

Earlier online-payment API routes are retired even if old enabled configuration
values remain. Old provider schema/history is retained, not relabelled as cash.
The interface exposes no online checkout options, payment links or gateway calls.

The mobile Chromium project tests the responsive website, not the native Expo
app. Native Android export is a separate build check. Device interaction, real
Google OAuth, deployment and a live PostgreSQL upgrade require separate checks.
