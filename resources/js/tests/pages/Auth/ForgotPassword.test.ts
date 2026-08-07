import { KeyRound } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import SuccessText from '@/components/SuccessText.vue';
import ForgotPassword from '@/pages/Auth/ForgotPassword.vue';
import { routeMock } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectPassesSingleFieldValidationError,
    itBehavesLikeGuestAuthPage,
} from './authAssertions';

describe('ForgotPassword page', () => {
    itBehavesLikeGuestAuthPage({
        mount: () => mount(ForgotPassword),
        titleKey: 'auth.forgotPassword.title',
        icon: KeyRound,
        iconName: 'KeyRound',
        submitKey: 'auth.forgotPassword.submit',
    });

    it('renders the email field only', () => {
        const wrapper = mount(ForgotPassword);

        expect(wrapper.find('#email').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(false);
    });

    it('renders the description text', () => {
        const wrapper = mount(ForgotPassword);

        expect(wrapper.text()).toContain('auth.forgotPassword.description');
    });

    it('renders a FormField for email with the right label', () => {
        const wrapper = mount(ForgotPassword);
        const field = wrapper.findComponent(FormField);

        expect(field.exists()).toBe(true);
        expect(field.props('label')).toBe('auth.forgotPassword.email');
        expect(field.props('required')).toBe(true);
    });

    it('passes validation errors through to the field', async () => {
        const wrapper = mount(ForgotPassword);

        await expectPassesSingleFieldValidationError(
            wrapper,
            'email',
            'We could not find a user with that email address.',
        );
    });

    it('shows the status message when provided', () => {
        const wrapper = mount(ForgotPassword, {
            props: { status: 'Link sent.' },
        });

        expect(wrapper.text()).toContain('Link sent.');
    });

    it('does not show a status message when absent', () => {
        const wrapper = mount(ForgotPassword);

        expect(wrapper.findComponent(SuccessText).exists()).toBe(false);
    });

    it('submits to the password.email route', async () => {
        const wrapper = mount(ForgotPassword);

        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('password.email');
    });

    it('blocks submission and shows a client-side error when email is empty', async () => {
        const wrapper = mount(ForgotPassword);

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('blocks submission and shows a client-side error for an invalid email format', async () => {
        const wrapper = mount(ForgotPassword);

        await wrapper.find('#email').setValue('not-an-email');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.email',
        );
    });
});
