import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
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

        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com');
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
        expect((wrapper.find('#password').element as HTMLInputElement).value).toBe('');
        expect((wrapper.find('#password_confirmation').element as HTMLInputElement).value).toBe('');
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com');
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

    it('renders the input label and input error for email, password and confirm password', () => {
        const wrapper = mountResetPassword();
        const labels = wrapper.findAllComponents(InputLabel);
        const errors = wrapper.findAllComponents(InputError);

        expect(labels).toHaveLength(3);
        expect(labels[0].props('value')).toBe('auth.resetPassword.email');
        expect(labels[1].props('value')).toBe('auth.resetPassword.password');
        expect(labels[2].props('value')).toBe('auth.resetPassword.confirmPassword');

        expect(errors).toHaveLength(3);
    });

    it('renders validation errors when present', async () => {
        const wrapper = mountResetPassword();

        getMockForm().errors = {
            email: 'We could not find a user with that email address.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        };
        await wrapper.vm.$nextTick();

        const errors = wrapper.findAllComponents(InputError);

        expect(errors[0].props('message')).toBe('We could not find a user with that email address.');
        expect(errors[1].props('message')).toBe('The password field is required.');
        expect(errors[2].props('message')).toBe('The password confirmation does not match.');
        expect(wrapper.text()).toContain('The password confirmation does not match.');
    });

    it('renders the submit button', () => {
        const wrapper = mountResetPassword();
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.resetPassword.submit');
    });
});
