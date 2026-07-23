import { router, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DropdownLink from '@/components/DropdownLink.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';

function pageWith(user: { name: string; email: string } | null) {
    return { props: { auth: { user }, errors: {} } } as unknown as ReturnType<typeof usePage>;
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    vi.mocked(router.post).mockClear();
    vi.mocked(router.get).mockClear();
});

afterEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWith(null));
});

describe('ShopAuthBanner', () => {
    it('renders login/register links when no user is authenticated', () => {
        vi.mocked(usePage).mockReturnValue(pageWith(null));

        const wrapper = mount(ShopAuthBanner);
        const links = wrapper.findAllComponents({ name: 'ButtonLink' });

        expect(links).toHaveLength(2);
        expect(links[0].props('href')).toBe('login');
        expect(links[1].props('href')).toBe('register');
    });

    it('greets the authenticated user by name', () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: 'Jane Doe', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);

        expect(wrapper.text()).toContain('Jane Doe');
    });

    it('falls back to the email when the user has no name', () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: '', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);

        expect(wrapper.text()).toContain('jane@example.com');
    });

    it('renders the three dropdown links', () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: 'Jane Doe', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);
        const links = wrapper.findAllComponents(DropdownLink);

        expect(links).toHaveLength(3);
        expect(links[0].props('href')).toBe('profile.edit');
        expect(links[0].text()).toBe('common.nav.profile');
        expect(links[1].props('href')).toBe('account.addresses.index');
        expect(links[1].text()).toBe('common.nav.addresses');
        expect(links[2].props('href')).toBe('account.orders');
        expect(links[2].text()).toBe('common.nav.orderHistory');
    });

    it('opens the logout confirmation dialog when the logout trigger is clicked', async () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: 'Jane Doe', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);

        await wrapper.findComponent({ name: 'Dropdown' }).find('button').trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });

        expect(dialog.props('show')).toBe(false);

        const logoutButton = wrapper.findAll('button').find((button) => button.text() === 'common.nav.logOut');
        await logoutButton?.trigger('click');

        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show')).toBe(true);
    });

    it('posts to the logout route and resets state on finish when confirmed', async () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: 'Jane Doe', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);

        await wrapper.findComponent({ name: 'ConfirmationDialog' }).vm.$emit('confirm');

        expect(vi.mocked(router.post)).toHaveBeenCalledWith('logout', {}, expect.objectContaining({ onFinish: expect.any(Function) }));

        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('processing')).toBe(true);

        const onFinish = vi.mocked(router.post).mock.calls[0][2]?.onFinish;
        onFinish?.({} as Parameters<NonNullable<typeof onFinish>>[0]);
        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show')).toBe(false);
        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('processing')).toBe(false);
    });

    it('resets confirmingLogout without posting when the dialog is cancelled', async () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ name: 'Jane Doe', email: 'jane@example.com' }));

        const wrapper = mount(ShopAuthBanner);

        const logoutButton = wrapper.findAll('button').find((button) => button.text() === 'common.nav.logOut');
        await logoutButton?.trigger('click');
        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show')).toBe(true);

        await wrapper.findComponent({ name: 'ConfirmationDialog' }).vm.$emit('cancel');

        expect(wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show')).toBe(false);
        expect(router.post).not.toHaveBeenCalled();
    });
});
