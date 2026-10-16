const { test, expect } = require('@playwright/test');

test('generated styles provide a responsive service grid and usable header navigation', async ({ page }, testInfo) => {
  const compilerRequests = [];
  page.on('request', request => { if (request.url().includes('cdn.tailwindcss.com')) compilerRequests.push(request.url()); });
  await page.route('https://cdn.tailwindcss.com/**', route => route.abort());
  await page.goto('/services');
  const grid = page.locator('main > div.grid');
  await expect(grid.locator('article').first()).toBeVisible();
  await expect(grid).toHaveCSS('display', 'grid');
  expect(compilerRequests).toEqual([]);
  const columns = await grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(columns).toBe(testInfo.project.name === 'mobile-chromium' ? 1 : 2);
  await expect(page.locator('header > div').first()).toHaveCSS('display', 'flex');
  const menu = page.getByRole('button', { name: 'Menu điều hướng' });
  if (testInfo.project.name === 'mobile-chromium') {
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Đăng ký', exact: true }).click();
    await expect(page).toHaveURL(/\/register$/);
    await page.goto('/services');
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  } else {
    await expect(menu).toBeHidden();
    await expect(page.locator('header nav').getByRole('link', { name: 'Đặt lịch', exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('responsive-services.png'), fullPage: true });
});

test('navigation remains within narrow phone and tablet widths', async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/services');
    const menu = page.getByRole('button', { name: 'Menu điều hướng' });
    await expect(menu).toBeVisible();
    expect(await page.locator('header').evaluate(element => element.scrollWidth <= innerWidth)).toBe(true);
    await menu.click();
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Dịch vụ', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});
