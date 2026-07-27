import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import ConfirmPassword from '@/pages/Auth/ConfirmPassword.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

describe('ConfirmPassword page', () => {
    it('renders a single password field, autofocused', () => {
        const wrapper = mount(ConfirmPassword);
        const input = wrapper.find('#password');

        expect(input.exists()).toBe(true);
        expect(input.attributes('autofocus')).not.toBeUndefined();
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(ConfirmPassword);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.confirmPassword.title');
    });

    it('renders the explanation text', () => {
        const wrapper = mount(ConfirmPassword);

        expect(wrapper.text()).toContain('auth.confirmPassword.description');
    });

    it('renders within GuestLayout', () => {
        const wrapper = mount(ConfirmPassword);

        expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });

    it('renders a FormField for password with the right label', () => {
        const wrapper = mount(ConfirmPassword);
        const field = wrapper.findComponent(FormField);

        expect(field.exists()).toBe(true);
        expect(field.props('label')).toBe('auth.confirmPassword.password');
    });

    it('passes validation errors through to the field', async () => {
        const wrapper = mount(ConfirmPassword);

        getMockForm().errors = {
            password: 'The password is incorrect.',
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(FormField).props('error')).toBe(
            'The password is incorrect.',
        );
        expect(wrapper.text()).toContain('The password is incorrect.');
    });

    it('renders the submit button', () => {
        const wrapper = mount(ConfirmPassword);
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.confirmPassword.submit');
    });

    it('disables the submit button while the form is processing', async () => {
        const wrapper = mount(ConfirmPassword);

        getMockForm().processing = true;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
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
});
