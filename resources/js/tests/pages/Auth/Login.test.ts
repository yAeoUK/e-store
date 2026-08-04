import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
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
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe(
            'jane@example.com',
        );
        expect(
            (wrapper.find('#password').element as HTMLInputElement).value,
        ).toBe('');
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

    it('renders a FormField for email and password with the right labels', () => {
        const wrapper = mountLogin();
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(2);
        expect(fields[0].props('label')).toBe('auth.login.email');
        expect(fields[1].props('label')).toBe('auth.login.password');
        expect(fields[0].props('required')).toBe(true);
        expect(fields[1].props('required')).toBe(true);
    });

    it('passes validation errors through to the email and password fields', async () => {
        const wrapper = mountLogin();

        getMockForm().errors = {
            email: 'These credentials do not match our records.',
            password: 'The password field is required.',
        };
        await wrapper.vm.$nextTick();

        const fields = wrapper.findAllComponents(FormField);

        expect(fields[0].props('error')).toBe(
            'These credentials do not match our records.',
        );
        expect(fields[1].props('error')).toBe(
            'The password field is required.',
        );
        expect(wrapper.text()).toContain(
            'These credentials do not match our records.',
        );
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

    it('disables the submit button while the form is processing', async () => {
        const wrapper = mountLogin();

        getMockForm().processing = true;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });

    it('binds the remember-me checkbox to form.remember', async () => {
        const wrapper = mountLogin();

        expect(
            (wrapper.find('input[type="checkbox"]').element as HTMLInputElement)
                .checked,
        ).toBe(false);

        await wrapper.find('input[type="checkbox"]').setValue(true);

        expect(getMockForm().remember).toBe(true);
    });

    it('blocks submission and shows client-side errors when required fields are empty', async () => {
        const wrapper = mountLogin();

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows a client-side error for an invalid email format', async () => {
        const wrapper = mountLogin();

        await wrapper.find('#email').setValue('not-an-email');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.email');
    });
});
