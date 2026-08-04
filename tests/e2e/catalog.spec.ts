import { expect, test } from '@playwright/test';

test.describe('shop catalog', () => {
    test('a visitor can search, filter, and view a product', async ({ page }) => {
        await page.goto('/');

        // search
        await page.getByLabel('Search', { exact: true }).fill('E2E Second Product');
        await page.click('button:has-text("Apply filters")');
        await expect(page.getByText('E2E Second Product')).toBeVisible();
        await expect(page.getByText('E2E Test Product')).toHaveCount(0);

        // clear search, filter by category instead
        await page.getByLabel('Search', { exact: true }).fill('');
        await page.getByLabel('Category').selectOption({ label: 'E2E Category Two' });
        await page.click('button:has-text("Apply filters")');
        await expect(page.getByText('E2E Second Product')).toBeVisible();

        // price filter
        await page.getByLabel('Category').selectOption({ label: 'All categories' });
        await page.getByLabel('Min price').fill('20');
        await page.getByLabel('Max price').fill('30');
        await page.click('button:has-text("Apply filters")');
        await expect(page.getByText('E2E Second Product')).toBeVisible();

        // inactive products never appear in storefront search
        await page.getByLabel('Min price').fill('');
        await page.getByLabel('Max price').fill('');
        await page.getByLabel('Search', { exact: true }).fill('E2E Inactive Product');
        await page.click('button:has-text("Apply filters")');
        await expect(page.getByText('E2E Inactive Product')).toHaveCount(0);

        // view a product's detail page via its "View product" link
        await page.getByLabel('Search', { exact: true }).fill('E2E Test Product');
        await page.click('button:has-text("Apply filters")');
        await page.getByRole('link', { name: 'View product' }).first().click();
        await expect(page).toHaveURL(/\/products\/e2e-test-product$/);
        await expect(page.getByRole('heading', { name: 'E2E Test Product' })).toBeVisible();
        await expect(page.getByText('$50.00')).toBeVisible();
    });

    test('storefront pagination has a second page', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('link', { name: '2', exact: true })).toBeVisible();
    });

    test('a category page lists its products and the subcategory nav renders', async ({ page }) => {
        await page.goto('/categories/e2e-category-two');

        await expect(page.getByRole('heading', { name: 'E2E Category Two' })).toBeVisible();
        await expect(page.getByText('E2E Second Product')).toBeVisible();

        await page.goto('/categories/e2e-category');
        await expect(page.getByRole('link', { name: 'E2E Subcategory' })).toBeVisible();
    });
});
