import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { login } from './helpers';

// Derived from Playwright's own per-test id rather than a shared module-level
// counter - module state isn't guaranteed to persist reliably across tests,
// and a colliding email here surfaces as a confusing "already taken" error
// on a seemingly unrelated later test.
async function registerFreshUser(page: Page, testInfo: TestInfo) {
    const unique = testInfo.testId;
    const email = `e2e-profile-${unique}@example.com`;
    await page.goto('/register');
    await page.getByLabel('Name').fill(`E2E Profile Test ${unique}`);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByLabel('Confirm Password').fill('password');
    await page.click('button:has-text("Register")');
    await page.waitForURL((url) => url.pathname === '/');

    return { email, password: 'password' };
}

test.describe('profile settings', () => {
    test('a user can update their profile information', async ({ page }, testInfo) => {
        await registerFreshUser(page, testInfo);

        await page.goto('/profile');
        // scoped for the same reason as the password test below - two forms
        // on this page both have a "Save" button.
        const infoForm = page.locator('form', { has: page.getByLabel('Name') });
        await infoForm.getByLabel('Name').fill('E2E Profile Updated Name');
        await infoForm.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Saved.')).toBeVisible();
        await page.reload();
        await expect(page.getByLabel('Name')).toHaveValue('E2E Profile Updated Name');
    });

    test('a user can change their password and log in with the new one', async ({ page }, testInfo) => {
        const user = await registerFreshUser(page, testInfo);

        await page.goto('/profile');
        // the profile page has two separate forms both with a "Save" button
        // (profile info + password) - scope to the one containing the
        // password fields so this doesn't accidentally submit the other.
        const passwordForm = page.locator('form', { has: page.getByLabel('Current Password') });
        await passwordForm.getByLabel('Current Password').fill(user.password);
        await passwordForm.getByLabel('New Password').fill('brand-new-password');
        await passwordForm.getByLabel('Confirm Password').fill('brand-new-password');
        await passwordForm.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Saved.')).toBeVisible();

        await page.getByText('Hi,').locator('..').getByRole('button').click();
        await page.click('button:has-text("Log Out")');
        await page.locator('dialog').getByRole('button', { name: 'Log Out' }).click();
        await page.waitForURL((url) => url.pathname === '/');

        await login(page, { email: user.email, password: 'brand-new-password' });
        await expect(page.getByText('Hi,')).toBeVisible();
    });

    test('a user can delete their own account', async ({ page }, testInfo) => {
        const user = await registerFreshUser(page, testInfo);

        await page.goto('/profile');
        await page.getByRole('button', { name: 'Delete Account' }).click();
        await expect(page.getByText('Are you sure you want to delete your account?')).toBeVisible();
        await page.getByPlaceholder('Password').fill(user.password);
        await page.locator('dialog').getByRole('button', { name: 'Delete Account' }).click();

        await page.waitForURL((url) => url.pathname === '/');
        await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

        // the account no longer exists
        await page.goto('/login');
        await page.getByLabel('Email').fill(user.email);
        await page.getByLabel('Password').fill(user.password);
        await page.click('button:has-text("Log in")');
        await expect(page).toHaveURL(/\/login$/);
    });
});
