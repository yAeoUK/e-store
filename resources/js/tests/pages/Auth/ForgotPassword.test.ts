import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import ForgotPassword from '@/pages/Auth/ForgotPassword.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

describe('ForgotPassword page', () => {
    it('renders the email field only', () => {
        const wrapper = mount(ForgotPassword);

        expect(wrapper.find('#email').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(false);
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(ForgotPassword);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.forgotPassword.title');
    });

    it('renders the description text', () => {
        const wrapper = mount(ForgotPassword);

        expect(wrapper.text()).toContain('auth.forgotPassword.description');
    });

    it('renders the input label and input error for email', () => {
        const wrapper = mount(ForgotPassword);
        const label = wrapper.findComponent(InputLabel);
        const error = wrapper.findComponent(InputError);

        expect(label.exists()).toBe(true);
        expect(label.props('value')).toBe('auth.forgotPassword.email');
        expect(error.exists()).toBe(true);
    });

    it('renders validation errors when present', async () => {
        const wrapper = mount(ForgotPassword);

        getMockForm().errors = {
            email: 'We could not find a user with that email address.',
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(InputError).props('message')).toBe('We could not find a user with that email address.');
        expect(wrapper.text()).toContain('We could not find a user with that email address.');
    });

    it('renders the submit button', () => {
        const wrapper = mount(ForgotPassword);
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.forgotPassword.submit');
    });

    it('shows the status message when provided', () => {
        const wrapper = mount(ForgotPassword, { props: { status: 'Link sent.' } });

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

    it('renders within GuestLayout', () => {
            const wrapper = mount(ForgotPassword);
    
            expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });
});
