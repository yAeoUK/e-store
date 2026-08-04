import { usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FormField from '@/components/FormField.vue';
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

    it('renders a FormField for name and email with the right labels', () => {
        const wrapper = mount(UpdateProfileInformationForm);
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(2);
        expect(fields[0].props('label')).toBe('profile.information.name');
        expect(fields[1].props('label')).toBe('profile.information.email');
        expect(fields[0].props('required')).toBe(true);
        expect(fields[1].props('required')).toBe(true);
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

    it('blocks submission and shows a required error when the name is cleared', async () => {
        const wrapper = mount(UpdateProfileInformationForm);

        await wrapper.find('input#name').setValue('');
        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows an email format error for an invalid email', async () => {
        const wrapper = mount(UpdateProfileInformationForm);

        await wrapper.find('input#email').setValue('not-an-email');
        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.email');
    });
});
