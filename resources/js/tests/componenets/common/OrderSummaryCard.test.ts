import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import OrderSummaryCard from '@/components/OrderSummaryCard.vue';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import type { OrderItem } from '@/types/order';
import { defaultOrderItem } from '../../utils';

const orderItems: OrderItem[] = [
    defaultOrderItem({
        quantity: 2,
        product_snapshot: {
            name: 'Widget',
            slug: 'widget',
            variant: { sku: 'WID-1', options: { color: 'red' } },
        },
    }),
];

function mountCard(props: Record<string, unknown> = {}, slots = {}) {
    return mount(OrderSummaryCard, {
        props: {
            namespace: 'account.orders',
            status: 'processing',
            paymentStatus: 'paid',
            createdAt: '2026-01-05T00:00:00.000Z',
            orderItems,
            total: '39.98',
            ...props,
        },
        slots,
    });
}

describe('OrderSummaryCard', () => {
    it('passes status/namespace to the status badges', () => {
        const wrapper = mountCard();

        expect(wrapper.findComponent(OrderStatusBadge).props()).toEqual({
            status: 'processing',
            namespace: 'account.orders',
        });
        expect(wrapper.findComponent(PaymentStatusBadge).props()).toEqual({
            status: 'paid',
            namespace: 'account.orders',
        });
    });

    it('renders the placed-on label and formatted date', () => {
        const wrapper = mountCard();

        expect(wrapper.text()).toContain('account.orders.detail.placedOn');
        expect(wrapper.text()).toContain(
            new Date('2026-01-05T00:00:00.000Z').toLocaleDateString(),
        );
    });

    it('renders the default slot between the header and the items summary', () => {
        const wrapper = mountCard(
            {},
            { default: '<p class="note">Extra content</p>' },
        );

        expect(wrapper.find('p.note').text()).toBe('Extra content');
    });

    it('builds summary items from orderItems via the product snapshot', () => {
        const wrapper = mountCard();

        const summary = wrapper.findComponent(OrderItemsSummary);
        expect(summary.props('heading')).toBe('account.orders.detail.items');
        expect(summary.props('totalLabel')).toBe('account.orders.detail.total');
        expect(summary.props('total')).toBe('39.98');
        expect(summary.props('items')).toEqual([
            {
                id: 1,
                name: 'Widget',
                variantOptions: { color: 'red' },
                quantity: 2,
                unitPrice: '19.99',
            },
        ]);
    });

    it('falls back to an empty name when the product snapshot is missing', () => {
        const wrapper = mountCard({
            orderItems: [
                defaultOrderItem({
                    id: 2,
                    unit_price: '10.00',
                    product_snapshot: null,
                }),
            ],
        });

        const summary = wrapper.findComponent(OrderItemsSummary);
        expect(summary.props('items')).toEqual([
            {
                id: 2,
                name: '',
                variantOptions: undefined,
                quantity: 1,
                unitPrice: '10.00',
            },
        ]);
    });

    it('builds translation keys from the admin.orders namespace', () => {
        const wrapper = mountCard({ namespace: 'admin.orders' });

        expect(wrapper.findComponent(OrderStatusBadge).props('namespace')).toBe(
            'admin.orders',
        );
        expect(wrapper.text()).toContain('admin.orders.detail.placedOn');
        expect(wrapper.findComponent(OrderItemsSummary).props('heading')).toBe(
            'admin.orders.detail.items',
        );
    });
});
