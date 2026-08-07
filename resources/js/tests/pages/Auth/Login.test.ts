import { LogIn } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import Login from '@/pages/Auth/Login.vue';
import { getMockForm, routeMock } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectPassesValidationErrorsToFields,
    expectRendersRequiredFormFieldLabels,
    itBehavesLikeGuestAuthPage,
} from './authAssertions';

function mountLogin(props = {}) {
    return mount(Login, { props });
}

describe('Login page', () => {
    itBehavesLikeGuestAuthPage({
        mount: mountLogin,
        titleKey: 'auth.login.title',
        icon: LogIn,
        iconName: 'LogIn',
        submitKey: 'auth.login.submit',
    });

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

    it('renders a FormField for email and password with the right labels', () => {
        expectRendersRequiredFormFieldLabels(mountLogin(), [
            'auth.login.email',
            'auth.login.password',
        ]);
    });

    it('passes validation errors through to the email and password fields', async () => {
        const wrapper = mountLogin();

        await expectPassesValidationErrorsToFields(wrapper, {
            email: 'These credentials do not match our records.',
            password: 'The password field is required.',
        });
    });

    it('renders the remember me text', () => {
        const wrapper = mountLogin();

        expect(wrapper.text()).toContain('auth.login.rememberMe');
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

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('blocks submission and shows a client-side error for an invalid email format', async () => {
        const wrapper = mountLogin();

        await wrapper.find('#email').setValue('not-an-email');
        await wrapper.find('#password').setValue('secret');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.email',
        );
    });
});
