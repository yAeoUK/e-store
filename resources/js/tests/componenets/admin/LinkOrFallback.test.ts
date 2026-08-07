import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LinkOrFallback from '@/components/admin/LinkOrFallback.vue';

describe('LinkOrFallback', () => {
    it('renders a Link with the given href and slot content when show is true', () => {
        const wrapper = mount(LinkOrFallback, {
            props: { show: true, href: '/admin/products/1', fallback: 'N/A' },
            slots: { default: 'Wireless Mouse' },
        });

        const link = wrapper.findComponent({ name: 'Link' });

        expect(link.props('href')).toBe('/admin/products/1');
        expect(link.text()).toBe('Wireless Mouse');
        expect(wrapper.text()).not.toContain('N/A');
    });

    it('renders the fallback text instead of a Link when show is false', () => {
        const wrapper = mount(LinkOrFallback, {
            props: { show: false, fallback: 'N/A' },
            slots: { default: 'Wireless Mouse' },
        });

        expect(wrapper.findComponent({ name: 'Link' }).exists()).toBe(false);
        expect(wrapper.text()).toBe('N/A');
    });
});
