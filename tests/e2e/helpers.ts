import type { Page } from '@playwright/test';

export const CUSTOMER = { email: 'e2e-customer@example.com', password: 'password' };
export const CART_ABANDONER = {
    email: 'e2e-cart-abandoner@example.com',
    password: 'password',
};
export const ADMIN = { email: 'e2e-admin@example.com', password: 'password' };
export const ADDRESS_OWNER = {
    email: 'e2e-address-owner@example.com',
    password: 'password',
};
export const PROMOTABLE_USER = {
    email: 'e2e-promotable@example.com',
    password: 'password',
};
export const ORDER_HISTORY_CUSTOMER = {
    email: 'e2e-order-history@example.com',
    password: 'password',
};

export async function login(page: Page, credentials: { email: string; password: string }) {
    await page.goto('/login');
    await page.fill('input[type=email]', credentials.email);
    await page.fill('input[type=password]', credentials.password);
    await page.click('button:has-text("Log in")');
    await page.waitForURL((url) => !url.pathname.includes('/login'));
}
