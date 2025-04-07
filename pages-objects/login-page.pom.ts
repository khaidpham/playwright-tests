import { Locator, Page } from '@playwright/test';

export class LoginPage {
  public emailInput: Locator;
  public passwordInput: Locator;
  public submitButton: Locator;

  constructor(page: Page) {
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
  }
};