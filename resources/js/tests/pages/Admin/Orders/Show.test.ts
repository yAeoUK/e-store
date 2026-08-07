import { router, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OrdersShowPage from '@/pages/Admin/Orders/Show.vue';
import { getMockForm, routeMock } from '../../../setup';
import {
    defaultAddressSnapshot,
    defaultOrder,
    expectRendersPageTitle,
    pageWith,
    testServerErrorFlash,
} from '../../../utils';

const order = defaultOrder({
    id: 42,
    admin_note: null as string | null,
    shipping_address_snapshot: defaultAddressSnapshot({
        line1: '1 Main St',
        city: 'Testville',
        postal_code: '12345',
    }),
    user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
});

beforeEach(() => {
    vi.mocked(router.post).mockClear();
    vi.mocked(usePage).mockReturnValue(pageWith({ errors: {} }));
});

function mountPage(
    overrides: {
        order?: typeof order;
        allowed_transitions?: string[];
    } = {},
) {
    return mount(OrdersShowPage, {
        props: {
            order: overrides.order ?? order,
            allowed_transitions: overrides.allowed_transitions ?? [
                'processing',
                'cancelled',
            ],
        },
    });
}

describe('Admin Orders show page', () => {
    it('renders the page title with the order id', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'admin.orders.detail.pageTitle #42');
    });

    it('renders the customer, items and shipping address', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('Jane Doe');
        expect(text).toContain('jane@example.com');
        expect(text).toContain('Widget');
        expect(text).toContain('1 Main St');
    });

    it('pre-fills the status form with the current status and lists allowed transitions', () => {
        mountPage();

        expect(getMockForm(0).status).toBe('pending');
    });

    it('renders the current status plus only the allowed next statuses as options', () => {
        const wrapper = mountPage();

        const options = wrapper.findAll('select option').map((o) => o.text());
        expect(options).toEqual([
            'admin.orders.statuses.pending',
            'admin.orders.statuses.processing',
            'admin.orders.statuses.cancelled',
        ]);
    });

    it('disables the status save button when there are no allowed transitions', () => {
        const wrapper = mountPage({ allowed_transitions: [] });

        const saveButtons = wrapper
            .findAllComponents({ name: 'PrimaryButton' })
            .filter((b) => b.text() === 'admin.orders.detail.save');
        expect(saveButtons[0].attributes('disabled')).toBeDefined();
    });

    it('submits the status form to the update route', async () => {
        const wrapper = mountPage();

        await wrapper.find('select').setValue('processing');
        await wrapper.findAll('form')[0].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.orders.update', 42);
        expect(getMockForm(0).lastPostUrl).toBe('admin.orders.update');
    });

    it('pre-fills the admin note form and submits it to the update route', async () => {
        const wrapper = mountPage();

        expect(getMockForm(1).admin_note).toBe('');

        await wrapper.find('textarea').setValue('Called the customer.');
        await wrapper.findAll('form')[1].trigger('submit');

        expect(getMockForm(1).admin_note).toBe('Called the customer.');
        expect(getMockForm(1).lastPostUrl).toBe('admin.orders.update');
    });

    it('does not render a customer note section when there is none', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).not.toContain(
            'admin.orders.detail.customerNote',
        );
    });

    it('renders the customer note read-only when present, badged as from the customer', () => {
        const wrapper = mountPage({
            order: { ...order, customer_note: 'Ring the doorbell twice' },
        });

        expect(wrapper.text()).toContain('admin.orders.detail.customerNote');
        expect(wrapper.text()).toContain('Ring the doorbell twice');
        expect(wrapper.text()).toContain(
            'admin.orders.detail.customerNoteBadge',
        );
        // only the admin note has an editable textarea - the customer's
        // note is rendered as plain read-only text
        expect(wrapper.findAll('textarea')).toHaveLength(1);
    });

    it('badges the admin note as internal-only', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.orders.detail.adminNoteBadge');
    });

    it('gives the customer note and admin note cards visually distinct accents', () => {
        const wrapper = mountPage({
            order: { ...order, customer_note: 'Ring the doorbell twice' },
        });

        const cards = wrapper.findAllComponents({ name: 'Card' });
        const customerNoteCard = cards.find((card) =>
            card.text().includes('admin.orders.detail.customerNoteBadge'),
        );
        const adminNoteCard = cards.find((card) =>
            card.text().includes('admin.orders.detail.adminNoteBadge'),
        );

        expect(customerNoteCard?.classes().join(' ')).toContain(
            'border-s-indigo-400',
        );
        expect(adminNoteCard?.classes().join(' ')).not.toContain(
            'border-s-indigo-400',
        );
    });

    it('only shows the refund action when the payment is paid', () => {
        const unpaid = mountPage();
        expect(unpaid.text()).not.toContain('admin.orders.detail.refund');

        const paid = mountPage({
            order: { ...order, payment_status: 'paid' },
        });
        expect(paid.text()).toContain('admin.orders.detail.refund');
    });

    it('refunds the order on confirm', async () => {
        const wrapper = mountPage({
            order: { ...order, payment_status: 'paid' },
        });

        const refundButton = wrapper
            .findAllComponents({ name: 'PrimaryButton' })
            .find((b) => b.text() === 'admin.orders.detail.refund');
        await refundButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);

        await dialog.vm.$emit('confirm');

        expect(router.post).toHaveBeenCalledWith(
            'admin.orders.refund',
            {},
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    testServerErrorFlash(mountPage, {
        errorKey: 'refund',
        message: 'Stripe refund failed.',
        skipDefaultCheck: true,
    });

    it('renders inside the expected layout components', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(
            wrapper.findAllComponents({ name: 'Card' }).length,
        ).toBeGreaterThan(0);
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
    });
});
