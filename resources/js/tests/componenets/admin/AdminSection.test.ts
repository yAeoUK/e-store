import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminSection from '@/components/admin/AdminSection.vue';

describe('AdminSection', () => {
    it('renders the title as a heading', () => {
        const wrapper = mount(AdminSection, {
            props: { title: 'Product Details' },
        });

        const heading = wrapper.find('h2');
        expect(heading.exists()).toBe(true);
        expect(heading.text()).toBe('Product Details');
    });

    it('renders slot content', () => {
        const wrapper = mount(AdminSection, {
            props: { title: 'Product Details' },
            slots: { default: '<p>Slot content</p>' },
        });

        expect(wrapper.find('p').text()).toBe('Slot content');
    });
});
