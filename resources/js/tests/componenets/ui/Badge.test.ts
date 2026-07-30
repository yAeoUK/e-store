import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
    it('renders its slot content with the default variant classes', () => {
        const wrapper = mount(Badge, {
            slots: { default: 'New' },
        });

        expect(wrapper.text()).toBe('New');
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(['bg-indigo-600', 'text-white']),
        );
        expect(wrapper.attributes('data-slot')).toBe('badge');
    });

    it.each([
        ['secondary', 'bg-slate-100'],
        ['destructive', 'bg-red-600'],
        ['outline', 'border-slate-300'],
    ] as const)('applies the %s variant classes', (variant, expectedClass) => {
        const wrapper = mount(Badge, {
            props: { variant },
            slots: { default: 'Status' },
        });

        expect(wrapper.classes()).toContain(expectedClass);
    });

    it('merges a custom class with the variant classes', () => {
        const wrapper = mount(Badge, {
            props: { class: 'my-custom-class' },
            slots: { default: 'Status' },
        });

        expect(wrapper.classes()).toContain('my-custom-class');
        expect(wrapper.classes()).toContain('bg-indigo-600');
    });
});
