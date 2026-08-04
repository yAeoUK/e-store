import { expect, test } from '@playwright/test';
import { CUSTOMER, login } from './helpers';

test.describe('authentication', () => {
    test('a new visitor can register and land on the home page', async ({ page }) => {
        await page.goto('/register');
        await page.getByLabel('Name').fill('E2E Fresh Registrant');
        await page.getByLabel('Email').fill('e2e-fresh-registrant@example.com');
        await page.getByLabel('Password', { exact: true }).fill('password');
        await page.getByLabel('Confirm Password').fill('password');
        await page.click('button:has-text("Register")');

        await page.waitForURL((url) => url.pathname === '/');
        await expect(page.getByText('Hi,')).toBeVisible();
        await expect(page.getByText('E2E Fresh Registrant')).toBeVisible();
    });

    test('a logged-in user can log out via the confirmation dialog', async ({ page }) => {
        await login(page, CUSTOMER);

        await page.getByText('Hi,').locator('..').getByRole('button').click();
        await page.click('button:has-text("Log Out")');
        await expect(page.getByText('Log out?')).toBeVisible();
        // the dropdown's own "Log Out" item is still present (just visually
        // behind the dialog overlay), so the confirm button must be scoped
        // to the dialog itself to avoid matching both.
        await page.locator('dialog').getByRole('button', { name: 'Log Out' }).click();

        await page.waitForURL((url) => url.pathname === '/');
        await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    });

    test('a wrong password shows a validation error and does not log in', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill(CUSTOMER.email);
        await page.getByLabel('Password').fill('the-wrong-password');
        await page.click('button:has-text("Log in")');

        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByText(/credentials do not match|these credentials/i)).toBeVisible();
    });

    test('requesting a password reset link shows a success message', async ({ page }) => {
        await page.goto('/forgot-password');
        await page.getByLabel('Email').fill(CUSTOMER.email);
        await page.click('button:has-text("Email Password Reset Link")');

        await expect(page.getByText(/emailed your password reset link/i)).toBeVisible();
    });

    test('an unverified user sees the verify-email prompt and can resend it', async ({ page }) => {
        await page.goto('/register');
        await page.getByLabel('Name').fill('E2E Unverified Registrant');
        await page.getByLabel('Email').fill('e2e-unverified-registrant@example.com');
        await page.getByLabel('Password', { exact: true }).fill('password');
        await page.getByLabel('Confirm Password').fill('password');
        await page.click('button:has-text("Register")');
        await page.waitForURL((url) => url.pathname === '/');

        await page.goto('/verify-email');
        await expect(page.getByText(/verify your email address/i)).toBeVisible();
        await page.click('button:has-text("Resend Verification Email")');
        await expect(page.getByText(/new verification link has been sent/i)).toBeVisible();
    });
});
