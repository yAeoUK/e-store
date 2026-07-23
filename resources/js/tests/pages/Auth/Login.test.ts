import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import Login from '@/pages/Auth/Login.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

function mountLogin(props = {}) {
    return mount(Login, { props });
}

describe('Login page', () => {
    it('renders the email, password and remember fields', () => {
        const wrapper = mountLogin();

        expect(wrapper.find('#email').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(true);
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    });

    it('shows the forgot-password link when canResetPassword is true', () => {
        const wrapper = mountLogin({ canResetPassword: true });
        const link = wrapper.findComponent(TextLink);

        expect(wrapper.text()).toContain('auth.login.forgotPassword');
        expect(link.props('href')).toBe('password.request');
    });

    it('hides the forgot-password link when canResetPassword is false', () => {
        const wrapper = mountLogin({ canResetPassword: false });

        expect(wrapper.text()).not.toContain('auth.login.forgotPassword');
    });

    it('shows the status message when provided', () => {
        const wrapper = mountLogin({ status: 'Session expired.' });

        expect(wrapper.text()).toContain('Session expired.');
    });

    it('does not show a status message when absent', () => {
        const wrapper = mountLogin();

        expect(wrapper.findComponent(SuccessText).exists()).toBe(false);
    });

    it('submits to the login route and clears only the password field on finish', async () => {
        const wrapper = mountLogin();

        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('login');
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com');
        expect((wrapper.find('#password').element as HTMLInputElement).value).toBe('');
    });

    it('renders within GuestLayout', () => {
        const wrapper = mountLogin();

        expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });

    it('renders the page title via Head', () => {
        const wrapper = mountLogin();
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.login.title');
    });

    it('renders the input label and input error for email and password', () => {
        const wrapper = mountLogin();
        const labels = wrapper.findAllComponents(InputLabel);
        const errors = wrapper.findAllComponents(InputError);

        expect(labels).toHaveLength(2);
        expect(labels[0].props('value')).toBe('auth.login.email');
        expect(labels[1].props('value')).toBe('auth.login.password');

        expect(errors).toHaveLength(2);
    });

    it('renders validation errors when present', async () => {
        const wrapper = mountLogin();

        getMockForm().errors = {
            email: 'These credentials do not match our records.',
            password: 'The password field is required.',
        };
        await wrapper.vm.$nextTick();

        const errors = wrapper.findAllComponents(InputError);

        expect(errors[0].props('message')).toBe('These credentials do not match our records.');
        expect(errors[1].props('message')).toBe('The password field is required.');
        expect(wrapper.text()).toContain('These credentials do not match our records.');
    });

    it('renders the remember me text', () => {
        const wrapper = mountLogin();

        expect(wrapper.text()).toContain('auth.login.rememberMe');
    });

    it('renders the submit button', () => {
        const wrapper = mountLogin();
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.login.submit');
    });
});
