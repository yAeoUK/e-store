import { Lock } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ResetPassword from '@/pages/Auth/ResetPassword.vue';
import { routeMock } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectPassesValidationErrorsToFields,
    expectRendersRequiredFormFieldLabels,
    itBehavesLikeGuestAuthPage,
} from './authAssertions';

function mountResetPassword() {
    return mount(ResetPassword, {
        props: { email: 'jane@example.com', token: 'reset-token' },
    });
}

describe('ResetPassword page', () => {
    itBehavesLikeGuestAuthPage({
        mount: mountResetPassword,
        titleKey: 'auth.resetPassword.title',
        icon: Lock,
        iconName: 'Lock',
        submitKey: 'auth.resetPassword.submit',
    });

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

    it('renders a FormField for email, password and confirm password with the right labels', () => {
        expectRendersRequiredFormFieldLabels(mountResetPassword(), [
            'auth.resetPassword.email',
            'auth.resetPassword.password',
            'auth.resetPassword.confirmPassword',
        ]);
    });

    it('passes validation errors through to each field', async () => {
        const wrapper = mountResetPassword();

        await expectPassesValidationErrorsToFields(wrapper, {
            email: 'We could not find a user with that email address.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        });
    });

    it('blocks submission and shows a client-side error when password is empty', async () => {
        const wrapper = mountResetPassword();

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('blocks submission and shows a client-side error for an invalid email format', async () => {
        const wrapper = mountResetPassword();

        await wrapper.find('#email').setValue('not-an-email');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.email',
        );
    });

    it('blocks submission and shows a client-side error when password confirmation does not match', async () => {
        const wrapper = mountResetPassword();

        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('different');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.confirmed',
        );
    });
});
