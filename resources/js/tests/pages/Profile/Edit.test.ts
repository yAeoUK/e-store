import { Head, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Card from '@/components/Card.vue';
import ProfileEditPage from '@/pages/Profile/Edit.vue';
import DeleteUserForm from '@/pages/Profile/Partials/DeleteUserForm.vue';
import UpdatePasswordForm from '@/pages/Profile/Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from '@/pages/Profile/Partials/UpdateProfileInformationForm.vue';

function pageWithUser() {
    return {
        props: {
            auth: {
                user: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    email_verified_at: '2026-01-01T00:00:00.000Z',
                },
            },
        },
    } as unknown as ReturnType<typeof usePage>;
}

beforeEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWithUser());
});

describe('Profile edit page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(ProfileEditPage);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('profile.title');
    });

    it('renders the profile information, password and delete-account sections in order', () => {
        const wrapper = mount(ProfileEditPage, {
            props: { mustVerifyEmail: true, status: 'verification-link-sent' },
        });

        const cards = wrapper.findAllComponents(Card);
        expect(cards).toHaveLength(3);
        expect(
            cards[0].findComponent(UpdateProfileInformationForm).exists(),
        ).toBe(true);
        expect(cards[1].findComponent(UpdatePasswordForm).exists()).toBe(true);
        expect(cards[2].findComponent(DeleteUserForm).exists()).toBe(true);
    });

    it('forwards mustVerifyEmail and status to the profile information form', () => {
        const wrapper = mount(ProfileEditPage, {
            props: { mustVerifyEmail: true, status: 'verification-link-sent' },
        });

        const infoForm = wrapper.findComponent(UpdateProfileInformationForm);
        expect(infoForm.props('mustVerifyEmail')).toBe(true);
        expect(infoForm.props('status')).toBe('verification-link-sent');
    });

    it('renders within the ShopLayout', () => {
        const wrapper = mount(ProfileEditPage);

        expect(wrapper.findComponent({ name: 'ShopLayout' }).exists()).toBe(
            true,
        );
    });
});
