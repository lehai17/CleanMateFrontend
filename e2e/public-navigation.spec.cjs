const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const API = 'http://127.0.0.1:15238';

test('policy links, selected section, reload and browser history stay synchronized', async ({ page }) => {
  await page.goto('/policies?tab=payment');
  await expect(page.locator('#payment-btn')).toHaveAttribute('aria-current', 'page');
  await page.locator('footer').getByRole('link', { name: 'Chính sách bảo mật', exact: true }).click();
  await expect(page.locator('#privacy-btn')).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Chính Sách Bảo Mật', exact: true })).toBeVisible();
  await page.locator('#refund-btn').click();
  await expect(page).toHaveURL(/tab=refund$/);
  await page.reload();
  await expect(page.locator('#refund-btn')).toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(page.locator('#privacy-btn')).toHaveAttribute('aria-current', 'page');
  await page.goto('/policies?tab=unknown');
  await expect(page.locator('#terms-btn')).toHaveAttribute('aria-current', 'page');
});

test('footer opens services and authenticated support with translated labels', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await footer.getByRole('link', { name: 'Dọn dẹp nhà cửa', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await page.getByLabel('Language / Ngôn ngữ').selectOption('en');
  await footer.getByRole('link', { name: 'After-service support', exact: true }).click();
  await expect(page.locator('#refund-btn')).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'After-service support', exact: true })).toBeVisible();
  await expect(page).toHaveTitle('Terms & policies - CleanMate');
  await expect(footer).not.toContainText('1900 1234');
  await expect(footer).not.toContainText('hello@cleanmate.vn');
  await footer.getByRole('link', { name: 'Send support request', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('a long signed-in customer name does not overflow phone and tablet navigation', async ({ page, request }) => {
  const email = `navigation-${randomUUID()}@example.test`, password = 'CleanMate-system-test-123!';
  const response = await request.post(`${API}/api/auth/register`, { data: { fullName: 'Nguyễn '.repeat(12).trim(), email, password, phoneNumber: '0901234567', address: 'Test address' } });
  expect(response.status()).toBe(200);
  await page.goto('/login');
  await page.locator('form input[type=email]').fill(email);
  await page.locator('form input[type=password]').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/:13000\/?$/);
  for (const width of [320, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('header')).toBeVisible();
    expect(await page.locator('header').evaluate(element => element.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Đăng xuất', exact: true })).toBeVisible();
  }
});
