import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextLink from '@/components/TextLink.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import Register from '@/pages/Auth/Register.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

describe('Register page', () => {
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
        expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Jane Doe');
        expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com');
        expect((wrapper.find('#password').element as HTMLInputElement).value).toBe('');
        expect((wrapper.find('#password_confirmation').element as HTMLInputElement).value).toBe('');
    });

    it('renders within GuestLayout', () => {
        const wrapper = mount(Register);

        expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(Register);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.register.title');
    });

    it('renders the input label and input error for name, email, password and confirm password', () => {
        const wrapper = mount(Register);
        const labels = wrapper.findAllComponents(InputLabel);
        const errors = wrapper.findAllComponents(InputError);

        expect(labels).toHaveLength(4);
        expect(labels[0].props('value')).toBe('auth.register.name');
        expect(labels[1].props('value')).toBe('auth.register.email');
        expect(labels[2].props('value')).toBe('auth.register.password');
        expect(labels[3].props('value')).toBe('auth.register.confirmPassword');

        expect(errors).toHaveLength(4);
    });

    it('renders validation errors when present', async () => {
        const wrapper = mount(Register);

        getMockForm().errors = {
            name: 'The name field is required.',
            email: 'The email field is required.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        };
        await wrapper.vm.$nextTick();

        const errors = wrapper.findAllComponents(InputError);

        expect(errors[0].props('message')).toBe('The name field is required.');
        expect(errors[1].props('message')).toBe('The email field is required.');
        expect(errors[2].props('message')).toBe('The password field is required.');
        expect(errors[3].props('message')).toBe('The password confirmation does not match.');
        expect(wrapper.text()).toContain('The name field is required.');
    });

    it('the already registered link leads to the sign in screen', () => {
        const wrapper = mount(Register);
        const link = wrapper.findComponent(TextLink);

        expect(link.text()).toBe('auth.register.alreadyRegistered');
        expect(link.props('href')).toBe('login');
    });

    it('renders the submit button', () => {
        const wrapper = mount(Register);
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.register.submit');
    });
});
