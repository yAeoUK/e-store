import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CheckoutIndexPage from '@/pages/Checkout/Index.vue';
import { getMockForm, routeMock } from '../../setup';

const cart = {
    id: 1,
    order_items: [
        {
            id: 1,
            quantity: 2,
            unit_price: 9.99,
            product: { name: 'Wireless Mouse' },
            product_variant: null,
        },
    ],
};

const addresses = [
    {
        id: 1,
        label: 'Home',
        name: 'Jane Doe',
        line1: '123 Main St',
        line2: null,
        city: 'Springfield',
        state: null,
        postal_code: '62704',
        country: 'US',
        phone: null,
        is_default: false,
    },
    {
        id: 2,
        label: 'Work',
        name: 'Jane Doe',
        line1: '456 Office Rd',
        line2: null,
        city: 'Springfield',
        state: null,
        postal_code: '62704',
        country: 'US',
        phone: null,
        is_default: true,
    },
];

describe('Checkout index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses: [] },
        });

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'shop.checkout.pageTitle',
        );
    });

    it('shows the no-addresses state and a link to manage addresses when there are none', () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses: [] },
        });

        expect(wrapper.text()).toContain('shop.checkout.noAddresses');
        expect(wrapper.find('form').exists()).toBe(false);
    });

    it('pre-selects the default address', () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        expect(getMockForm().address_id).toBe(2);
    });

    it('falls back to the first address when none is marked default', () => {
        const noDefault = addresses.map((address) => ({
            ...address,
            is_default: false,
        }));
        const wrapper = mount(CheckoutIndexPage, {
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

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows a required error when no payment method is selected', async () => {
        const wrapper = mount(CheckoutIndexPage, {
            props: { cart, addresses },
        });

        getMockForm().payment_method = '';
        await wrapper.vm.$nextTick();

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
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
});
