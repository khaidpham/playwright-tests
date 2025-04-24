import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Practice Software Testing/);
  });  
  
  test('should have a sign in link enabled', async ({ page }) => {
    await expect(page.getByTestId('nav-sign-in')).toHaveText('Sign in');
    await expect(page.getByTestId('nav-sign-in')).toBeEnabled();
  });

  test('should navigate to the contact page', async ({ page }) => {
    await page.click('text=Contact');
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/contact');
    await expect(page.locator('h3')).toHaveText('Contact');
  });

  test('should have a content grid that loads 9 items by default', async ({ page }) => {
    const productGrid = page.locator('.col-md-9');
    await expect(productGrid.getByRole('link')).toHaveCount(9);
  });

  test('should search for a specific product', async ({ page }) => {
    await page.getByTestId('search-query').fill('Thor Hammer');
    await page.getByTestId('search-submit').click();
    await expect(page.getByTestId('search-caption')).toHaveText('Searched for: Thor Hammer');
    const searchResults = page.locator('a.card');
    console.info('searchResults', searchResults);
    await expect(searchResults).toHaveCount(1);
    // Check the count of items on the page
    const results = await page.$$('[data-test="product-name"]');
    console.info('results', results);
    expect(results.length).toBeGreaterThan(0);
    // Check the first result contains 'hammer'
    const firstResultText = await results[0].textContent();
    expect(firstResultText.toLowerCase()).toContain('hammer');
  });

  test('should match the base homepage screenshot', async ({ page }) => {
    // Wait for content to load completely
    await page.waitForLoadState('networkidle');
    // Verify screenshot
    // await expect(page).toHaveScreenshot('homepage.png');
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixelRatio: 0.02
    });
  });
});
