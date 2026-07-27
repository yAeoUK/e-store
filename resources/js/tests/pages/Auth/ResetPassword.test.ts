import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import ResetPassword from '@/pages/Auth/ResetPassword.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

function mountResetPassword() {
    return mount(ResetPassword, {
        props: { email: 'jane@example.com', token: 'reset-token' },
    });
}

describe('ResetPassword page', () => {
    it('pre-fills the email field from props', () => {
        const wrapper = mountResetPassword();

        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe(
            'jane@example.com',
        );
    });

    it('renders the password and password_confirmation fields', () => {
        const wrapper = mountResetPassword();

        expect(wrapper.find('#password').exists()).toBe(true);
        expect(wrapper.find('#password_confirmation').exists()).toBe(true);
    });

    it('submits to the password.store route and clears both password fields on finish', async () => {
        const wrapper = mountResetPassword();

        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('password.store');
        expect(
            (wrapper.find('#password').element as HTMLInputElement).value,
        ).toBe('');
        expect(
            (wrapper.find('#password_confirmation').element as HTMLInputElement)
                .value,
        ).toBe('');
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe(
            'jane@example.com',
        );
    });

    it('renders within GuestLayout', () => {
        const wrapper = mountResetPassword();

        expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });

    it('renders the page title via Head', () => {
        const wrapper = mountResetPassword();
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.resetPassword.title');
    });

    it('renders a FormField for email, password and confirm password with the right labels', () => {
        const wrapper = mountResetPassword();
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(3);
        expect(fields[0].props('label')).toBe('auth.resetPassword.email');
        expect(fields[1].props('label')).toBe('auth.resetPassword.password');
        expect(fields[2].props('label')).toBe(
            'auth.resetPassword.confirmPassword',
        );
    });

    it('passes validation errors through to each field', async () => {
        const wrapper = mountResetPassword();

        getMockForm().errors = {
            email: 'We could not find a user with that email address.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        };
        await wrapper.vm.$nextTick();

        const fields = wrapper.findAllComponents(FormField);

        expect(fields[0].props('error')).toBe(
            'We could not find a user with that email address.',
        );
        expect(fields[1].props('error')).toBe(
            'The password field is required.',
        );
        expect(fields[2].props('error')).toBe(
            'The password confirmation does not match.',
        );
        expect(wrapper.text()).toContain(
            'The password confirmation does not match.',
        );
    });

    it('renders the submit button', () => {
        const wrapper = mountResetPassword();
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.resetPassword.submit');
    });

    it('disables the submit button while the form is processing', async () => {
        const wrapper = mountResetPassword();

        getMockForm().processing = true;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });
});
