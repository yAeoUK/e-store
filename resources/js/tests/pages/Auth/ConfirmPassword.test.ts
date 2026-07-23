import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
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

    it('renders the input label and input error for password', () => {
        const wrapper = mount(ConfirmPassword);
        const label = wrapper.findComponent(InputLabel);
        const error = wrapper.findComponent(InputError);

        expect(label.exists()).toBe(true);
        expect(label.props('value')).toBe('auth.confirmPassword.password');
        expect(error.exists()).toBe(true);
    });

    it('renders validation errors when present', async () => {
        const wrapper = mount(ConfirmPassword);

        getMockForm().errors = {
            password: 'The password is incorrect.',
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(InputError).props('message')).toBe('The password is incorrect.');
        expect(wrapper.text()).toContain('The password is incorrect.');
    });

    it('renders the submit button', () => {
        const wrapper = mount(ConfirmPassword);
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.confirmPassword.submit');
    });

    it('submits to the password.confirm route and clears the field on finish', async () => {
        const wrapper = mount(ConfirmPassword);

        await wrapper.find('#password').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('password.confirm');
        expect((wrapper.find('#password').element as HTMLInputElement).value).toBe('');
    });
});
