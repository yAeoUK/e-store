import { MailCheck } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import VerifyEmail from '@/pages/Auth/VerifyEmail.vue';
import { routeMock } from '../../setup';
import { itBehavesLikeGuestAuthPage } from './authAssertions';

describe('VerifyEmail page', () => {
    itBehavesLikeGuestAuthPage({
        mount: () => mount(VerifyEmail),
        titleKey: 'auth.verifyEmail.title',
        icon: MailCheck,
        iconName: 'MailCheck',
        submitKey: 'auth.verifyEmail.resend',
    });

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

    it('renders the description text', () => {
        const wrapper = mount(VerifyEmail);

        expect(wrapper.text()).toContain('auth.verifyEmail.description');
    });
});
