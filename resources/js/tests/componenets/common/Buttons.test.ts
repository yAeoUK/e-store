import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ButtonLink from '@/components/ButtonLink.vue';
import DangerButton from '@/components/DangerButton.vue';
import DropdownLink from '@/components/DropdownLink.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextLink from '@/components/TextLink.vue';

describe('PrimaryButton', () => {
    it('renders slot content and forwards disabled', () => {
        const wrapper = mount(PrimaryButton, {
            attrs: { disabled: true },
            slots: { default: 'Save' },
        });

        expect(wrapper.text()).toBe('Save');
        expect(wrapper.attributes('disabled')).not.toBeUndefined();
    });
});

describe('SecondaryButton', () => {
    it('renders slot content and defaults to type=button', () => {
        const wrapper = mount(SecondaryButton, {
            slots: { default: 'Cancel' },
        });

        expect(wrapper.text()).toBe('Cancel');
        expect(wrapper.attributes('type')).toBe('button');
    });

    it('applies the given type when passed', () => {
        const wrapper = mount(SecondaryButton, {
            props: { type: 'submit' },
            slots: { default: 'Save draft' },
        });

        expect(wrapper.attributes('type')).toBe('submit');
    });
});

describe('DangerButton', () => {
    it('renders slot content and forwards disabled', () => {
        const wrapper = mount(DangerButton, {
            attrs: { disabled: true },
            slots: { default: 'Delete' },
        });

        expect(wrapper.text()).toBe('Delete');
        expect(wrapper.attributes('disabled')).not.toBeUndefined();
    });
});

describe('ButtonLink', () => {
    it('renders a Link with the given href and defaults to the secondary variant', () => {
        const wrapper = mount(ButtonLink, {
            props: { href: '/login' },
            slots: { default: 'Log in' },
        });

        const link = wrapper.findComponent({ name: 'Link' });

        expect(link.props('href')).toBe('/login');
        expect(wrapper.text()).toBe('Log in');
        expect(wrapper.classes().join(' ')).toContain('border-slate-300');
    });

    it('applies the primary variant class when requested', () => {
        const wrapper = mount(ButtonLink, {
            props: { href: '/register', variant: 'primary' },
            slots: { default: 'Register' },
        });

        expect(wrapper.classes().join(' ')).toContain('bg-indigo-600');
    });
});

describe('DropdownLink', () => {
    it('renders a Link with the given href and slot content', () => {
        const wrapper = mount(DropdownLink, {
            props: { href: '/profile' },
            slots: { default: 'Profile' },
        });

        const link = wrapper.findComponent({ name: 'Link' });

        expect(link.props('href')).toBe('/profile');
        expect(wrapper.text()).toBe('Profile');
        expect(wrapper.classes()).toContain('block');
    });

    it('defaults method to null and as to a', () => {
        const wrapper = mount(DropdownLink, {
            props: { href: '/profile' },
            slots: { default: 'Profile' },
        });

        expect(wrapper.attributes('method')).toBeUndefined();
        expect(wrapper.attributes('as')).toBe('a');
    });

    it('forwards a non-default method and as to the Link', () => {
        const wrapper = mount(DropdownLink, {
            props: { href: '/logout', method: 'post', as: 'button' },
            slots: { default: 'Log out' },
        });

        expect(wrapper.attributes('method')).toBe('post');
        expect(wrapper.attributes('as')).toBe('button');
    });
});

describe('TextLink', () => {
    it('renders a Link with the given href and defaults to the muted variant', () => {
        const wrapper = mount(TextLink, {
            props: { href: '/forgot-password' },
            slots: { default: 'Forgot your password?' },
        });

        const link = wrapper.findComponent({ name: 'Link' });

        expect(link.props('href')).toBe('/forgot-password');
        expect(wrapper.text()).toBe('Forgot your password?');
        expect(wrapper.classes().join(' ')).toContain('text-gray-600');
    });

    it('applies the slate variant class when requested', () => {
        const wrapper = mount(TextLink, {
            props: { href: '/', variant: 'slate' },
            slots: { default: 'Home' },
        });

        expect(wrapper.classes().join(' ')).toContain('text-slate-600');
    });

    it('defaults method to null and as to a', () => {
        const wrapper = mount(TextLink, {
            props: { href: '/' },
            slots: { default: 'Home' },
        });

        expect(wrapper.attributes('method')).toBeUndefined();
        expect(wrapper.attributes('as')).toBe('a');
    });

    it('forwards a non-default method and as to the Link', () => {
        const wrapper = mount(TextLink, {
            props: { href: '/logout', method: 'post', as: 'button' },
            slots: { default: 'Log out' },
        });

        expect(wrapper.attributes('method')).toBe('post');
        expect(wrapper.attributes('as')).toBe('button');
    });
});
