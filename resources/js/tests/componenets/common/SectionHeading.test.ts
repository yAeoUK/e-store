import { Pencil } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SectionHeading from '@/components/SectionHeading.vue';

describe('SectionHeading', () => {
    it('renders a plain heading when no icon is provided', () => {
        const wrapper = mount(SectionHeading, {
            props: { heading: 'Add address' },
        });

        expect(wrapper.find('h3').text()).toBe('Add address');
        expect(wrapper.find('h3').classes()).toContain('mb-4');
        expect(wrapper.find('svg').exists()).toBe(false);
    });

    it('renders the icon next to the heading when provided', () => {
        const wrapper = mount(SectionHeading, {
            props: { heading: 'Add address', icon: Pencil },
        });

        expect(wrapper.find('h3').text()).toBe('Add address');
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('defaults the icon color to slate', () => {
        const wrapper = mount(SectionHeading, {
            props: { heading: 'Add address', icon: Pencil },
        });

        expect(wrapper.find('svg').classes()).toContain('text-slate-500');
    });

    it('applies a custom icon color when provided', () => {
        const wrapper = mount(SectionHeading, {
            props: {
                heading: 'Add address',
                icon: Pencil,
                iconClass: 'text-indigo-600 dark:text-indigo-400',
            },
        });

        expect(wrapper.find('svg').classes()).toContain('text-indigo-600');
        expect(wrapper.find('svg').classes()).not.toContain('text-slate-500');
    });

    it('applies a custom spacing class when provided', () => {
        const wrapper = mount(SectionHeading, {
            props: { heading: 'Add address', spacingClass: 'mb-3' },
        });

        expect(wrapper.find('h3').classes()).toContain('mb-3');
        expect(wrapper.find('h3').classes()).not.toContain('mb-4');
    });

    it('renders slot content next to the heading when an icon is provided', () => {
        const wrapper = mount(SectionHeading, {
            props: { heading: 'Add address', icon: Pencil },
            slots: { default: '<span class="badge">Badge</span>' },
        });

        expect(wrapper.find('.badge').text()).toBe('Badge');
    });
});
