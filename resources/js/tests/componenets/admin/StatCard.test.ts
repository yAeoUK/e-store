import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StatCard from '@/components/admin/StatCard.vue';

describe('StatCard', () => {
    it('renders as a plain div when no href is given', () => {
        const wrapper = mount(StatCard, {
            props: { label: 'Total Products', value: 42 },
        });

        expect(wrapper.findComponent(Link).exists()).toBe(false);
        expect(wrapper.text()).toContain('Total Products');
        expect(wrapper.text()).toContain('42');
    });

    it('renders as a Link when href is given', () => {
        const wrapper = mount(StatCard, {
            props: {
                label: 'Total Products',
                value: 42,
                href: 'admin.products.index',
            },
        });

        const link = wrapper.findComponent(Link);
        expect(link.exists()).toBe(true);
        expect(link.props('href')).toBe('admin.products.index');
    });
});
