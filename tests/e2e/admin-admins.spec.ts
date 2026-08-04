import { expect, test } from '@playwright/test';
import { ADMIN, login, PROMOTABLE_USER } from './helpers';

test.describe('admin management', () => {
    test('an admin can promote an existing user, create a brand-new admin, and revoke one', async ({
        page,
    }) => {
        await login(page, ADMIN);
        await page.goto('/admin/admins');

        await expect(page.getByRole('heading', { name: 'Admins' })).toBeVisible();
        // exclude the "Hi, E2E Admin" header greeting, which also matches
        await expect(page.getByRole('cell', { name: 'E2E Admin', exact: true })).toBeVisible();

        // promote an existing user by email - scoped to the form containing
        // the "Promote" button, since the "Create New Admin" form on the
        // same page also has its own "Email" field.
        await page.click('a:has-text("Add Admin")');
        const promoteForm = page.locator('form').filter({ has: page.getByRole('button', { name: 'Promote' }) });
        await promoteForm.getByLabel('Email').fill(PROMOTABLE_USER.email);
        await promoteForm.getByRole('button', { name: 'Promote' }).click();
        await page.waitForURL('**/admin/admins');
        await expect(page.getByText('E2E Promotable User')).toBeVisible();

        // create a brand-new admin directly
        await page.click('a:has-text("Add Admin")');
        const createForm = page
            .locator('form')
            .filter({ has: page.getByRole('button', { name: 'Create Admin' }) });
        await createForm.getByLabel('Name').fill('E2E Brand New Admin');
        await createForm.getByLabel('Email').fill('e2e-brand-new-admin@example.com');
        await createForm.getByLabel('Password', { exact: true }).fill('password');
        await createForm.getByLabel('Confirm Password').fill('password');
        await page.click('button:has-text("Create Admin")');
        await page.waitForURL('**/admin/admins');
        await expect(page.getByText('E2E Brand New Admin')).toBeVisible();

        // revoke the admin we just promoted (there are now 3 admins, so this
        // is safely above the "at least one admin" floor)
        const promotedRow = page.locator('tr', { hasText: 'E2E Promotable User' });
        await promotedRow.getByRole('button', { name: 'Revoke' }).click();
        await expect(page.getByText('Revoke admin access?')).toBeVisible();
        await page.locator('dialog').getByRole('button', { name: 'Revoke' }).click();
        await expect(page.getByText('E2E Promotable User')).toHaveCount(0);

        // the currently logged-in admin has no Revoke button on their own row
        const ownRow = page.locator('tr', { hasText: 'E2E Admin' });
        await expect(ownRow.getByRole('button', { name: 'Revoke' })).toHaveCount(0);
    });
});
