import { expect, test } from '@playwright/test';
import { ADMIN, confirmDialog, filterBy, formWithField, login, rowWithText } from './helpers';

test.describe('admin order management', () => {
    test('an admin can search orders and filter to a single customer', async ({
        page,
    }) => {
        await login(page, ADMIN);
        await page.goto('/admin/orders');

        await expect(
            page.getByRole('heading', { name: 'Orders' }),
        ).toBeVisible();

        await filterBy(
            page,
            'Search orders by customer or note...',
            'E2E Order History',
        );

        // scoped to just this customer's rows and checked as plain text,
        // since other seeded/created orders elsewhere on the page can share
        // the exact same status/payment badge text.
        const rows = rowWithText(page, 'E2E Order History Customer');
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
        await filterBy(page, 'Search orders by customer or note...', '');

        await page.goto('/admin/users');
        await filterBy(page, 'Search users...', 'E2E Order History');
        await page.click('a:has-text("3")');

        await expect(page).toHaveURL(/user_id=\d+/);
        await expect(page.getByText('E2E Order History Customer')).toHaveCount(
            3,
        );
    });

    test('an admin can open an order, transition its status, and leave a searchable note', async ({
        page,
    }) => {
        await login(page, ADMIN);
        await page.goto('/admin/orders');

        await filterBy(
            page,
            'Search orders by customer or note...',
            'E2E Order Management',
        );

        const row = rowWithText(page, '$75.00');
        await row.getByRole('link', { name: 'View' }).click();

        await expect(
            page.getByRole('heading', { name: /^Order #\d+$/ }),
        ).toBeVisible();
        await expect(
            page.locator('[data-slot="badge"]', { hasText: 'Pending' }),
        ).toBeVisible();

        const statusForm = formWithField(page, 'Status');
        await statusForm.getByLabel('Status').selectOption('processing');
        await statusForm.getByRole('button', { name: 'Save' }).click();
        await expect(
            page.locator('[data-slot="badge"]', { hasText: 'Processing' }),
        ).toBeVisible();

        await statusForm.getByLabel('Status').selectOption('completed');
        await statusForm.getByRole('button', { name: 'Save' }).click();
        await expect(
            page.locator('[data-slot="badge"]', { hasText: 'Completed' }),
        ).toBeVisible();

        const noteForm = formWithField(page, 'Admin Note');
        await noteForm
            .getByLabel('Admin Note')
            .fill('Confirmed delivery window with customer');
        await noteForm.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByLabel('Admin Note')).toHaveValue(
            'Confirmed delivery window with customer',
        );

        await page.goto('/admin/orders');
        await filterBy(
            page,
            'Search orders by customer or note...',
            'Confirmed delivery window',
        );

        await expect(rowWithText(page, '$75.00')).toHaveCount(1);
    });

    test('an admin can refund a paid order', async ({ page }) => {
        await login(page, ADMIN);
        await page.goto('/admin/orders');

        await filterBy(
            page,
            'Search orders by customer or note...',
            'E2E Order Management',
        );

        const row = rowWithText(page, '$60.00');
        await row.getByRole('link', { name: 'View' }).click();

        const refundButton = page.getByRole('button', { name: 'Refund' });
        await expect(refundButton).toBeVisible();
        await refundButton.click();
        await confirmDialog(page, 'Refund');

        await expect(
            page.locator('[data-slot="badge"]', { hasText: 'Refunded' }),
        ).toBeVisible();
        await expect(refundButton).toHaveCount(0);
    });
});
