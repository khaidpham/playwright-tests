import { Locator, Page } from '@playwright/test';

export class AccountPage {
  public pageTitle: Locator;
  public navMenu: Locator;
  public linkFavorites: Locator;
  public linkProfile: Locator;
  public linkInvoices: Locator;
  public linkMessages: Locator;

  constructor(page: Page) {
    this.pageTitle = page.getByTestId('page-title');
    this.navMenu = page.getByTestId('nav-menu');
    this.linkFavorites = page.getByTestId('nav-favorites');
    this.linkProfile = page.getByTestId('nav-profile');
    this.linkInvoices = page.getByTestId('nav-invoices');
    this.linkMessages = page.getByTestId('nav-messages');
  }
};