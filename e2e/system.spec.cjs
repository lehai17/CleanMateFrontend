const { test, expect } = require("@playwright/test");
const { randomUUID } = require("node:crypto");

const API = "http://127.0.0.1:15238";
const PORTAL = "http://127.0.0.1:15080";
const PASSWORD = "CleanMate-system-test-123!";
const pageErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on("pageerror", error => errors.push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});
const email = () => `system-${randomUUID()}@example.test`;
const futureDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" })
  .format(new Date(Date.now() + 2 * 86400000));

async function account(request, role = "Customer") {
  const userEmail = email();
  const response = await request.post(`${API}/api/auth/register`, {
    data: { fullName: "System Test User", email: userEmail, password: PASSWORD,
      phoneNumber: "0901234567", address: "123 System Test Street", role },
  });
  expect(response.ok()).toBeTruthy();
  return { ...(await response.json()), email: userEmail };
}

async function login(page, userEmail, role = "Customer") {
  await page.goto("/login");
  await page.locator('form input[type="email"]').fill(userEmail);
  await page.locator('form input[type="password"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(role === "Cleaner" ? /\/cleaner\/jobs$/ : /:13000\/?$/);
}

async function apiBooking(request, customer) {
  const response = await request.post(`${API}/api/bookings`, {
    headers: { Authorization: `Bearer ${customer.token}` },
    data: { serviceKey: "cleaning", startTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      durationHours: 2, address: "123 System Test Street", notes: "System test", paymentMethod: "cash" },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function uiBooking(page) {
  await page.goto("/booking");
  await page.getByRole("button", { name: /Dọn Dẹp Tổng Quát/ }).click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  const date = futureDay();
  if (!(await page.locator(`[title="${date}"]`).count()))
    await page.getByRole("button", { name: "Tháng sau" }).click();
  await page.locator(`[title="${date}"]`).click();
  await page.locator('input[type="time"]').fill("09:00");
  await page.getByRole("button", { name: "+", exact: true }).click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await page.getByPlaceholder("Nhập số điện thoại").fill("0901234567");
  await page.getByPlaceholder(/Nhập địa chỉ chi tiết/).fill("123 System Test Street");
  await expect(page.locator('input[value="online"]')).toBeDisabled();
  await expect(page.locator('input[value="cash"]')).toBeChecked();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  const saved = page.waitForResponse(r => r.url() === `${API}/api/bookings` && r.request().method() === "POST");
  await page.getByRole("button", { name: "Xác nhận đặt lịch", exact: true }).click();
  const response = await saved;
  expect(response.status()).toBe(200);
  const booking = await response.json();
  expect(booking.price).toBe(140000);
  const payload = response.request().postDataJSON();
  expect(payload.ServiceKey).toBe("cleaning");
  expect(payload).not.toHaveProperty("Price");
  expect(payload).not.toHaveProperty("CleanerId");
  await expect(page.getByRole("heading", { name: "Đặt lịch thành công!" })).toBeVisible();
  await expect(page.getByText(`CM${String(booking.id).padStart(6, "0")}`, { exact: true })).toBeVisible();
  return booking;
}

test("guest routes require login and online payment cannot be self-confirmed", async ({ page }) => {
  for (const path of ["/booking", "/orders", "/profile", "/cleaner/jobs"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
  }
  await page.goto("/payment-qr");
  await expect(page.getByRole("heading", { name: "Thanh toán online chưa được hỗ trợ" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Đã thanh toán/ })).toHaveCount(0);
});

test("customer books and follows assigned cleaner through start and completion", async ({ page, browser, request }) => {
  const userEmail = email();
  const customerName = `Browser Customer ${randomUUID().slice(0, 8)}`;
  await page.goto("/register");
  await page.locator('input[name="fullName"]').fill(customerName);
  await page.locator('input[name="email"]').fill(userEmail);
  await page.locator('input[name="phone"]').fill("0901234567");
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="confirmPassword"]').fill(PASSWORD);
  await page.locator('input[name="acceptTerms"]').check();
  page.once("dialog", dialog => dialog.accept());
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page, userEmail);
  const booking = await uiBooking(page);
  const cleaner = await account(request, "Cleaner");
  const mobile = test.info().project.name === "mobile-chromium";
  const context = await browser.newContext({ viewport: page.viewportSize(), isMobile: mobile, hasTouch: mobile, timezoneId: "Asia/Bangkok" });
  try {
    const cleanerPage = await context.newPage();
    // Separate real browser sessions: no injected tokens or mocked API responses.
    await cleanerPage.goto("http://127.0.0.1:13000/login");
    await cleanerPage.locator('form input[type="email"]').fill(cleaner.email);
    await cleanerPage.locator('form input[type="password"]').fill(PASSWORD);
    await cleanerPage.locator('form button[type="submit"]').click();
    await expect(cleanerPage).toHaveURL(/\/cleaner\/jobs$/);
    const card = cleanerPage.locator("section").first().locator("article").filter({ hasText: customerName });
    await expect(card).toHaveCount(1);
    await card.getByRole("button", { name: "Nhan viec" }).click();
    await expect(cleanerPage.getByText("Nhan viec thanh cong.", { exact: true })).toBeVisible();
    await page.goto("/orders");
    const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
    await expect(row).toContainText("Accepted");
    await expect(row.getByRole("button", { name: "Hủy đơn" })).toBeDisabled();
    await page.reload();
    await expect(row).toContainText("Accepted");
    const assigned = cleanerPage.locator(`article[data-booking-id="${booking.id}"]`);
    await expect(assigned.getByRole("button", { name: "Hoàn thành công việc" })).toHaveCount(0);
    await assigned.getByRole("button", { name: "Bắt đầu công việc" }).click();
    await expect(assigned).toContainText("InProgress");
    await expect(assigned).toContainText("Bắt đầu thực tế:");
    await page.reload();
    await expect(row).toContainText("InProgress");
    await expect(row).toContainText("Bắt đầu:");
    await expect(row.getByRole("button", { name: "Hủy đơn" })).toBeDisabled();
    await assigned.getByRole("button", { name: "Hoàn thành công việc" }).click();
    await expect(assigned).toContainText("Completed");
    await expect(assigned).toContainText("Hoàn thành thực tế:");
    await expect(assigned.getByRole("button")).toHaveCount(0);
    await cleanerPage.reload();
    await expect(assigned).toContainText("Completed");
    const savedOrders = page.waitForResponse(response => response.url() === `${API}/api/orders` && response.request().method() === "GET");
    await page.reload();
    await expect(row).toContainText("Completed");
    await expect(row).toContainText("Hoàn thành:");
    const completed = (await (await savedOrders).json()).find(order => order.id === booking.id);
    expect(completed.startedAt).toMatch(/Z$/);
    expect(completed.completedAt).toMatch(/Z$/);
    expect(new Date(completed.completedAt).getTime()).toBeGreaterThanOrEqual(new Date(completed.startedAt).getTime());
  } finally { await context.close(); }
});

test("cancelling a pending order keeps its history after reload", async ({ page, request }) => {
  const customer = await account(request);
  const booking = await apiBooking(request, customer);
  await login(page, customer.email);
  await page.goto("/orders");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await expect(row).toContainText("Pending");
  page.once("dialog", dialog => dialog.accept());
  await row.getByRole("button", { name: "Hủy đơn" }).click();
  await expect(row).toContainText("Cancelled");
  await expect(row.getByRole("button", { name: "Hủy đơn" })).toBeDisabled();
  await page.reload();
  await expect(row).toContainText("Cancelled");
});

test("customer cannot claim jobs or cancel another customer's order", async ({ page, request }) => {
  const owner = await account(request);
  const other = await account(request);
  const booking = await apiBooking(request, owner);
  await login(page, other.email);
  await page.goto("/cleaner/jobs");
  await expect(page).not.toHaveURL(/\/cleaner\/jobs$/);
  const headers = { Authorization: `Bearer ${other.token}` };
  expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/accept`, { headers })).status()).toBe(403);
  for (const action of ["start", "complete"])
    expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/${action}`, { headers })).status()).toBe(403);
  expect((await request.put(`${API}/api/orders/${booking.id}/cancel`, { headers })).status()).toBe(403);
  await page.goto("/orders");
  await expect(page.getByRole("row").filter({ hasText: `CM${booking.id}` })).toHaveCount(0);
});

test("server rejects bad booking input and ignores tampered price", async ({ request }) => {
  const customer = await account(request);
  const headers = { Authorization: `Bearer ${customer.token}` };
  const valid = { serviceKey: "cooking", durationHours: 3, address: "System Test Street",
    startTime: new Date(Date.now() + 86400000).toISOString(), paymentMethod: "cash", notes: "" };
  for (const patch of [{ durationHours: 0 }, { durationHours: 9 }, { address: "" },
    { paymentMethod: "online" }, { serviceKey: "unknown" }, { startTime: "2020-01-01T00:00:00Z" }]) {
    expect((await request.post(`${API}/api/bookings`, { headers, data: { ...valid, ...patch } })).status()).toBe(400);
  }
  const result = await request.post(`${API}/api/bookings`, { headers, data: { ...valid, price: 1, cleanerId: 999, status: "Completed" } });
  expect(result.status()).toBe(200);
  expect(await result.json()).toMatchObject({ price: 270000, status: "Pending" });
});

test("cleaner portal registers and claims a booking through the real API", async ({ page, request }) => {
  const customer = await account(request);
  const booking = await apiBooking(request, customer);
  await page.goto(`${PORTAL}/Auth/Register`);
  await page.locator('input[name="FullName"]').fill("Portal Browser Cleaner");
  await page.locator('input[name="Email"]').fill(email());
  await page.locator('input[name="Password"]').fill(PASSWORD);
  await page.locator('input[name="ConfirmPassword"]').fill(PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/Dashboard(?:\/Index)?$/);
  await expect(page.getByText("Portal Browser Cleaner", { exact: true })).toBeVisible();
  await page.goto(`${PORTAL}/Booking/List`);
  await expect(page.locator(".table-responsive")).toHaveCSS("overflow-x", "auto");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await row.getByRole("button", { name: "Nhận đơn" }).click();
  await expect(row).toContainText("Accepted");
  await expect(row.getByRole("button", { name: "Hoàn thành công việc" })).toHaveCount(0);
  await row.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(row).toContainText("InProgress");
  await expect(row).toContainText("Bắt đầu:");
  await row.getByRole("button", { name: "Hoàn thành công việc" }).click();
  await expect(row).toContainText("Completed");
  await expect(row).toContainText("Hoàn thành:");
  await expect(row.getByRole("button")).toHaveCount(0);
  const response = await request.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${customer.token}` } });
  expect((await response.json()).find(order => order.id === booking.id).status).toBe("Completed");
});

test("stale progress updates show a conflict and reload the actual job state", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const booking = await apiBooking(request, customer);
  const headers = { Authorization: `Bearer ${cleaner.token}` };
  expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/accept`, { headers })).status()).toBe(200);
  await login(page, cleaner.email, "Cleaner");
  const card = page.locator(`article[data-booking-id="${booking.id}"]`);
  await expect(card.getByRole("button", { name: "Bắt đầu công việc" })).toBeVisible();
  // Simulate the same cleaner starting from another device. The browser retains its old view.
  expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/start`, { headers })).status()).toBe(200);
  await card.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(page.getByText(/Trạng thái đơn không cho phép thao tác này/)).toBeVisible();
  await expect(card).toContainText("InProgress");
  await expect(card.getByRole("button", { name: "Bắt đầu công việc" })).toHaveCount(0);
  await card.getByRole("button", { name: "Hoàn thành công việc" }).click();
  await expect(card).toContainText("Completed");
});
