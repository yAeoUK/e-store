import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { ADMIN, CART_ABANDONER, CUSTOMER, filterBy, login } from './helpers';

const PRODUCT_SLUG = 'e2e-test-product';

async function addToCart(page: Page, quantity: number) {
    await page.goto(`/products/${PRODUCT_SLUG}`);

    if ((await page.locator('select').count()) > 0) {
        await page.selectOption('select', { label: 'E2E-VARIANT' });
    }

    await page.fill('input[type=number]', String(quantity));
    await page.click('button:has-text("Add to Cart")');
    await page.waitForURL('**/cart');
}

async function ensureAddress(page: Page) {
    await page.goto('/account/addresses');

    if ((await page.getByText('1 E2E Street').count()) > 0) {
        return;
    }

    await page.fill('input[placeholder="Address line 1"]', '1 E2E Street');
    await page.fill('input[placeholder="City"]', 'Testville');
    await page.fill('input[placeholder="Postal code"]', '00000');
    await page.fill('input[placeholder="Country"]', 'US');
    await page
        .locator('label:has-text("Set as default")')
        .locator('input')
        .check();
    await page.click('button:has-text("Add Address")');
    await expect(page.getByText('1 E2E Street')).toBeVisible();
}

test.describe('cart, checkout, and order history', () => {
    test('a customer can add to cart, check out, and see the order in their history', async ({
        page,
    }) => {
        await login(page, CUSTOMER);

        await addToCart(page, 2);
        await expect(page.getByText('E2E Test Product')).toBeVisible();
        await expect(page.getByText('$110.00')).toBeVisible(); // 55 * 2

        // quantity update recalculates the subtotal - the cart page edits
        // quantity through a dialog, not an inline input
        await page.click('button:has-text("Edit quantity")');
        await page.fill('dialog input[type=number]', '3');
        await page
            .locator('dialog')
            .getByRole('button', { name: 'Save' })
            .click();
        await expect(page.getByText('$165.00')).toBeVisible(); // 55 * 3, unique on this page (unit price shown separately)

        // checkout requires a saved address first
        await page.goto('/checkout');
        await expect(
            page.getByText('You have no saved addresses yet.'),
        ).toBeVisible();

        await ensureAddress(page);

        await page.goto('/checkout');
        // the address radio group is preselected; scope to <form> since the
        // payment-method radios (also preselected, defaulting to "cod") live
        // in a separate card outside the <form> element.
        await expect(
            page.locator('form input[type=radio]:checked'),
        ).toHaveCount(1);
        // a single-item cart shows the same amount as both the line total and
        // the grand total, so there are two matches here - just confirm both.
        await expect(page.getByText('$165.00')).toHaveCount(2);

        await page.locator('input[type=radio][value=cod]').check();
        await page
            .getByLabel('Note (optional)')
            .fill('Please leave at the back door.');
        await page.click('button:has-text("Place Order")');
        await page.waitForURL('**/account/orders/**');

        // order detail: frozen snapshot, unit price, shipping address, total,
        // payment status (a cash-on-delivery order starts out unpaid)
        await expect(page.getByText('E2E Test Product')).toBeVisible();
        await expect(page.getByText('Pending')).toBeVisible();
        await expect(page.getByText('Unpaid')).toBeVisible();
        await expect(page.getByText('$165.00').first()).toBeVisible();
        await expect(page.getByText('1 E2E Street')).toBeVisible();
        await expect(
            page.getByText('Please leave at the back door.'),
        ).toBeVisible();

        const orderUrl = page.url();
        const orderId = orderUrl.split('/').pop();

        await page.goto('/account/orders');
        await expect(page.getByText(`#${orderId}`)).toBeVisible();
    });

    test("an admin can see a customer's checkout note and search orders by it", async ({
        browser,
    }) => {
        const customerContext = await browser.newContext();
        const customerPage = await customerContext.newPage();
        await login(customerPage, CUSTOMER);
        await addToCart(customerPage, 1);

        await ensureAddress(customerPage);

        await customerPage.goto('/checkout');
        await customerPage.locator('input[type=radio][value=cod]').check();
        await customerPage
            .getByLabel('Note (optional)')
            .fill('Gift wrap this order please');
        await customerPage.click('button:has-text("Place Order")');
        await customerPage.waitForURL('**/account/orders/**');

        const orderId = customerPage.url().split('/').pop();
        await customerContext.close();

        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();
        await login(adminPage, ADMIN);

        await adminPage.goto(`/admin/orders/${orderId}`);
        await expect(
            adminPage.getByText('Gift wrap this order please'),
        ).toBeVisible();

        await adminPage.goto('/admin/orders');
        await filterBy(
            adminPage,
            'Search orders by customer or note...',
            'Gift wrap this order',
        );

        const row = adminPage.locator('tbody tr');
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(String(orderId));

        await adminContext.close();
    });

    test("an admin sees placed orders but not another user's abandoned cart", async ({
        browser,
    }) => {
        const customerContext = await browser.newContext();
        const customerPage = await customerContext.newPage();
        await login(customerPage, CART_ABANDONER);
        await addToCart(customerPage, 1); // left in the cart, never checked out
        await customerContext.close();

        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();
        await login(adminPage, ADMIN);
        await adminPage.goto('/admin/orders?search=Abandoner');
        await expect(adminPage.getByText('E2E Cart Abandoner')).toHaveCount(0);
        await adminContext.close();
    });
});
