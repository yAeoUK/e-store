import { expect, test } from '@playwright/test';
import { CUSTOMER, login, loginExpectingFailure, logout, registerUser } from './helpers';

test.describe('authentication', () => {
    test('a new visitor can register and land on the home page', async ({ page }) => {
        await registerUser(page, {
            name: 'E2E Fresh Registrant',
            email: 'e2e-fresh-registrant@example.com',
            password: 'password',
        });

        await expect(page.getByText('Hi,')).toBeVisible();
        await expect(page.getByText('E2E Fresh Registrant')).toBeVisible();
    });

    test('a logged-in user can log out via the confirmation dialog', async ({ page }) => {
        await login(page, CUSTOMER);

        await logout(page);
        await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    });

    test('a wrong password shows a validation error and does not log in', async ({ page }) => {
        await loginExpectingFailure(page, { email: CUSTOMER.email, password: 'the-wrong-password' });

        await expect(page.getByText(/credentials do not match|these credentials/i)).toBeVisible();
    });

    test('requesting a password reset link shows a success message', async ({ page }) => {
        await page.goto('/forgot-password');
        await page.getByLabel('Email').fill(CUSTOMER.email);
        await page.click('button:has-text("Email Password Reset Link")');

        await expect(page.getByText(/emailed your password reset link/i)).toBeVisible();
    });

    test('an unverified user sees the verify-email prompt and can resend it', async ({ page }) => {
        await registerUser(page, {
            name: 'E2E Unverified Registrant',
            email: 'e2e-unverified-registrant@example.com',
            password: 'password',
        });

        await page.goto('/verify-email');
        await expect(page.getByText(/verify your email address/i)).toBeVisible();
        await page.click('button:has-text("Resend Verification Email")');
        await expect(page.getByText(/new verification link has been sent/i)).toBeVisible();
    });
});
