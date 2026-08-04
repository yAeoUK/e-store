import path from 'node:path';
import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers';

const FIXTURE_IMAGE = path.join(process.cwd(), 'public/apple-touch-icon.png');

test.describe('admin product management', () => {
    test('an admin can list/search/filter products, create, edit (images + variants), and delete one', async ({
        page,
    }) => {
        await login(page, ADMIN);
        await page.goto('/admin/products');

        await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

        // search
        await page.getByLabel('Search products...').fill('E2E Test Product');
        await page.click('button:has-text("Confirm")');
        await expect(page.getByText('E2E Test Product')).toBeVisible();

        // category filter
        await page.getByLabel('Search products...').fill('');
        await page.getByLabel('Category').selectOption({ label: 'E2E Category Two' });
        await page.click('button:has-text("Confirm")');
        await expect(page.getByText('E2E Second Product')).toBeVisible();

        // create a new product
        await page.click('a:has-text("Add Product")');
        await page.getByLabel('Name').fill('E2E Created Product');
        await page.getByLabel('Category').selectOption({ label: 'E2E Category' });
        await page.getByLabel('Price').fill('42');
        await page.getByLabel('Stock').fill('7');
        await page.getByLabel('Short Description').fill('An e2e created product.');
        await page
            .getByLabel('Description', { exact: true })
            .fill('Full description of the e2e created product.');
        await page.click('button:has-text("Save")');
        await page.waitForURL(/\/admin\/products\/\d+\/edit$/);

        // image upload: first image becomes primary automatically, second
        // does not - exercising both the upload and set-primary routes.
        const fileInput = page.locator('input[type=file]');
        await fileInput.setInputFiles(FIXTURE_IMAGE);
        await expect(page.getByText('Primary')).toBeVisible();
        await fileInput.setInputFiles(FIXTURE_IMAGE);
        await expect(page.getByRole('button', { name: 'Set as primary' })).toBeVisible();
        await page.getByRole('button', { name: 'Set as primary' }).click();
        await expect(page.getByRole('button', { name: 'Set as primary' })).toBeVisible(); // the other image is now the non-primary one

        // add a variant
        await page.getByLabel('SKU').fill('E2E-CREATED-SKU');
        const variantForm = page.locator('form', { has: page.getByLabel('SKU') });
        await variantForm.getByLabel('Price').fill('45');
        await variantForm.getByLabel('Stock').fill('5');
        await page.click('button:has-text("Add Variant")');
        await expect(page.getByText('E2E-CREATED-SKU')).toBeVisible();

        // edit that variant via its modal
        const variantRow = page.locator('li', { hasText: 'E2E-CREATED-SKU' });
        await variantRow.getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Variant' })).toBeVisible();
        await page.locator('dialog').getByLabel('Stock').fill('9');
        await page.locator('dialog').getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Stock: 9')).toBeVisible();

        // delete the variant
        await variantRow.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('Delete variant?')).toBeVisible();
        await page.locator('dialog').getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('E2E-CREATED-SKU')).toHaveCount(0);

        // delete the whole product (no order items reference it, so it's safe)
        await page.goto('/admin/products');
        await page.getByLabel('Search products...').fill('E2E Created Product');
        await page.click('button:has-text("Confirm")');
        await page.locator('tr', { hasText: 'E2E Created Product' }).getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('Delete product?')).toBeVisible();
        await page.locator('dialog').getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('E2E Created Product')).toHaveCount(0);
    });
});
