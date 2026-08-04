import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Show from '@/pages/Account/Orders/Show.vue';

const order = {
    id: 7,
    status: 'processing',
    total: '59.98',
    payment_method: 'stripe',
    payment_status: 'paid',
    created_at: '2026-01-01T00:00:00.000Z',
    shipping_address_snapshot: {
        label: 'Home',
        name: 'Jane Doe',
        line1: '123 Main St',
        line2: null,
        city: 'Springfield',
        state: 'IL',
        postal_code: '62704',
        country: 'US',
        phone: null,
    },
    order_items: [
        {
            id: 1,
            quantity: 2,
            unit_price: '19.99',
            product_snapshot: {
                name: 'Widget',
                slug: 'widget',
                image_url: null,
                category: null,
                variant: {
                    sku: 'WID-1',
                    options: { color: 'red' },
                },
            },
        },
        {
            id: 2,
            quantity: 1,
            unit_price: '20.00',
            product_snapshot: {
                name: 'Gadget',
                slug: 'gadget',
                image_url: null,
                category: null,
                variant: null,
            },
        },
    ],
};

function mountPage(overrides: { order?: typeof order } = {}) {
    return mount(Show, {
        props: {
            order: overrides.order ?? order,
        },
    });
}

describe('Account order detail page', () => {
    it('renders wrapped in the ShopLayout', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent({ name: 'ShopLayout' }).exists()).toBe(
            true,
        );
    });

    it('renders a back-to-orders link to the account orders route', () => {
        const wrapper = mountPage();

        const backLink = wrapper
            .findAllComponents({ name: 'ButtonLink' })
            .find((link) => link.props('href') === 'account.orders');

        expect(backLink).toBeDefined();
        expect(backLink?.text()).toBe('account.orders.detail.backToOrders');
    });

    it('renders the order creation date', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('account.orders.detail.placedOn');
        expect(wrapper.text()).toContain(
            new Date(order.created_at).toLocaleDateString(),
        );
    });

    it('renders the page title via Head with the order id', () => {
        const wrapper = mountPage();
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('account.orders.detail.pageTitle');
        expect(wrapper.text()).toContain('#7');
    });

    it('renders the order status and payment status badges', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('account.orders.statuses.processing');
        expect(wrapper.text()).toContain(
            'account.orders.paymentStatuses.paid',
        );
    });

    it('renders each order item with quantity, variant options and line total', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('Widget');
        expect(wrapper.text()).toContain('color: red');
        expect(wrapper.text()).toContain('2');
        expect(wrapper.text()).toContain('$39.98');

        expect(wrapper.text()).toContain('Gadget');
        expect(wrapper.text()).toContain('$20.00');
    });

    it('renders the order total', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('$59.98');
    });

    it('renders all static text labels on the page', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('account.orders.detail.pageTitle');
        expect(text).toContain('account.orders.detail.backToOrders');
        expect(text).toContain('account.orders.detail.placedOn');
        expect(text).toContain('account.orders.detail.items');
        expect(text).toContain('account.orders.detail.total');
        expect(text).toContain('account.orders.detail.shippingAddress');
        expect(text).toContain('account.orders.statuses.processing');
        expect(text).toContain('account.orders.paymentStatuses.paid');
    });

    it('renders the shipping address when present', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('Home');
        expect(wrapper.text()).toContain('123 Main St');
        expect(wrapper.text()).toContain('Springfield');
        expect(wrapper.text()).toContain('62704');
        expect(wrapper.text()).toContain('US');
    });

    it('does not render a shipping address section when absent', () => {
        const wrapper = mountPage({
            order: { ...order, shipping_address_snapshot: null },
        });

        expect(wrapper.text()).not.toContain('account.orders.detail.shippingAddress');
    });
});
