import {test as setup, expect} from '@playwright/test';

setup('Create customer 01 auth', async ({page, context}) => {
    const email = 'customer@practicesoftwaretesting.com';
    const password = 'welcome01';
    const customer01AuthFile = '.auth/customer01.json';

    await page.goto('https://practicesoftwaretesting.com/auth/login');

    // fill email
    await page.getByTestId('email').fill(email);

    // fill password
    await page.getByTestId('password').fill(password);

    // click submit
    await page.getByTestId('login-submit').click();

    // check logged in user info
    await expect(page.getByTestId('nav-menu')).toContainText('Jane Doe');

    // save authentication state
    await context.storageState({ path: customer01AuthFile });
});