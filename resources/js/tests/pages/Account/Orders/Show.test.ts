import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Show from '@/pages/Account/Orders/Show.vue';
import type { AddressSnapshot } from '@/types/address';
import {
    defaultAddressSnapshot,
    defaultOrder,
    defaultOrderItem,
    expectRendersPageTitle,
    testRendersLabels,
} from '../../../utils';

const order = defaultOrder({
    id: 7,
    status: 'processing',
    total: '59.98',
    payment_method: 'stripe',
    payment_status: 'paid',
    shipping_address_snapshot: defaultAddressSnapshot({
        state: 'IL',
    }) as AddressSnapshot | null,
    order_items: [
        defaultOrderItem({
            quantity: 2,
            product_snapshot: {
                name: 'Widget',
                slug: 'widget',
                variant: { sku: 'WID-1', options: { color: 'red' } },
            },
        }),
        defaultOrderItem({
            id: 2,
            unit_price: '20.00',
            product_snapshot: {
                name: 'Gadget',
                slug: 'gadget',
                variant: null,
            },
        }),
    ],
});

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

        expectRendersPageTitle(wrapper, 'account.orders.detail.pageTitle');
        expect(wrapper.text()).toContain('#7');
    });

    it('renders the order status and payment status badges', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('account.orders.statuses.processing');
        expect(wrapper.text()).toContain('account.orders.paymentStatuses.paid');
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

    testRendersLabels(
        mountPage,
        [
            'account.orders.detail.pageTitle',
            'account.orders.detail.backToOrders',
            'account.orders.detail.placedOn',
            'account.orders.detail.items',
            'account.orders.detail.total',
            'account.orders.detail.shippingAddress',
            'account.orders.statuses.processing',
            'account.orders.paymentStatuses.paid',
        ],
        'renders all static text labels on the page',
    );

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

        expect(wrapper.text()).not.toContain(
            'account.orders.detail.shippingAddress',
        );
    });

    it('does not render a note section when the customer left no note', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).not.toContain('account.orders.detail.note');
    });

    it('renders the customer note when present', () => {
        const wrapper = mountPage({
            order: {
                ...order,
                customer_note: 'Please leave at the back door.',
            },
        });

        expect(wrapper.text()).toContain('account.orders.detail.note');
        expect(wrapper.text()).toContain('Please leave at the back door.');
    });
});
