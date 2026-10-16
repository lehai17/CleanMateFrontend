const { test, expect } = require("@playwright/test");
const { randomUUID } = require("node:crypto");

const API = "http://127.0.0.1:15238";
const PORTAL = "http://127.0.0.1:15080";
const PASSWORD = "CleanMate-system-test-123!";
test('customer confirms logout all and can sign in with the unchanged password',async({page,request})=>{
  const customer=await account(request);await login(page,customer.email);await page.goto('/security');
  page.once('dialog',dialog=>dialog.dismiss());await page.getByRole('button',{name:'Đăng xuất tất cả thiết bị',exact:true}).click();expect((await request.get(`${API}/api/me`,{headers:{Authorization:`Bearer ${customer.token}`}})).status()).toBe(200);
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Đăng xuất tất cả thiết bị',exact:true}).click();await expect(page).toHaveURL(/\/login$/);await expect(page.getByRole('status')).toContainText('Đã đăng xuất tất cả thiết bị');
  expect((await request.get(`${API}/api/me`,{headers:{Authorization:`Bearer ${customer.token}`}})).status()).toBe(401);
  await page.locator('form input[type="email"]').fill(customer.email);await page.locator('form input[type="password"]').fill(PASSWORD);await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await expect(page).toHaveURL(/\/security$/);
});
test('customer changes password and logs in again while old tokens are rejected',async({page,request})=>{
  const customer=await account(request),next='New-customer-password-456!';await login(page,customer.email);await page.goto('/security');await page.getByLabel('Mật khẩu hiện tại',{exact:true}).fill(PASSWORD);await page.getByLabel('Mật khẩu mới',{exact:true}).fill(next);await page.getByLabel('Nhập lại mật khẩu mới',{exact:true}).fill(next);await page.getByRole('button',{name:'Lưu mật khẩu mới',exact:true}).click();await expect(page).toHaveURL(/\/login$/);await expect(page.getByRole('status')).toContainText('Đã đổi mật khẩu');
  expect((await request.get(`${API}/api/me`,{headers:{Authorization:`Bearer ${customer.token}`}})).status()).toBe(401);
  await page.locator('form input[type="email"]').fill(customer.email);await page.locator('form input[type="password"]').fill(next);await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await expect(page).toHaveURL(/\/security$/);await page.goto('/profile');await expect(page.getByRole('link',{name:'Đổi mật khẩu',exact:true})).toBeVisible();
});

test('customer retries a committed support report without duplication and reads staff resolution',async({page,request})=>{
  const customer=await account(request),job=await apiBooking(request,customer);await login(page,customer.email);await page.goto('/support');
  await page.getByLabel('Mã đơn',{exact:true}).fill(`CM${job.id}`);await page.getByLabel('Mô tả',{exact:true}).fill('Không liên hệ được cleaner trước ca làm.');
  let firstPayload,receipt;
  await page.route(`${API}/api/support`,async route=>{
    if(receipt)return route.continue();const response=await route.fetch();expect(response.status()).toBe(200);receipt=await response.json();firstPayload=route.request().postDataJSON();await route.abort('failed');
  });
  await page.getByRole('button',{name:'Gửi yêu cầu hỗ trợ',exact:true}).click();await expect(page.getByRole('status')).toContainText('Network Error');
  const sent=page.waitForResponse(r=>r.url()===`${API}/api/support`&&r.request().method()==='POST');await page.getByRole('button',{name:'Gửi yêu cầu hỗ trợ',exact:true}).click();const result=await sent;expect(result.request().postDataJSON()).toEqual(firstPayload);
  await expect(page.locator(`[data-support-id="${receipt.id}"]`)).toBeVisible();expect((await (await request.get(`${API}/api/support`,{headers:{Authorization:`Bearer ${customer.token}`}})).json()).total).toBe(1);
  const auth=await request.post(`${API}/api/auth/login`,{data:{email:'admin@system.test',password:'CleanMate-admin-test-123!'}});const token=(await auth.json()).token;
  expect((await request.put(`${API}/api/management/support/${receipt.id}`,{headers:{Authorization:`Bearer ${token}`},data:{status:'Resolved',response:'Đã liên hệ hai bên và xác nhận lại lịch.',version:1}})).status()).toBe(200);
  await page.goto('/notifications');await page.locator('[data-notification-id]').filter({hasText:'Yêu cầu hỗ trợ đã được cập nhật'}).getByRole('link',{name:'Xem hỗ trợ',exact:true}).click();
  await expect(page).toHaveURL(/\/support$/);await expect(page.locator(`[data-support-id="${receipt.id}"]`)).toContainText('Đã liên hệ hai bên');
});
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
  const result = await response.json();
  if (role === "Cleaner") await approve(request, result.user.cleanerProfile.id);
  return { ...result, email: userEmail };
}

async function approve(request, profileId) {
  const auth = await request.post(`${API}/api/auth/login`, { data: { email: "admin@system.test", password: "CleanMate-admin-test-123!" } });
  expect(auth.status()).toBe(200);
  const token = (await auth.json()).token;
  expect((await request.put(`${API}/api/management/applications/${profileId}/review`, {
    headers: { Authorization: `Bearer ${token}` }, data: { status: "Approved" },
  })).status()).toBe(200);
}

async function login(page, userEmail, role = "Customer") {
  await page.goto("/login");
  await page.locator('form input[type="email"]').fill(userEmail);
  await page.locator('form input[type="password"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(role === "Cleaner" ? /\/cleaner\/jobs$/ : /:13000\/?$/);
}

async function apiBooking(request, customer, schedule = {}) {
  const response = await request.post(`${API}/api/bookings`, {
    headers: { Authorization: `Bearer ${customer.token}` },
    data: { serviceKey: "cleaning", startTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      durationHours: 2, address: "123 System Test Street", notes: "System test", paymentMethod: "cash", ...schedule },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function uiBooking(page, contactName, loseFirstResponse = false) {
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
  await page.getByPlaceholder("Nhập số điện thoại").fill("0907654321");
  await page.getByPlaceholder("Nhập họ và tên").fill(contactName);
  await page.getByPlaceholder(/Nhập địa chỉ chi tiết/).fill("123 System Test Street");
  await page.getByPlaceholder("Nhập số điện thoại").fill("*123#");
  page.once("dialog", async dialog => {
    expect(dialog.message()).toContain("Số điện thoại liên hệ không hợp lệ");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(page.getByPlaceholder("Nhập số điện thoại")).toBeVisible();
  await page.getByPlaceholder("Nhập số điện thoại").fill("0907654321");
  await expect(page.locator('input[value="online"]')).toHaveCount(0);
  await expect(page.locator('input[value="cash"]')).toBeChecked();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  let firstReceipt;
  let firstPayload;
  if (loseFirstResponse) {
    await page.route(`${API}/api/bookings`, async route => {
      if (firstReceipt) return route.continue();
      const response = await route.fetch();
      expect(response.status()).toBe(200);
      firstReceipt = await response.json();
      firstPayload = route.request().postDataJSON();
      // Real API commits the booking; only delivery to this browser is interrupted.
      await route.abort("failed");
    });
    const failed = page.waitForEvent("dialog");
    await page.getByRole("button", { name: "Xác nhận đặt lịch", exact: true }).click();
    await (await failed).accept();
    await expect(page.getByRole("button", { name: "Xác nhận đặt lịch", exact: true })).toBeEnabled();
  }
  const saved = page.waitForResponse(r => r.url() === `${API}/api/bookings` && r.request().method() === "POST");
  await page.getByRole("button", { name: "Xác nhận đặt lịch", exact: true }).click();
  const response = await saved;
  expect(response.status()).toBe(200);
  const booking = await response.json();
  expect(booking.price).toBe(140000);
  const payload = response.request().postDataJSON();
  expect(payload.ServiceKey).toBe("cleaning");
  expect(payload.ContactPhone).toBe("0907654321");
  expect(payload.ContactName).toBe(contactName);
  expect(payload.RequestId).toMatch(/^[0-9a-f-]{36}$/);
  if (loseFirstResponse) {
    expect(booking.id).toBe(firstReceipt.id);
    expect(payload).toEqual(firstPayload);
    await page.unroute(`${API}/api/bookings`);
  }
  expect(payload).not.toHaveProperty("Price");
  expect(payload).not.toHaveProperty("CleanerId");
  await expect(page.getByRole("heading", { name: "Đặt lịch thành công!" })).toBeVisible();
  await expect(page.getByText(`CM${String(booking.id).padStart(6, "0")}`, { exact: true })).toBeVisible();
  return booking;
}

test("guest routes require login and online payment cannot be self-confirmed", async ({ page }) => {
  for (const path of ["/booking", "/orders", "/profile", "/cleaner/jobs", "/notifications"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
  }
  await page.goto("/payment-qr");
  await expect(page.getByRole("heading", { name: "Thanh toán tiền mặt trực tiếp" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Cleaner xác nhận đã nhận tiền mặt/ })).toHaveCount(0);
});

test("customer submits a cleaner application and gains job access only after staff approval", async ({ page, request }) => {
  const customer = await account(request);
  await login(page, customer.email);
  await page.goto("/profile");
  const submitted = page.waitForResponse(r => r.url() === `${API}/api/profile/register-cleaner` && r.request().method() === "POST");
  await page.getByRole("button", { name: "Dang ky lam cleaner", exact: true }).click();
  const response = await submitted;
  expect(response.status()).toBe(200);
  const pending = await response.json();
  expect(pending.isCleaner).toBe(false);
  await expect(page.getByRole("button", { name: "Đang chờ xét duyệt", exact: true })).toBeDisabled();
  await page.goto("/cleaner/jobs");
  await expect(page).toHaveURL(/\/profile$/);
  await approve(request, pending.cleanerProfile.id);
  await page.getByRole("button", { name: "Tải lại trạng thái hồ sơ", exact: true }).click();
  await expect(page.getByRole("button", { name: "Cap nhat ho so cleaner", exact: true })).toBeVisible();
  await page.goto("/cleaner/jobs");
  await expect(page).toHaveURL(/\/cleaner\/jobs$/);
});

test("customer and cleaner notifications retain read state and open the correct work area", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const booking = await apiBooking(request, customer);
  const headers = { Authorization: `Bearer ${cleaner.token}` };
  for (const action of ["accept", "start", "complete", "cash-payment"])
    expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/${action}`, { headers })).status()).toBe(200);
  expect((await request.put(`${API}/api/orders/${booking.id}/confirm-completion`, {
    headers: { Authorization: `Bearer ${customer.token}` }, data: { rating: 5, review: "Good work" },
  })).status()).toBe(200);
  await login(page, customer.email);
  await page.getByRole("link", { name: "Thông báo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Thông báo", exact: true })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(5);
  await expect(page.getByTestId("notification-unread-count")).toHaveText("5");
  const receipt = page.locator("article").filter({ hasText: "Cleaner xác nhận đã nhận tiền mặt" });
  await expect(receipt.getByRole("link")).toHaveAttribute("href", "/orders");
  await receipt.getByRole("button", { name: "Đánh dấu đã đọc", exact: true }).click();
  await expect(receipt.getByRole("button")).toHaveCount(0);
  await expect(page.getByTestId("notification-unread-count")).toHaveText("4");
  await page.reload();
  await expect(receipt.getByRole("button")).toHaveCount(0);
  await expect(page.getByTestId("notification-unread-count")).toHaveText("4");
  await page.getByRole("button", { name: "Đánh dấu tất cả đã đọc", exact: true }).click();
  await expect(page.getByText("Chưa đọc: 0", { exact: true })).toBeVisible();
  await expect(page.getByTestId("notification-unread-count")).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Chưa đọc: 0", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await login(page, cleaner.email, "Cleaner");
  await page.getByRole("link", { name: "Thông báo", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(3);
  await expect(page.getByTestId("notification-unread-count")).toHaveText("3");
  const feedback = page.locator("article").filter({ hasText: "Khách đã đánh giá ca làm" });
  await expect(feedback.getByRole("link")).toHaveAttribute("href", "/cleaner/jobs");
  await feedback.getByRole("link").click();
  await expect(page).toHaveURL(/\/cleaner\/jobs$/);
  await expect(page.locator(`article[data-booking-id="${booking.id}"]`)).toContainText("Completed");
});

test("notification pagination and read-all preserve an arrival newer than the viewed inbox", async ({ page, request }) => {
  const customer = await account(request);
  for (let index = 0; index < 21; index++) await apiBooking(request, customer);
  await login(page, customer.email);
  await page.getByRole("link", { name: "Thông báo", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(20);
  await page.getByRole("button", { name: "Xem thêm", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(21);
  const newest = await apiBooking(request, customer);
  await page.getByRole("button", { name: "Đánh dấu tất cả đã đọc", exact: true }).click();
  await expect(page.getByText("Chưa đọc: 1", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tải lại thông báo", exact: true }).click();
  await expect(page.locator("article").first()).toContainText(`CM${newest.id}`);
  await expect(page.locator("article").first().getByRole("button", { name: "Đánh dấu đã đọc", exact: true })).toBeVisible();
  await expect(page.getByTestId("notification-unread-count")).toHaveText("1");
});

test("retry after losing a committed booking response creates only one order", async ({ page, request }) => {
  const customer = await account(request);
  await login(page, customer.email);
  const booking = await uiBooking(page, "Retry Contact", true);
  const orders = await request.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${customer.token}` } });
  expect(orders.status()).toBe(200);
  const list = await orders.json();
  expect(list).toHaveLength(1);
  expect(list[0].id).toBe(booking.id);
  await page.goto("/orders");
  await expect(page.getByRole("row").filter({ hasText: `CM${booking.id}` })).toContainText("Pending");
});

test("cleaner rejects stale overlapping claims and completes the active job before starting the next", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const start = Date.now() + 3 * 86400000;
  const first = await apiBooking(request, customer, { startTime: new Date(start).toISOString() });
  const overlap = await apiBooking(request, customer, { startTime: new Date(start).toISOString() });
  const next = await apiBooking(request, customer, { startTime: new Date(start + 2 * 3600000).toISOString() });
  const headers = { Authorization: `Bearer ${cleaner.token}` };
  await login(page, cleaner.email, "Cleaner");
  const firstCard = page.locator(`article[data-booking-id="${first.id}"]`);
  const overlapCard = page.locator(`article[data-booking-id="${overlap.id}"]`);
  const nextCard = page.locator(`article[data-booking-id="${next.id}"]`);
  await expect(overlapCard.getByRole("button", { name: "Nhan viec" })).toBeVisible();
  expect((await request.put(`${API}/api/cleaner/jobs/${first.id}/accept`, { headers })).status()).toBe(200);
  await overlapCard.getByRole("button", { name: "Nhan viec" }).click();
  await expect(page.getByText("Ca này trùng lịch với ca bạn đã nhận. Vui lòng chọn khung giờ khác.", { exact: true })).toBeVisible();
  await expect(overlapCard).toHaveCount(0);
  await expect(firstCard).toContainText("Accepted");
  await nextCard.getByRole("button", { name: "Nhan viec" }).click();
  await expect(nextCard).toContainText("Accepted");
  await expect(nextCard).toContainText("Lịch dự kiến:");
  await firstCard.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(firstCard).toContainText("InProgress");
  await expect(nextCard.getByRole("button", { name: "Bắt đầu công việc" })).toBeDisabled();
  await expect(nextCard).toContainText("Hoàn thành ca đang làm trước khi bắt đầu ca này.");
  await firstCard.getByRole("button", { name: "Hoàn thành công việc" }).click();
  await expect(firstCard).toContainText("Completed");
  await expect(overlapCard.getByRole("button", { name: "Nhan viec" })).toBeVisible();
  await expect(nextCard.getByRole("button", { name: "Bắt đầu công việc" })).toBeEnabled();
  await nextCard.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(nextCard).toContainText("InProgress");
  await page.reload();
  await expect(nextCard).toContainText("InProgress");
});

test("cleaner portal reports a concurrent start conflict and unlocks the next job after completion", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const start = Date.now() + 4 * 86400000;
  const first = await apiBooking(request, customer, { startTime: new Date(start).toISOString() });
  const next = await apiBooking(request, customer, { startTime: new Date(start + 2 * 3600000).toISOString() });
  const headers = { Authorization: `Bearer ${cleaner.token}` };
  for (const booking of [first, next])
    expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/accept`, { headers })).status()).toBe(200);
  await page.goto(`${PORTAL}/Auth/Login`);
  await page.locator('input[name="Email"]').fill(cleaner.email);
  await page.locator('input[name="Password"]').fill(PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/Dashboard(?:\/Index)?$/);
  await page.goto(`${PORTAL}/Booking/List`);
  await expect(page.getByRole("columnheader", { name: "Lịch dự kiến (UTC+7)" })).toBeVisible();
  const firstRow = page.getByRole("row").filter({ hasText: `CM${first.id}` });
  const nextRow = page.getByRole("row").filter({ hasText: `CM${next.id}` });
  await expect(nextRow.getByRole("button", { name: "Bắt đầu công việc" })).toBeEnabled();
  expect((await request.put(`${API}/api/cleaner/jobs/${first.id}/start`, { headers })).status()).toBe(200);
  await nextRow.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(page.getByText("Bạn đang làm một ca khác. Hãy hoàn thành ca hiện tại trước khi bắt đầu ca mới.", { exact: true })).toBeVisible();
  await expect(nextRow.getByRole("button", { name: "Bắt đầu công việc" })).toBeDisabled();
  await firstRow.getByRole("button", { name: "Hoàn thành công việc" }).click();
  await expect(firstRow).toContainText("Completed");
  await expect(nextRow.getByRole("button", { name: "Bắt đầu công việc" })).toBeEnabled();
  await nextRow.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(nextRow).toContainText("InProgress");
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
  const contactName = `Contact for ${customerName}`;
  const booking = await uiBooking(page, contactName);
  await page.goto("/orders");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await expect(row).toContainText("Chưa có cleaner nhận việc");
  await expect(row).toContainText("SĐT liên hệ: 0907654321");
  await expect(row).toContainText(`Người liên hệ: ${contactName}`);
  await expect(row.getByRole("link", { name: "Gọi cleaner" })).toHaveCount(0);
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
    const card = cleanerPage.locator("section").first().locator("article").filter({ hasText: contactName });
    await expect(card).toHaveCount(1);
    await expect(card).toContainText("0907654321");
    await card.getByRole("button", { name: "Nhan viec" }).click();
    await expect(cleanerPage.getByText("Nhan viec thanh cong.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Tải lại trạng thái", exact: true }).click();
    await expect(row).toContainText("Accepted");
    await expect(row).toContainText("System Test User");
    await expect(row).toContainText("0901234567");
    await expect(row.getByRole("link", { name: "Gọi cleaner" })).toHaveAttribute("href", "tel:0901234567");
    await expect(row.getByRole("button", { name: "Hủy đơn" })).toBeDisabled();
    await page.reload();
    await expect(row).toContainText("Accepted");
    const assigned = cleanerPage.locator(`article[data-booking-id="${booking.id}"]`);
    await expect(assigned.getByRole("button", { name: "Hoàn thành công việc" })).toHaveCount(0);
    await assigned.getByRole("button", { name: "Bắt đầu công việc" }).click();
    await expect(assigned).toContainText("InProgress");
    await expect(assigned).toContainText("0907654321");
    await expect(assigned).toContainText("Bắt đầu thực tế:");
    await page.reload();
    await expect(row).toContainText("InProgress");
    await expect(row).toContainText("Bắt đầu:");
    await expect(row.getByRole("button", { name: "Hủy đơn" })).toBeDisabled();
    await assigned.getByRole("button", { name: "Hoàn thành công việc" }).click();
    await expect(assigned).toContainText("Completed");
    await expect(assigned).toContainText("Hoàn thành thực tế:");
    await expect(assigned).toContainText("Chưa có xác nhận nhận tiền mặt");
    await page.reload();
    await row.getByRole("button", { name: "Xác nhận và đánh giá", exact: true }).click();
    await expect(row.getByRole("button", { name: "Gửi đánh giá", exact: true })).toBeDisabled();
    await row.getByLabel("Đánh giá ca làm", { exact: true }).selectOption("5");
    await row.getByLabel("Nhận xét (không bắt buộc)", { exact: true }).fill("Cleaner làm tốt, đúng giờ.");
    await row.getByRole("button", { name: "Gửi đánh giá", exact: true }).click();
    await expect(row).toContainText("Khách đã xác nhận hoàn thành");
    await expect(row).toContainText("Đánh giá: 5/5 sao");
    await expect(row).toContainText("Chưa có xác nhận nhận tiền mặt");
    await cleanerPage.reload();
    await expect(assigned).toContainText("Khách đã xác nhận hoàn thành");
    // Dismissing the receipt confirmation must leave the order unpaid.
    cleanerPage.once("dialog", dialog => dialog.dismiss());
    await assigned.getByRole("button", { name: "Xác nhận đã nhận tiền mặt" }).click();
    await expect(assigned).toContainText("Chưa có xác nhận nhận tiền mặt");
    cleanerPage.once("dialog", dialog => dialog.accept());
    await assigned.getByRole("button", { name: "Xác nhận đã nhận tiền mặt" }).click();
    await expect(assigned).toContainText("Cleaner xác nhận đã nhận tiền mặt");
    await expect(assigned).toContainText("Thời gian xác nhận:");
    await expect(assigned.getByRole("button")).toHaveCount(0);
    await cleanerPage.reload();
    await expect(assigned).toContainText("Completed");
    const savedOrders = page.waitForResponse(response => response.url() === `${API}/api/orders` && response.request().method() === "GET");
    await page.reload();
    await expect(row).toContainText("Completed");
    await expect(row).toContainText("Hoàn thành:");
    await expect(row).toContainText("Cleaner xác nhận đã nhận tiền mặt");
    await expect(row).toContainText("Thời gian xác nhận:");
    const completed = (await (await savedOrders).json()).find(order => order.id === booking.id);
    expect(completed.startedAt).toMatch(/Z$/);
    expect(completed.completedAt).toMatch(/Z$/);
    expect(completed.customerConfirmedAt).toMatch(/Z$/);
    expect(completed.customerRating).toBe(5);
    expect(completed.customerReview).toBe("Cleaner làm tốt, đúng giờ.");
    expect(completed.paymentStatus).toBe("Paid");
    expect(completed.paidAt).toMatch(/Z$/);
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

test("customer reschedules an unassigned order and cleaner sees the new time after reload", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const booking = await apiBooking(request, customer);
  await login(page, customer.email);
  await page.goto("/orders");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await row.getByRole("button", { name: "Đổi lịch", exact: true }).click();
  const targetDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date(Date.now() + 4 * 86400000));
  const local = `${targetDay}T14:30`;
  await row.getByLabel("Ngày giờ mới", { exact: true }).fill(local);
  const saved = page.waitForResponse(r => r.url() === `${API}/api/orders/${booking.id}/reschedule` && r.request().method() === "PUT");
  await row.getByRole("button", { name: "Lưu lịch mới", exact: true }).click();
  const response = await saved;
  expect(response.status()).toBe(200);
  const target = new Date(`${local}:00+07:00`).toISOString();
  expect(new Date((await response.json()).date).toISOString()).toBe(target);
  expect(response.request().postDataJSON().expectedStartTime).toBe(booking.startTime);
  await expect(page.getByRole("status")).toContainText("Đã đổi lịch thành công");
  await expect(row.getByRole("cell").nth(1)).toContainText("14:30");
  await page.reload();
  await expect(row.getByRole("cell").nth(1)).toContainText("14:30");
  const orders = await (await request.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${customer.token}` } })).json();
  expect(orders).toHaveLength(1);
  expect(orders[0]).toMatchObject({ id: booking.id, status: "Pending", price: 140000 });
  const jobs = await (await request.get(`${API}/api/cleaner/jobs/available`, { headers: { Authorization: `Bearer ${cleaner.token}` } })).json();
  const job = jobs.find(item => item.id === booking.id);
  expect(new Date(job.startTime).toISOString()).toBe(target);
  expect(job.durationHours).toBe(2);
});

test("a cleaner claiming while the customer edits prevents rescheduling and refreshes the order", async ({ page, request }) => {
  const customer = await account(request);
  const cleaner = await account(request, "Cleaner");
  const booking = await apiBooking(request, customer);
  await login(page, customer.email);
  await page.goto("/orders");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await row.getByRole("button", { name: "Đổi lịch", exact: true }).click();
  await row.getByLabel("Ngày giờ mới", { exact: true }).fill(`${futureDay()}T16:30`);
  expect((await request.put(`${API}/api/cleaner/jobs/${booking.id}/accept`, {
    headers: { Authorization: `Bearer ${cleaner.token}` },
  })).status()).toBe(200);
  await row.getByRole("button", { name: "Lưu lịch mới", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Đơn đã thay đổi");
  await expect(row).toContainText("Accepted");
  await expect(row.getByRole("button", { name: "Đổi lịch", exact: true })).toHaveCount(0);
  await expect(row.getByLabel("Ngày giờ mới", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveCount(0);
  const order = (await (await request.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${customer.token}` } })).json())[0];
  expect(order.date).toBe(booking.startTime);
  await page.reload();
  await expect(row).toContainText("Accepted");
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
  const options = await (await request.get(`${API}/api/payment/options`)).json();
  expect(options).toMatchObject({ cash: true, momo: false, payos: false, model: "DirectCash" });
  for (const route of ["momo", "payos"])
    expect((await request.post(`${API}/api/payment/${route}`, { headers, data: { bookingId: (await result.json()).id } })).status()).toBe(410);
});

test("cleaner portal registers and claims a booking through the real API", async ({ page, request }) => {
  const customer = await account(request);
  const booking = await apiBooking(request, customer);
  await page.goto(`${PORTAL}/Auth/Register`);
  await page.locator('input[name="FullName"]').fill("Portal Browser Cleaner");
  const cleanerEmail = email();
  await page.locator('input[name="Email"]').fill(cleanerEmail);
  await page.locator('input[name="Password"]').fill(PASSWORD);
  await page.locator('input[name="ConfirmPassword"]').fill(PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/:15080\/(?:Auth\/Login)?$/);
  await expect(page.getByText(/Đã gửi hồ sơ/)).toBeVisible();
  const application = await request.post(`${API}/api/auth/login`, { data: { email: cleanerEmail, password: PASSWORD } });
  await approve(request, (await application.json()).user.cleanerProfile.id);
  await page.locator('input[name="Email"]').fill(cleanerEmail);
  await page.locator('input[name="Password"]').fill(PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/Dashboard(?:\/Index)?$/);
  await expect(page.getByText("Portal Browser Cleaner", { exact: true })).toBeVisible();
  await page.goto(`${PORTAL}/Booking/List`);
  await expect(page.locator(".table-responsive")).toHaveCSS("overflow-x", "auto");
  const row = page.getByRole("row").filter({ hasText: `CM${booking.id}` });
  await row.getByRole("button", { name: "Nhận đơn" }).click();
  await expect(row).toContainText("Accepted");
  await expect(row).toContainText("0901234567");
  await expect(row.getByRole("button", { name: "Hoàn thành công việc" })).toHaveCount(0);
  await row.getByRole("button", { name: "Bắt đầu công việc" }).click();
  await expect(row).toContainText("InProgress");
  await expect(row).toContainText("Bắt đầu:");
  await row.getByRole("button", { name: "Hoàn thành công việc" }).click();
  await expect(row).toContainText("Completed");
  await expect(row).toContainText("Hoàn thành:");
  await expect(row).toContainText("Chưa có xác nhận nhận tiền mặt");
  page.once("dialog", dialog => dialog.accept());
  await row.getByRole("button", { name: "Xác nhận đã nhận tiền mặt" }).click();
  await expect(row).toContainText("Cleaner xác nhận đã nhận tiền mặt");
  await expect(row).toContainText("Thời gian xác nhận:");
  await expect(row.getByRole("button")).toHaveCount(0);
  const response = await request.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${customer.token}` } });
  expect((await response.json()).find(order => order.id === booking.id)).toMatchObject({ status: "Completed", paymentStatus: "Paid" });
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
