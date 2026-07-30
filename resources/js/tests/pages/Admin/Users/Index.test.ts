import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UsersIndexPage from '@/pages/Admin/Users/Index.vue';
import { routeMock } from '../../../setup';

const users = {
    data: [
        {
            id: 1,
            name: 'Jane Doe',
            email: 'jane@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
            orders_count: 3,
            is_admin: false,
        },
        {
            id: 2,
            name: 'No Orders',
            email: 'noorders@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
            orders_count: 0,
            is_admin: false,
        },
        {
            id: 3,
            name: 'Root Admin',
            email: 'admin@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
            orders_count: 0,
            is_admin: true,
        },
    ],
    links: [],
};

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.post).mockClear();
});

function mountPage() {
    return mount(UsersIndexPage, {
        props: { users, filters: { search: null } },
    });
}

describe('Admin Users index page', () => {
    it('links a non-zero orders count to the orders page filtered by user', () => {
        const wrapper = mountPage();

        const link = wrapper.findAll('a').find((a) => a.text() === '3');
        expect(link?.attributes('href')).toBe('admin.orders.index');
    });

    it('shows plain text for a zero orders count', () => {
        const wrapper = mountPage();

        const links = wrapper.findAll('a').filter((a) => a.text() === '0');
        expect(links).toHaveLength(0);
        expect(wrapper.text()).toContain('0');
    });

    it('renders the page title, heading, search field and confirm button', () => {
        const wrapper = mountPage();

        expect(
            wrapper.findComponent({ name: 'Head' }).attributes('title'),
        ).toBe('admin.users.pageTitle');
        expect(wrapper.text()).toContain('admin.users.heading');
        expect(wrapper.text()).toContain('admin.users.searchPlaceholder');
        expect(wrapper.text()).toContain('common.confirm');
    });

    it('renders the table column headers', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.users.columns.name');
        expect(wrapper.text()).toContain('admin.users.columns.email');
        expect(wrapper.text()).toContain('admin.users.columns.orders');
        expect(wrapper.text()).toContain('admin.users.columns.role');
        expect(wrapper.text()).toContain('admin.users.columns.joined');
    });

    it('shows the admin role label for an admin row and the user role label for non-admin rows', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.users.roleAdmin');
        expect(wrapper.text()).toContain('admin.users.roleUser');
    });

    it('shows the empty message when there are no users', () => {
        const wrapper = mount(UsersIndexPage, {
            props: {
                users: { data: [], links: [] },
                filters: { search: null },
            },
        });

        expect(wrapper.text()).toContain('admin.users.empty');
    });

    it('renders the DataTable, Pagination and AdminLayout components', () => {
        const wrapper = mountPage();

        expect(
            wrapper.findComponent({ name: 'AdminLayout' }).exists(),
        ).toBe(true);
        expect(wrapper.findComponent({ name: 'DataTable' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'FormField' }).exists()).toBe(
            true,
        );
        expect(
            wrapper.findComponent({ name: 'PrimaryButton' }).exists(),
        ).toBe(true);
        expect(
            wrapper.findAllComponents({ name: 'SecondaryButton' }).length,
        ).toBeGreaterThan(0);
        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).exists(),
        ).toBe(true);
    });

    it('does not show the promote button for an already-admin user', () => {
        const wrapper = mountPage();

        const promoteButtons = wrapper
            .findAll('button')
            .filter((button) => button.text() === 'admin.users.promote');

        // Only the two non-admin rows (Jane Doe, No Orders) get a promote button.
        expect(promoteButtons).toHaveLength(2);
    });

    it('opens the confirmation dialog with the promote title and message when promote is clicked', async () => {
        const wrapper = mountPage();

        const dialogBefore = wrapper.findComponent({
            name: 'ConfirmationDialog',
        });
        expect(dialogBefore.props('show')).toBe(false);

        const promoteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.users.promote');
        await promoteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('title')).toBe(
            'admin.users.promoteConfirmTitle',
        );
        expect(dialog.props('message')).toBe(
            'admin.users.promoteConfirmMessage',
        );
        expect(dialog.props('confirmLabel')).toBe('admin.users.promote');
    });

    it('promotes the user on confirm', async () => {
        const wrapper = mountPage();

        const promoteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.users.promote');
        await promoteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.vm.$emit('confirm');

        expect(router.post).toHaveBeenCalledWith(
            'admin.admins.promote',
            { email: 'jane@example.com' },
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    it('closes the dialog without promoting on cancel', async () => {
        const wrapper = mountPage();

        const promoteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.users.promote');
        await promoteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);

        await dialog.vm.$emit('cancel');

        expect(router.post).not.toHaveBeenCalled();
        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props(
                'show',
            ),
        ).toBe(false);
    });
});
