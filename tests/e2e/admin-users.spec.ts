import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers';

test.describe('admin user management', () => {
    test('an admin can search users and see who is and is not an admin', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/users');

        await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

        await page.getByLabel('Search users...').fill('E2E Promotable User');
        await page.click('button:has-text("Confirm")');

        const promotableRow = page.locator('tr', { hasText: 'E2E Promotable User' });
        await expect(promotableRow.getByText('User', { exact: true })).toBeVisible();
        await expect(promotableRow.getByRole('button', { name: 'Promote to Admin' })).toBeVisible();

        await page.getByLabel('Search users...').fill('E2E Admin');
        await page.click('button:has-text("Confirm")');

        const adminRow = page.locator('tr', { hasText: 'E2E Admin' });
        await expect(adminRow.getByText('Admin', { exact: true })).toBeVisible();
        await expect(adminRow.getByRole('button', { name: 'Promote to Admin' })).toHaveCount(0);
    });
});
