import { ShieldCheck } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import ConfirmPassword from '@/pages/Auth/ConfirmPassword.vue';
import { routeMock } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectPassesSingleFieldValidationError,
    itBehavesLikeGuestAuthPage,
} from './authAssertions';

describe('ConfirmPassword page', () => {
    itBehavesLikeGuestAuthPage({
        mount: () => mount(ConfirmPassword),
        titleKey: 'auth.confirmPassword.title',
        icon: ShieldCheck,
        iconName: 'ShieldCheck',
        submitKey: 'auth.confirmPassword.submit',
    });

    it('renders a single password field, autofocused', () => {
        const wrapper = mount(ConfirmPassword);
        const input = wrapper.find('#password');

        expect(input.exists()).toBe(true);
        expect(input.attributes('autofocus')).not.toBeUndefined();
    });

    it('renders the explanation text', () => {
        const wrapper = mount(ConfirmPassword);

        expect(wrapper.text()).toContain('auth.confirmPassword.description');
    });

    it('renders a FormField for password with the right label', () => {
        const wrapper = mount(ConfirmPassword);
        const field = wrapper.findComponent(FormField);

        expect(field.exists()).toBe(true);
        expect(field.props('label')).toBe('auth.confirmPassword.password');
        expect(field.props('required')).toBe(true);
    });

    it('passes validation errors through to the field', async () => {
        const wrapper = mount(ConfirmPassword);

        await expectPassesSingleFieldValidationError(
            wrapper,
            'password',
            'The password is incorrect.',
        );
    });

    it('submits to the password.confirm route and clears the field on finish', async () => {
        const wrapper = mount(ConfirmPassword);

        await wrapper.find('#password').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('password.confirm');
        expect(
            (wrapper.find('#password').element as HTMLInputElement).value,
        ).toBe('');
    });

    it('blocks submission and shows a client-side error when password is empty', async () => {
        const wrapper = mount(ConfirmPassword);

        await expectBlocksSubmissionWithClientError(
            wrapper,
            'validation.required',
        );
    });
});
