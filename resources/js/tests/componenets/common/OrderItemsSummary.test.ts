import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';

describe('OrderItemsSummary', () => {
    it('renders the heading and total label', () => {
        const wrapper = mount(OrderItemsSummary, {
            props: {
                heading: 'Items',
                items: [],
                totalLabel: 'Total',
                total: 0,
            },
        });

        expect(wrapper.text()).toContain('Items');
        expect(wrapper.text()).toContain('Total');
    });

    it('renders each item name, quantity, and computed line total', () => {
        const wrapper = mount(OrderItemsSummary, {
            props: {
                heading: 'Items',
                items: [
                    {
                        id: 1,
                        name: 'Widget',
                        quantity: 2,
                        unitPrice: '19.99',
                    },
                ],
                totalLabel: 'Total',
                total: '39.98',
            },
        });

        expect(wrapper.text()).toContain('Widget');
        expect(wrapper.text()).toContain('2');
        expect(wrapper.text()).toContain('$39.98');
    });

    it('renders variant options in parens when provided', () => {
        const wrapper = mount(OrderItemsSummary, {
            props: {
                heading: 'Items',
                items: [
                    {
                        id: 1,
                        name: 'Widget',
                        variantOptions: { color: 'red' },
                        quantity: 1,
                        unitPrice: '10.00',
                    },
                ],
                totalLabel: 'Total',
                total: '10.00',
            },
        });

        expect(wrapper.text()).toContain('(color: red)');
    });

    it('omits variant options text when none are given', () => {
        const wrapper = mount(OrderItemsSummary, {
            props: {
                heading: 'Items',
                items: [
                    {
                        id: 1,
                        name: 'Widget',
                        quantity: 1,
                        unitPrice: '10.00',
                    },
                ],
                totalLabel: 'Total',
                total: '10.00',
            },
        });

        expect(wrapper.text()).not.toContain('(');
    });

    it('formats the overall total', () => {
        const wrapper = mount(OrderItemsSummary, {
            props: {
                heading: 'Items',
                items: [],
                totalLabel: 'Total',
                total: 59.98,
            },
        });

        expect(wrapper.text()).toContain('$59.98');
    });
});
