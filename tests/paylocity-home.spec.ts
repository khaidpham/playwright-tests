// Description: This test suite is designed to validate the functionality and content of the Paylocity public home page.
import { test, expect } from '@playwright/test';

test.describe('Paylocity Public Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.paylocity.com/', { waitUntil: 'domcontentloaded' });
  });

  test('should show homepage title', async ({ page }) => {
    await expect(page).toHaveTitle(/Paylocity/);
  });

  test('should request and validate that login link returns HTTP 200', async ({ page, request }) => {
    const loginLink = await page.getByRole('link', { name: 'login opens in a new tab' }).getAttribute('href');
    expect(loginLink).toContain('https://access.paylocity.com');
    const response = await request.get(loginLink!);
    expect(response.status()).toBe(200);
  });

  test('should have Platform tiles and titles', async ({ page }) => {
    await expect(page.locator('.cmp-title').nth(0)).toHaveText(/All-In-One Platform/);
  });

  test('should display the hero section and heading', async ({ page }) => {
    await expect(page.locator('.hero-teaser').nth(0)).toBeVisible();
    await expect(page.locator('.hero-teaser h1').nth(0)).toContainText('Simplify Payroll from Day One');
  });

  test('should display Platform solutions name and URL', async ({ page }) => {
    const expectedTexts = [
      'Payroll Software',
      'Benefits Administration',
      'HR Software',
      'Time & Attendance',
      'Talent Management',
      'Employee Experience',
    ];

    const expectedUrls = [
      '/payroll',
      '/benefits',
      '/human-resources-software',
      '/time-and-attendance',
      '/talent-management',
      '/employee-experience',
    ];

    const tiles = page.locator('.cmp-icon-tiles .cmp-icon-tile');
    await expect(tiles).toHaveCount(expectedTexts.length);

    for (let i = 0; i < expectedTexts.length; i++) {
      await expect(tiles.nth(i).locator('span')).toHaveText(expectedTexts[i]);
      await expect(tiles.nth(i).locator('a')).toHaveAttribute('href', new RegExp(expectedUrls[i]));
    }
  });
});
