import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers';

test.describe('admin category management', () => {
    test('an admin can list, create, edit/reparent, and delete a category', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/categories');

        await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
        // "E2E Category" also matches as a substring of "E2E Category Two"
        // and again as another row's Parent-column cell (which wraps a link
        // but still exposes "E2E Category" as its own cell's accessible
        // name) - just confirm at least one match renders.
        await expect(page.getByRole('cell', { name: 'E2E Category', exact: true }).first()).toBeVisible();
        await expect(page.getByText('E2E Subcategory')).toBeVisible();

        // create a new top-level category
        await page.click('a:has-text("Add Category")');
        await page.getByLabel('Name').fill('E2E New Category');
        await page.click('button:has-text("Save")');
        await page.waitForURL('**/admin/categories');
        await expect(page.getByText('E2E New Category')).toBeVisible();

        // edit it: rename and reparent under "E2E Category"
        const row = page.locator('tr', { hasText: 'E2E New Category' });
        await row.getByRole('link', { name: 'Edit' }).click();
        await page.getByLabel('Name').fill('E2E New Category Renamed');
        await page.getByLabel('Parent Category').selectOption({ label: 'E2E Category' });
        await page.click('button:has-text("Save")');
        await page.waitForURL('**/admin/categories');
        await expect(page.getByText('E2E New Category Renamed')).toBeVisible();

        // delete it (a leaf category with no products/children is safe to delete)
        const renamedRow = page.locator('tr', { hasText: 'E2E New Category Renamed' });
        await renamedRow.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('Delete category?')).toBeVisible();
        await page.locator('dialog').getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('E2E New Category Renamed')).toHaveCount(0);
    });
});
