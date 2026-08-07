import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

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

export async function loginExpectingFailure(
    page: Page,
    credentials: { email: string; password: string },
) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.click('button:has-text("Log in")');
    await expect(page).toHaveURL(/\/login$/);
}

export async function registerUser(
    page: Page,
    user: { name: string; email: string; password: string },
) {
    await page.goto('/register');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password', { exact: true }).fill(user.password);
    await page.getByLabel('Confirm Password').fill(user.password);
    await page.click('button:has-text("Register")');
    await page.waitForURL((url) => url.pathname === '/');
}

export async function confirmDialog(page: Page, name: string) {
    await page.locator('dialog').getByRole('button', { name }).click();
}

export async function logout(page: Page) {
    await page.getByText('Hi,').locator('..').getByRole('button').click();
    await page.click('button:has-text("Log Out")');
    await confirmDialog(page, 'Log Out');
    await page.waitForURL((url) => url.pathname === '/');
}

export function formWithField(page: Page, label: string): Locator {
    return page.locator('form', { has: page.getByLabel(label) });
}

export async function deleteViaDialog(
    page: Page,
    trigger: Locator,
    options: { triggerLabel?: string; confirmPrompt: string; confirmLabel?: string; goneText: string },
) {
    const { triggerLabel = 'Delete', confirmPrompt, confirmLabel = triggerLabel, goneText } = options;
    await trigger.getByRole('button', { name: triggerLabel }).click();
    await expect(page.getByText(confirmPrompt)).toBeVisible();
    await confirmDialog(page, confirmLabel);
    await expect(page.getByText(goneText)).toHaveCount(0);
}

export function rowWithText(page: Page, text: string, tag: 'tr' | 'li' = 'tr'): Locator {
    return page.locator(tag, { hasText: text });
}

export async function filterBy(page: Page, label: string, value: string) {
    await page.getByLabel(label).fill(value);
    await page.click('button:has-text("Confirm")');
}
