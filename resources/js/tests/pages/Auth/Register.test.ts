import { UserPlus } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TextLink from '@/components/TextLink.vue';
import Register from '@/pages/Auth/Register.vue';
import { routeMock } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectPassesValidationErrorsToFields,
    expectRendersRequiredFormFieldLabels,
    itBehavesLikeGuestAuthPage,
} from './authAssertions';

describe('Register page', () => {
    itBehavesLikeGuestAuthPage({
        mount: () => mount(Register),
        titleKey: 'auth.register.title',
        icon: UserPlus,
        iconName: 'UserPlus',
        submitKey: 'auth.register.submit',
    });

    it('renders the name, email, password and password_confirmation fields', () => {
        const wrapper = mount(Register);

        expect(wrapper.find('#name').exists()).toBe(true);
        expect(wrapper.find('#email').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(true);
        expect(wrapper.find('#password_confirmation').exists()).toBe(true);
    });

    it('submits to the register route and clears only the password fields on finish', async () => {
        const wrapper = mount(Register);

        await wrapper.find('#name').setValue('Jane Doe');
        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('register');
        expect((wrapper.find('#name').element as HTMLInputElement).value).toBe(
            'Jane Doe',
        );
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe(
            'jane@example.com',
        );
        expect(
            (wrapper.find('#password').element as HTMLInputElement).value,
        ).toBe('');
        expect(
            (wrapper.find('#password_confirmation').element as HTMLInputElement)
                .value,
        ).toBe('');
    });

    it('renders a FormField for name, email, password and confirm password with the right labels', () => {
        expectRendersRequiredFormFieldLabels(mount(Register), [
            'auth.register.name',
            'auth.register.email',
            'auth.register.password',
            'auth.register.confirmPassword',
        ]);
    });

    it('passes validation errors through to each field', async () => {
        const wrapper = mount(Register);

        await expectPassesValidationErrorsToFields(wrapper, {
            name: 'The name field is required.',
            email: 'The email field is required.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        });
    });

    it('the already registered link leads to the sign in screen', () => {
        const wrapper = mount(Register);
        const link = wrapper.findComponent(TextLink);

        expect(link.text()).toBe('auth.register.alreadyRegistered');
        expect(link.props('href')).toBe('login');
    });

    it('blocks submission and shows client-side errors when required fields are empty', async () => {
        const wrapper = mount(Register);

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });

    it('blocks submission and shows a client-side error for an invalid email format', async () => {
        const wrapper = mount(Register);

        await wrapper.find('#name').setValue('Jane Doe');
        await wrapper.find('#email').setValue('not-an-email');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.email',
        );
    });

    it('blocks submission and shows a client-side error when password confirmation does not match', async () => {
        const wrapper = mount(Register);

        await wrapper.find('#name').setValue('Jane Doe');
        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('different');
        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.confirmed',
        );
    });
});
