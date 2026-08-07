import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CheckoutIndexPage from '@/pages/Checkout/Index.vue';
import { getMockForm, routeMock } from '../../setup';
import {
    defaultAddress,
    expectBlocksSubmissionWithClientError,
    expectRendersPageTitle,
} from '../../utils';

const cart = {
    id: 1,
    order_items: [
        {
            id: 1,
            quantity: 2,
            unit_price: 9.99,
            product: { id: 1, name: 'Wireless Mouse', slug: 'wireless-mouse' },
            product_variant: null,
        },
    ],
};

const addresses = [
    defaultAddress(),
    defaultAddress({
        id: 2,
        label: 'Work',
        line1: '456 Office Rd',
        is_default: true,
    }),
];

describe('Checkout index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses: [] },
        });

        expectRendersPageTitle(wrapper, 'shop.checkout.pageTitle');
    });

    it('shows the no-addresses state and a link to manage addresses when there are none', () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses: [] },
        });

        expect(wrapper.text()).toContain('shop.checkout.noAddresses');
        expect(wrapper.find('form').exists()).toBe(false);
    });

    it('pre-selects the default address', () => {
        mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        expect(getMockForm().address_id).toBe(2);
    });

    it('falls back to the first address when none is marked default', () => {
        const noDefault = addresses.map((address) => ({
            ...address,
            is_default: false,
        }));

        mount(CheckoutIndexPage, {
            props: { cart, addresses: noDefault },
        });

        expect(getMockForm().address_id).toBe(1);
    });

    it('submits the checkout form to the checkout.store route', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('checkout.store');
        expect(getMockForm().lastPostUrl).toBe('checkout.store');
    });

    it('blocks submission and shows a required error when no address is selected', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        getMockForm().address_id = null;
        await wrapper.vm.$nextTick();

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('blocks submission and shows a required error when no payment method is selected', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        getMockForm().payment_method = '';
        await wrapper.vm.$nextTick();

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('updates the payment method when a radio option is selected', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        const stripeInput = wrapper
            .findAll('input[type="radio"]')
            .find(
                (input) =>
                    (input.element as HTMLInputElement).value === 'stripe',
            );
        await stripeInput?.setValue();

        expect(getMockForm().payment_method).toBe('stripe');
    });

    it('starts with an empty customer note and submits it with the order', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        expect(getMockForm().customer_note).toBe('');

        await wrapper
            .find('textarea')
            .setValue('Please leave at the back door.');
        await wrapper.find('form').trigger('submit');

        expect(getMockForm().customer_note).toBe(
            'Please leave at the back door.',
        );
        expect(getMockForm().lastPostUrl).toBe('checkout.store');
    });
});
