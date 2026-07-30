import { Head, router, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminsIndexPage from '@/pages/Admin/Admins/Index.vue';
import { routeMock } from '../../../setup';

const admins = {
    data: [
        {
            id: 1,
            name: 'Current Admin',
            email: 'current@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
        },
        {
            id: 2,
            name: 'Other Admin',
            email: 'other@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
        },
    ],
    links: [],
};

function pageWith(errors: Record<string, string> = {}) {
    return {
        props: { auth: { user: { id: 1 } }, errors },
    } as unknown as ReturnType<typeof usePage>;
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.delete).mockClear();
    vi.mocked(usePage).mockReturnValue(pageWith());
});

afterEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWith());
});

function mountPage() {
    return mount(AdminsIndexPage, { props: { admins } });
}

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

// AdminLayout's header renders its own logout ConfirmationDialog (via
// ShopAuthBanner) whenever a user is logged in, so a plain
// findComponent({ name: 'ConfirmationDialog' }) would grab that one instead
// of this page's revoke dialog. Disambiguate by title.
function findRevokeDialog(wrapper: ReturnType<typeof mount>) {
    return wrapper
        .findAllComponents({ name: 'ConfirmationDialog' })
        .find(
            (dialog) =>
                dialog.props('title') === 'admin.admins.revokeConfirmTitle',
        )!;
}

describe('Admin Admins index page', () => {
    it('renders the page title, heading and column labels', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.admins.pageTitle',
        );
        expect(text).toContain('admin.admins.heading');
        expect(text).toContain('admin.admins.addAdmin');
        expect(text).toContain('admin.admins.columns.name');
        expect(text).toContain('admin.admins.columns.email');
        expect(text).toContain('admin.admins.columns.joined');
    });

    it('renders the add-admin ButtonLink pointing at admin.admins.create', () => {
        const wrapper = mountPage();

        const addAdminLink = wrapper
            .findAllComponents({ name: 'ButtonLink' })
            .find((link) => link.text() === 'admin.admins.addAdmin');

        expect(addAdminLink).toBeTruthy();
    });

    it('renders the Pagination component with the given links', () => {
        const wrapper = mount(AdminsIndexPage, {
            props: {
                admins: {
                    ...admins,
                    links: [
                        { url: '/admin/admins?page=1', label: '1', active: true },
                        { url: '/admin/admins?page=2', label: '2', active: false },
                    ],
                },
            },
        });

        const pagination = wrapper.findComponent({ name: 'Pagination' });

        expect(pagination.exists()).toBe(true);
        expect(pagination.props('links')).toHaveLength(2);
    });

    it('shows the empty message when there are no admins', () => {
        const wrapper = mount(AdminsIndexPage, {
            props: { admins: { data: [], links: [] } },
        });

        expect(wrapper.text()).toContain('admin.admins.empty');
    });

    it('shows a Revoke button for every admin except the current user', () => {
        const wrapper = mountPage();
        const revokeButtons = wrapper
            .findAll('button')
            .filter((button) => button.text() === 'admin.admins.revoke');

        expect(revokeButtons).toHaveLength(1);
    });

    it('does not show a revoke-blocked message by default', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).not.toContain(
            'You cannot revoke your own admin access.',
        );
    });

    it('shows the server error message when the server flashes an admin error', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ admin: 'You cannot revoke your own admin access.' }),
        );

        const wrapper = mountPage();

        expect(wrapper.text()).toContain(
            'You cannot revoke your own admin access.',
        );
    });

    it('opens the confirmation dialog and revokes on confirm', async () => {
        const wrapper = mountPage();

        await findButton(wrapper, 'admin.admins.revoke')?.trigger('click');

        const dialog = findRevokeDialog(wrapper);
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('message')).toBe(
            'admin.admins.revokeConfirmMessage',
        );

        await dialog.vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith('admin.admins.revoke', 2);
        expect(vi.mocked(router.delete)).toHaveBeenCalledWith(
            'admin.admins.revoke',
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    it('does not revoke when the dialog is cancelled', async () => {
        const wrapper = mountPage();

        await findButton(wrapper, 'admin.admins.revoke')?.trigger('click');
        await findRevokeDialog(wrapper).vm.$emit('cancel');

        expect(findRevokeDialog(wrapper).props('show')).toBe(false);
        expect(router.delete).not.toHaveBeenCalled();
    });
});
