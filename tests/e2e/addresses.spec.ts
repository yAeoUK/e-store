import { expect, test } from '@playwright/test';
import { ADDRESS_OWNER, confirmDialog, deleteViaDialog, login, rowWithText } from './helpers';

test.describe('saved addresses', () => {
    test('a customer can view, set default, edit, add, and delete addresses', async ({ page }) => {
        await login(page, ADDRESS_OWNER);
        await page.goto('/account/addresses');

        // seeded state: two addresses, "Home" is default
        await expect(page.getByText('1 Existing Home Street')).toBeVisible();
        await expect(page.getByText('2 Existing Work Avenue')).toBeVisible();
        await expect(page.getByText('Default', { exact: true })).toBeVisible();

        // set the non-default one as default
        const workRow = rowWithText(page, '2 Existing Work Avenue', 'li');
        await workRow.getByRole('button', { name: 'Set as default' }).click();
        await expect(workRow.getByText('Default')).toBeVisible();

        // edit the (now non-default) home address
        const homeRow = rowWithText(page, '1 Existing Home Street', 'li');
        await homeRow.getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Address' })).toBeVisible();
        await page.locator('dialog').getByLabel('City').fill('Edited City');
        await confirmDialog(page, 'Save Changes');
        await expect(page.getByText('Edited City')).toBeVisible();
        // the modal keeps its content mounted for ~200ms after closing, so
        // its "Address Line 1" field can still briefly collide with the
        // add-form's own field below - give it a moment to fully unmount.
        await page.waitForTimeout(300);

        // add a new address
        await page.getByLabel('Address Line 1').fill('3 Brand New Boulevard');
        await page.getByLabel('City', { exact: true }).fill('Newville');
        await page.getByLabel('Postal Code').fill('99999');
        await page.getByLabel('Country').fill('US');
        await page.click('button:has-text("Add Address")');
        await expect(page.getByText('3 Brand New Boulevard')).toBeVisible();

        // delete the newly added address
        const newRow = rowWithText(page, '3 Brand New Boulevard', 'li');
        await deleteViaDialog(page, newRow, {
            confirmPrompt: 'Delete address?',
            goneText: '3 Brand New Boulevard',
        });
    });
});
