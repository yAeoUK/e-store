import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-chartjs', () => ({
    Line: { name: 'Line', props: ['data', 'options'], template: '<canvas />' },
    Bar: { name: 'Bar', props: ['data', 'options'], template: '<canvas />' },
}));

import CategoryChart from '@/components/admin/CategoryChart.vue';
import RevenueChart from '@/components/admin/RevenueChart.vue';
import StatCard from '@/components/admin/StatCard.vue';
import Card from '@/components/Card.vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import DashboardPage from '@/pages/Admin/Dashboard.vue';
import { routeMock } from '../../setup';
import { expectRendersPageTitle, testRendersLabels } from '../../utils';

const stats = {
    total_products: 42,
    total_categories: 6,
    total_users: 100,
    low_stock_products: 3,
    out_of_stock_products: 1,
    total_orders: 150,
    total_revenue: 1234.5,
};

function mountPage() {
    return mount(DashboardPage, {
        props: {
            stats,
            revenueByDay: [
                { date: '2026-07-01', revenue: 10, orders_count: 1 },
            ],
            topCategories: [{ id: 1, name: 'Electronics', products_count: 5 }],
        },
    });
}

describe('Admin Dashboard page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'admin.dashboard.pageTitle');
    });

    it('renders a stat card value for every stat', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('42');
        expect(wrapper.text()).toContain('100');
        expect(wrapper.text()).toContain('150');
        expect(wrapper.text()).toContain('$1234.50');
    });

    it('passes the revenue-by-day series to the revenue chart', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(RevenueChart).props('data')).toEqual([
            { date: '2026-07-01', revenue: 10, orders_count: 1 },
        ]);
    });

    it('passes the top-categories series to the category chart', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(CategoryChart).props('data')).toEqual([
            { id: 1, name: 'Electronics', products_count: 5 },
        ]);
    });

    it('links each stat card to its corresponding page', () => {
        const wrapper = mountPage();
        const cards = wrapper.findAllComponents(StatCard);

        expect(cards).toHaveLength(7);
        cards.forEach((card) => {
            expect(card.props('href')).toBeTruthy();
        });

        expect(routeMock).toHaveBeenCalledWith('admin.products.index');
        expect(routeMock).toHaveBeenCalledWith('admin.categories.index');
        expect(routeMock).toHaveBeenCalledWith('admin.users.index');
        expect(routeMock).toHaveBeenCalledWith('admin.orders.index');
        expect(routeMock).toHaveBeenCalledWith('admin.products.index', {
            stock_status: 'low',
        });
        expect(routeMock).toHaveBeenCalledWith('admin.products.index', {
            stock_status: 'out',
        });
    });

    testRendersLabels(
        mountPage,
        [
            'admin.dashboard.totalProducts',
            'admin.dashboard.totalCategories',
            'admin.dashboard.totalUsers',
            'admin.dashboard.totalOrders',
            'admin.dashboard.lowStock',
            'admin.dashboard.outOfStock',
            'admin.dashboard.totalRevenue',
        ],
        'renders the translated label for every stat card',
    );

    it('renders the chart card titles', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.dashboard.revenueChartTitle');
        expect(wrapper.text()).toContain('admin.dashboard.categoryChartTitle');
    });

    it('renders the Card and AdminLayout components', () => {
        const wrapper = mountPage();

        expect(wrapper.findAllComponents(Card).length).toBeGreaterThan(0);
        expect(wrapper.findComponent(AdminLayout).exists()).toBe(true);
    });
});
