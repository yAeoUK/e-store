import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, markRaw } from 'vue';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import Card from '@/components/Card.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { routeMock } from '../setup';

const StubIcon = markRaw({ name: 'StubIcon', render: () => h('svg') });

describe('GuestLayout', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(GuestLayout, {
            slots: { default: '<p>Form content</p>' },
        });

        expect(wrapper.text()).toContain('Form content');
    });

    it('resolves both links via the home route', () => {
        routeMock.mockClear();

        const wrapper = mount(GuestLayout);
        const links = wrapper.findAllComponents({ name: 'Link' });

        expect(links).toHaveLength(2);
        expect(links[0].props('href')).toBe('home');
        expect(links[1].props('href')).toBe('home');
        expect(routeMock).toHaveBeenCalledWith('home');
    });

    it('renders the back-to-shop text', () => {
        const wrapper = mount(GuestLayout);

        expect(wrapper.text()).toContain('common.backToShop');
    });

    it('renders the ApplicationLogo', () => {
        const wrapper = mount(GuestLayout);

        expect(wrapper.findComponent(ApplicationLogo).exists()).toBe(true);
    });

    it('includes the LanguageSwitcher', () => {
        const wrapper = mount(GuestLayout);

        expect(wrapper.findComponent(LanguageSwitcher).exists()).toBe(true);
    });

    it('renders the Card', () => {
        const wrapper = mount(GuestLayout);

        expect(wrapper.findComponent(Card).exists()).toBe(true);
    });

    it('does not render a heading or icon when none is provided', () => {
        const wrapper = mount(GuestLayout);

        expect(wrapper.find('h1').exists()).toBe(false);
        expect(wrapper.findComponent(StubIcon).exists()).toBe(false);
    });

    it('renders the heading and icon when both are provided', () => {
        const wrapper = mount(GuestLayout, {
            props: { heading: 'Log in', icon: StubIcon },
        });

        expect(wrapper.find('h1').text()).toBe('Log in');
        expect(wrapper.findComponent(StubIcon).exists()).toBe(true);
    });

    it('renders the heading without an icon box when no icon is provided', () => {
        const wrapper = mount(GuestLayout, {
            props: { heading: 'Log in' },
        });

        expect(wrapper.find('h1').text()).toBe('Log in');
        expect(wrapper.findComponent(StubIcon).exists()).toBe(false);
    });
});
