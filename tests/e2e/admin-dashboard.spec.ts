import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers';

test.describe('admin dashboard', () => {
    test('the dashboard renders real metrics and charts', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/dashboard');

        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

        for (const label of [
            'Total Products',
            'Total Categories',
            'Total Users',
            'Total Orders',
            'Low Stock',
            'Out of Stock',
            'Total Revenue',
        ]) {
            await expect(page.getByText(label)).toBeVisible();
        }

        await expect(page.getByText('Revenue (Last 30 Days)')).toBeVisible();
        await expect(page.getByText('Top Categories')).toBeVisible();

        // low stock / out of stock links land on the correctly-filtered
        // admin products list (E2E Second Product is low, E2E Out Of Stock
        // Product is out).
        await page.click('a:has-text("Low Stock")');
        await expect(page).toHaveURL(/stock_status=low/);
        await expect(page.getByText('E2E Second Product')).toBeVisible();

        await page.goto('/admin/dashboard');
        await page.click('a:has-text("Out of Stock")');
        await expect(page).toHaveURL(/stock_status=out/);
        await expect(page.getByText('E2E Out Of Stock Product')).toBeVisible();
    });
});
