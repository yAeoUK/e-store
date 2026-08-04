import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers';

test.describe('admin order management', () => {
    test('an admin can search orders and filter to a single customer', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/orders');

        await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

        await page.getByLabel('Search users...').fill('E2E Order History');
        await page.click('button:has-text("Confirm")');

        // scoped to just this customer's rows and checked as plain text,
        // since other seeded/created orders elsewhere on the page can share
        // the exact same status/payment badge text.
        const rows = page.locator('tr').filter({ hasText: 'E2E Order History Customer' });
        await expect(rows).toHaveCount(3);
        const rowsText = (await rows.allTextContents()).join(' ');
        expect(rowsText).toContain('Completed');
        expect(rowsText).toContain('Processing');
        expect(rowsText).toContain('Cancelled');
        expect(rowsText.match(/Cash on Delivery/g)).toHaveLength(3);
        // adjacent lines in the cell (payment method + status badge) render
        // with no whitespace between them once joined as plain text, so a
        // \b-bounded match against "Paid" can fail to find the boundary -
        // count is still reliable since "Unpaid" (lowercase p) never matches
        // the capitalized "Paid" case-sensitively.
        expect(rowsText.match(/Paid/g)).toHaveLength(2);
        expect(rowsText).toContain('Unpaid');

        // filter to a single user via the Users page's "Orders" count link
        await page.getByLabel('Search users...').fill('');
        await page.click('button:has-text("Confirm")');

        await page.goto('/admin/users');
        await page.getByLabel('Search users...').fill('E2E Order History');
        await page.click('button:has-text("Confirm")');
        await page.click('a:has-text("3")');

        await expect(page).toHaveURL(/user_id=\d+/);
        await expect(page.getByText('E2E Order History Customer')).toHaveCount(3);
    });
});
