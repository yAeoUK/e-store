import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppHeader from '@/components/AppHeader.vue';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';

describe('AppHeader', () => {
    it('links the logo to the given logoHref', () => {
        const wrapper = mount(AppHeader, { props: { logoHref: '/' } });

        expect(wrapper.findComponent(ApplicationLogo).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'Link' }).props('href')).toBe('/');
    });

    it('includes the LanguageSwitcher and ShopAuthBanner', () => {
        const wrapper = mount(AppHeader, { props: { logoHref: '/' } });

        expect(wrapper.findComponent(LanguageSwitcher).exists()).toBe(true);
        expect(wrapper.findComponent(ShopAuthBanner).exists()).toBe(true);
    });

    it('renders the logo-suffix and actions slots', () => {
        const wrapper = mount(AppHeader, {
            props: { logoHref: '/' },
            slots: {
                'logo-suffix': '<span>Admin</span>',
                actions: '<a href="/back">Back</a>',
            },
        });

        expect(wrapper.text()).toContain('Admin');
        expect(wrapper.text()).toContain('Back');
    });

    it('does not render the subheader wrapper when no subheader slot is provided', () => {
        const wrapper = mount(AppHeader, { props: { logoHref: '/' } });

        expect(wrapper.find('.border-t').exists()).toBe(false);
    });

    it('renders the subheader slot content when provided', () => {
        const wrapper = mount(AppHeader, {
            props: { logoHref: '/' },
            slots: { subheader: '<h2>Section heading</h2>' },
        });

        expect(wrapper.text()).toContain('Section heading');
        expect(wrapper.find('.border-t').exists()).toBe(true);
    });
});
