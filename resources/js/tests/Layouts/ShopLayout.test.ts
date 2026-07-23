import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import ShopLayout from '@/Layouts/ShopLayout.vue';

describe('ShopLayout', () => {
    it('renders the default slot content inside main', () => {
        const wrapper = mount(ShopLayout, {
            slots: { default: '<p>Page content</p>' },
        });

        expect(wrapper.get('main').text()).toContain('Page content');
    });

    it('does not render the header wrapper when no header slot is provided', () => {
        const wrapper = mount(ShopLayout, {
            slots: { default: '<p>Page content</p>' },
        });

        expect(wrapper.find('.border-t').exists()).toBe(false);
    });

    it('renders the header slot content when provided', () => {
        const wrapper = mount(ShopLayout, {
            slots: {
                default: '<p>Page content</p>',
                header: '<h2>Section heading</h2>',
            },
        });

        expect(wrapper.text()).toContain('Section heading');
        expect(wrapper.find('.border-t').exists()).toBe(true);
    });

    it('includes the ShopAuthBanner', () => {
        const wrapper = mount(ShopLayout);

        expect(wrapper.findComponent(ShopAuthBanner).exists()).toBe(true);
    });

    it('links the logo to the site root', () => {
        const wrapper = mount(ShopLayout);

        expect(wrapper.findComponent(ApplicationLogo).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'Link' }).props('href')).toBe('/');
    });
});
