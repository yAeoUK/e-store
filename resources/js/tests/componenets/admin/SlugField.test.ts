import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SlugField from '@/components/admin/SlugField.vue';

describe('SlugField', () => {
    it('shows the current value as read-only text with an Edit affordance', () => {
        const wrapper = mount(SlugField, {
            props: { label: 'Slug', modelValue: 'wireless-mouse' },
        });

        expect(wrapper.find('input').exists()).toBe(false);
        expect(wrapper.text()).toContain('wireless-mouse');
        expect(wrapper.find('button').text()).toBe('admin.actions.edit');
    });

    it('auto-generates the slug from the source while not editing', async () => {
        const wrapper = mount(SlugField, {
            props: { label: 'Slug', modelValue: '', source: 'Wireless Mouse' },
        });

        await wrapper.setProps({ source: 'Wireless Mouse Pro' });

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            'wireless-mouse-pro',
        ]);
    });

    it('reveals an editable input when Edit is clicked, and stops auto-syncing', async () => {
        const wrapper = mount(SlugField, {
            props: {
                label: 'Slug',
                modelValue: 'wireless-mouse',
                source: 'Wireless Mouse',
            },
        });

        await wrapper.find('button').trigger('click');

        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);

        await input.setValue('custom-slug');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            'custom-slug',
        ]);

        await wrapper.setProps({ source: 'Something Else Entirely' });

        // No further update:modelValue emitted once editing — the last
        // emission is still the manually-typed value.
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            'custom-slug',
        ]);
    });

    it('shows the error message when provided', () => {
        const wrapper = mount(SlugField, {
            props: {
                label: 'Slug',
                modelValue: '',
                error: 'This slug is already taken.',
            },
        });

        expect(wrapper.text()).toContain('This slug is already taken.');
    });
});
