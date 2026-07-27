import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
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

    it('renders a FormField for name, email, password and confirm password with the right labels', () => {
        const wrapper = mount(Register);
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(4);
        expect(fields[0].props('label')).toBe('auth.register.name');
        expect(fields[1].props('label')).toBe('auth.register.email');
        expect(fields[2].props('label')).toBe('auth.register.password');
        expect(fields[3].props('label')).toBe('auth.register.confirmPassword');
    });

    it('passes validation errors through to each field', async () => {
        const wrapper = mount(Register);

        getMockForm().errors = {
            name: 'The name field is required.',
            email: 'The email field is required.',
            password: 'The password field is required.',
            password_confirmation: 'The password confirmation does not match.',
        };
        await wrapper.vm.$nextTick();

        const fields = wrapper.findAllComponents(FormField);

        expect(fields[0].props('error')).toBe('The name field is required.');
        expect(fields[1].props('error')).toBe('The email field is required.');
        expect(fields[2].props('error')).toBe(
            'The password field is required.',
        );
        expect(fields[3].props('error')).toBe(
            'The password confirmation does not match.',
        );
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

    it('disables the submit button while the form is processing', async () => {
        const wrapper = mount(Register);

        getMockForm().processing = true;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });
});
