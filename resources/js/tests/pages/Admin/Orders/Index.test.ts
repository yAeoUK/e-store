import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OrdersIndexPage from '@/pages/Admin/Orders/Index.vue';
import {
    expectRendersPageTitle,
    testRendersIndexLayout,
    testRendersLabels,
} from '../../../utils';

const orders = {
    data: [
        {
            id: 1,
            total: '49.99',
            status: 'completed',
            payment_method: 'stripe',
            payment_status: 'paid',
            created_at: '2026-01-01T00:00:00.000Z',
            user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
        },
        {
            id: 2,
            total: '10.00',
            status: 'cancelled',
            payment_method: 'cod',
            payment_status: 'unpaid',
            created_at: '2026-01-02T00:00:00.000Z',
            user: null,
        },
    ],
    links: [],
};

beforeEach(() => {
    vi.mocked(router.get).mockClear();
});

function mountPage(overrides: { orders?: typeof orders } = {}) {
    return mount(OrdersIndexPage, {
        props: {
            orders: overrides.orders ?? orders,
            filters: {
                search: null,
                user_id: null,
                status: null,
                date_from: null,
                date_to: null,
            },
        },
    });
}

describe('Admin Orders index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'admin.orders.pageTitle');
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

    it('submits the search and filter fields via router.get', async () => {
        const wrapper = mountPage();

        await wrapper.find('input[type="text"]').setValue('jane');
        await wrapper.find('select').setValue('processing');
        const dateInputs = wrapper.findAll('input[type="date"]');
        await dateInputs[0].setValue('2026-01-01');
        await dateInputs[1].setValue('2026-02-01');
        await wrapper.find('form').trigger('submit');

        expect(router.get).toHaveBeenCalledWith(
            'admin.orders.index',
            {
                search: 'jane',
                user_id: null,
                status: 'processing',
                date_from: '2026-01-01',
                date_to: '2026-02-01',
            },
            { preserveState: true, replace: true },
        );
    });

    it('renders the page heading', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.heading');
    });

    testRendersLabels(
        mountPage,
        [
            'admin.orders.columns.id',
            'admin.orders.columns.customer',
            'admin.orders.columns.total',
            'admin.orders.columns.status',
            'admin.orders.columns.payment',
            'admin.orders.columns.date',
        ],
        'renders the translated column headers',
    );

    it('renders the payment method and status for each order', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.paymentMethods.stripe');
        expect(wrapper.text()).toContain('admin.orders.paymentStatuses.paid');
        expect(wrapper.text()).toContain('admin.orders.paymentMethods.cod');
        expect(wrapper.text()).toContain('admin.orders.paymentStatuses.unpaid');
    });

    it('renders the search field label and submit button text', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.searchPlaceholder');
        expect(wrapper.text()).toContain('common.confirm');
    });

    it('renders the status filter options and date range fields', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.statusFilter');
        expect(wrapper.text()).toContain('admin.orders.allStatuses');
        expect(wrapper.text()).toContain('admin.orders.dateFrom');
        expect(wrapper.text()).toContain('admin.orders.dateTo');
        expect(wrapper.findAll('input[type="date"]')).toHaveLength(2);
    });

    it('renders a view link for each row', () => {
        const wrapper = mountPage();

        const viewLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'admin.actions.view');
        expect(viewLink?.attributes('href')).toBe('admin.orders.show');
    });

    it('renders the empty message when there are no orders', () => {
        const wrapper = mountPage({ orders: { data: [], links: [] } });

        expect(wrapper.text()).toContain('admin.orders.empty');
    });

    testRendersIndexLayout(mountPage, [
        'FormField',
        'Pagination',
        'PrimaryButton',
        'AdminLayout',
    ]);
});
