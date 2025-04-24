import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages-objects/login-page.pom';
import { AccountPage } from '../pages-objects/account-page.pom';

test('sign in', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="nav-sign-in"]').click();

  // Use singInPage page object
  const loginPage = new LoginPage(page);
  await loginPage.emailInput.fill('customer@practicesoftwaretesting.com');
  await loginPage.passwordInput.fill('welcome01');
  await loginPage.submitButton.click();

  // Use AccountPage page object
  const accountPage = new AccountPage(page);
  await expect(accountPage.navMenu).toContainText('Doe'); // UI issue
  await expect(accountPage.pageTitle).toContainText('My account');
});