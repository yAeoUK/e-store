import { expect, test } from '@playwright/test';
import { ADMIN, filterBy, login, rowWithText } from './helpers';

test.describe('admin user management', () => {
    test('an admin can search users and see who is and is not an admin', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/users');

        await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

        await filterBy(page, 'Search users...', 'E2E Promotable User');

        const promotableRow = rowWithText(page, 'E2E Promotable User');
        await expect(promotableRow.getByText('User', { exact: true })).toBeVisible();
        await expect(promotableRow.getByRole('button', { name: 'Promote to Admin' })).toBeVisible();

        await filterBy(page, 'Search users...', 'E2E Admin');

        const adminRow = rowWithText(page, 'E2E Admin');
        await expect(adminRow.getByText('Admin', { exact: true })).toBeVisible();
        await expect(adminRow.getByRole('button', { name: 'Promote to Admin' })).toHaveCount(0);
    });
});
