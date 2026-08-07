import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination.vue';
import Orders from '@/pages/Account/Orders.vue';
import { expectRendersPageTitle } from '../../utils';

const orders = {
    data: [
        {
            id: 1,
            total: '49.99',
            status: 'completed',
            created_at: '2026-01-01T00:00:00.000Z',
        },
        {
            id: 2,
            total: '10.00',
            status: 'cancelled',
            created_at: '2026-01-02T00:00:00.000Z',
        },
    ],
    links: [],
};

function mountPage(overrides: { orders?: typeof orders } = {}) {
    return mount(Orders, {
        props: {
            orders: overrides.orders ?? orders,
        },
    });
}

describe('Orders page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'account.orders.pageTitle');
    });

    it('renders the empty message when there are no orders', () => {
        const wrapper = mountPage({ orders: { data: [], links: [] } });

        expect(wrapper.text()).toContain('account.orders.empty');
        expect(wrapper.find('svg').exists()).toBe(true);
        expect(
            wrapper
                .findAllComponents(Link)
                .some((link) => link.props('href') === 'account.orders.show'),
        ).toBe(false);
    });

    it('renders a row with the id, total and status badge for each order', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('#1');
        expect(wrapper.text()).toContain('$49.99');
        expect(wrapper.text()).toContain('account.orders.statuses.completed');

        expect(wrapper.text()).toContain('#2');
        expect(wrapper.text()).toContain('$10.00');
        expect(wrapper.text()).toContain('account.orders.statuses.cancelled');
    });

    it("renders each order's created_at date, formatted", () => {
        const wrapper = mountPage();

        orders.data.forEach((order) => {
            expect(wrapper.text()).toContain(
                new Date(order.created_at).toLocaleDateString(),
            );
        });
    });

    it('links each row to its order detail page', () => {
        const wrapper = mountPage();
        const orderLinks = wrapper
            .findAllComponents(Link)
            .filter((link) => link.props('href') === 'account.orders.show');

        expect(orderLinks).toHaveLength(2);
    });

    it('renders the Pagination component with the given links', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(Pagination).exists()).toBe(true);
    });
});
