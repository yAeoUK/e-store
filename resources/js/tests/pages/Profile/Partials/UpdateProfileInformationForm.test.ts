import { usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UpdateProfileInformationForm from '@/pages/Profile/Partials/UpdateProfileInformationForm.vue';
import { getMockForm, routeMock } from '../../../setup';

function pageWith(user: {
    name: string;
    email: string;
    email_verified_at: string | null;
}) {
    return {
        props: { auth: { user } },
    } as unknown as ReturnType<typeof usePage>;
}

const verifiedUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWith(verifiedUser));
});

describe('UpdateProfileInformationForm', () => {
    it('renders the heading, description, field labels and save button', () => {
        const wrapper = mount(UpdateProfileInformationForm);

        expect(wrapper.text()).toContain('profile.information.heading');
        expect(wrapper.text()).toContain('profile.information.description');
        expect(wrapper.text()).toContain('profile.information.name');
        expect(wrapper.text()).toContain('profile.information.email');
        expect(wrapper.text()).toContain('common.save');
    });

    it('shows the saved message after a successful submission', async () => {
        const wrapper = mount(UpdateProfileInformationForm);

        getMockForm().recentlySuccessful = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('common.saved');
    });

    it('pre-fills the form with the current user name and email', () => {
        mount(UpdateProfileInformationForm);

        expect(getMockForm().name).toBe(verifiedUser.name);
        expect(getMockForm().email).toBe(verifiedUser.email);
    });

    it('submits to the profile update route', async () => {
        const wrapper = mount(UpdateProfileInformationForm);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('profile.update');
    });

    it('does not show the unverified-email notice for a verified user', () => {
        const wrapper = mount(UpdateProfileInformationForm, {
            props: { mustVerifyEmail: true },
        });

        expect(wrapper.text()).not.toContain('profile.information.unverified');
    });

    it('shows the unverified-email notice and resend link when the email is unverified', async () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ ...verifiedUser, email_verified_at: null }),
        );

        const wrapper = mount(UpdateProfileInformationForm, {
            props: { mustVerifyEmail: true },
        });

        expect(wrapper.text()).toContain('profile.information.unverified');
        const resendLink = wrapper.findComponent({ name: 'Link' });
        expect(resendLink.exists()).toBe(true);
        expect(resendLink.props('href')).toBe('verification.send');
        expect(resendLink.text()).toBe('profile.information.resendLink');
    });

    it('shows the verification-sent success message when status matches', async () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ ...verifiedUser, email_verified_at: null }),
        );

        const wrapper = mount(UpdateProfileInformationForm, {
            props: {
                mustVerifyEmail: true,
                status: 'verification-link-sent',
            },
        });

        expect(wrapper.text()).toContain(
            'profile.information.verificationSent',
        );
    });
});
