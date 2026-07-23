import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { routeMock } from '../setup';

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
});
