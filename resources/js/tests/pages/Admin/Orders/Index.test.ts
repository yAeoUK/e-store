import { Head, router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FormField from '@/components/FormField.vue';
import Pagination from '@/components/Pagination.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import OrdersIndexPage from '@/pages/Admin/Orders/Index.vue';
import { routeMock } from '../../../setup';

const orders = {
    data: [
        {
            id: 1,
            total: '49.99',
            status: 'completed',
            created_at: '2026-01-01T00:00:00.000Z',
            user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
        },
        {
            id: 2,
            total: '10.00',
            status: 'cancelled',
            created_at: '2026-01-02T00:00:00.000Z',
            user: null,
        },
    ],
    links: [],
};

beforeEach(() => {
    routeMock.mockClear();
    vi.mocked(router.get).mockClear();
});

function mountPage(overrides: { orders?: typeof orders } = {}) {
    return mount(OrdersIndexPage, {
        props: {
            orders: overrides.orders ?? orders,
            filters: { search: null, user_id: null },
        },
    });
}

describe('Admin Orders index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.orders.pageTitle',
        );
    });

    it('renders the customer name and email when present', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('Jane Doe');
        expect(wrapper.text()).toContain('jane@example.com');
    });

    it('falls back to a dash when there is no customer', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('—');
    });

    it('formats the total as currency', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('$49.99');
        expect(wrapper.text()).toContain('$10.00');
    });

    it('renders a status badge with the translated label for each order', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.statuses.completed');
        expect(wrapper.text()).toContain('admin.orders.statuses.cancelled');
    });

    it('submits the search filter via router.get', async () => {
        const wrapper = mountPage();

        await wrapper.find('input[type="text"]').setValue('jane');
        await wrapper.find('form').trigger('submit');

        expect(router.get).toHaveBeenCalledWith(
            'admin.orders.index',
            { search: 'jane', user_id: null },
            { preserveState: true, replace: true },
        );
    });

    it('renders the page heading', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.heading');
    });

    it('renders the translated column headers', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.columns.id');
        expect(wrapper.text()).toContain('admin.orders.columns.customer');
        expect(wrapper.text()).toContain('admin.orders.columns.total');
        expect(wrapper.text()).toContain('admin.orders.columns.status');
        expect(wrapper.text()).toContain('admin.orders.columns.date');
    });

    it('renders the search field label and submit button text', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.users.searchPlaceholder');
        expect(wrapper.text()).toContain('common.confirm');
    });

    it('renders the empty message when there are no orders', () => {
        const wrapper = mountPage({ orders: { data: [], links: [] } });

        expect(wrapper.text()).toContain('admin.orders.empty');
    });

    it('renders the FormField, Pagination, PrimaryButton and AdminLayout components', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(FormField).exists()).toBe(true);
        expect(wrapper.findComponent(Pagination).exists()).toBe(true);
        expect(wrapper.findComponent(PrimaryButton).exists()).toBe(true);
        expect(wrapper.findComponent(AdminLayout).exists()).toBe(true);
    });
});
