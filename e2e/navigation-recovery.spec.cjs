const { test, expect } = require('@playwright/test');

test('unknown routes offer translated recovery links without losing display preferences', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'Không tìm thấy trang', exact: true })).toBeVisible();
  await page.getByLabel('Language / Ngôn ngữ').selectOption('en');
  await page.getByLabel('Appearance / Giao diện').selectOption('dark');
  await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible();
  await page.locator('main').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('heading', { name: 'CleanMate services', exact: true })).toBeVisible();
});

test('keyboard users can skip navigation and return focus after dismissing the phone menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/services');
  await expect(page.getByLabel('Language / Ngôn ngữ')).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Bỏ qua điều hướng', exact: true });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const menu = page.getByRole('button', { name: 'Menu điều hướng', exact: true });
  await menu.click();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
