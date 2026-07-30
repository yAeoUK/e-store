import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import VerifyEmail from '@/pages/Auth/VerifyEmail.vue';
import { getMockForm, routeMock } from '../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

describe('VerifyEmail page', () => {
    it('does not show the sent message for other status values', () => {
        const wrapper = mount(VerifyEmail, {
            props: { status: 'something-else' },
        });

        expect(wrapper.findComponent(SuccessText).exists()).toBe(false);
    });

    it('shows the sent message when status is verification-link-sent', () => {
        const wrapper = mount(VerifyEmail, {
            props: { status: 'verification-link-sent' },
        });

        expect(wrapper.findComponent(SuccessText).exists()).toBe(true);
        expect(wrapper.text()).toContain('auth.verifyEmail.linkSent');
    });

    it('submits to the verification.send route', async () => {
        const wrapper = mount(VerifyEmail);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('verification.send');
    });

    it('resolves the log out link via the logout route', () => {
        const wrapper = mount(VerifyEmail);

        const logoutLink = wrapper.findComponent(TextLink);

        expect(logoutLink.props('href')).toBe('logout');
        expect(logoutLink.text()).toBe('auth.verifyEmail.logOut');
    });

    it('renders within GuestLayout', () => {
        const wrapper = mount(VerifyEmail);

        expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(VerifyEmail);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('auth.verifyEmail.title');
    });

    it('renders the description text', () => {
        const wrapper = mount(VerifyEmail);

        expect(wrapper.text()).toContain('auth.verifyEmail.description');
    });

    it('renders the submit button', () => {
        const wrapper = mount(VerifyEmail);
        const button = wrapper.findComponent(PrimaryButton);

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('auth.verifyEmail.resend');
    });

    it('disables the submit button while the form is processing', async () => {
        const wrapper = mount(VerifyEmail);

        getMockForm().processing = true;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });
});
