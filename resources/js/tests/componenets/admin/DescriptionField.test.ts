import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DescriptionField from '@/components/admin/DescriptionField.vue';
import TextareaField from '@/components/TextareaField.vue';

describe('DescriptionField', () => {
    it('forwards the label to TextareaField', () => {
        const wrapper = mount(DescriptionField, {
            props: { label: 'Description', modelValue: '' },
        });

        expect(wrapper.findComponent(TextareaField).props('label')).toBe(
            'Description',
        );
    });

    it('renders the modelValue as the textarea value', () => {
        const wrapper = mount(DescriptionField, {
            props: { label: 'Description', modelValue: 'Great product.' },
        });

        expect(
            (wrapper.get('textarea').element as HTMLTextAreaElement).value,
        ).toBe('Great product.');
    });

    it('emits update:modelValue when the textarea changes', async () => {
        const wrapper = mount(DescriptionField, {
            props: { label: 'Description', modelValue: '' },
        });

        await wrapper.get('textarea').setValue('Full description.');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
            'Full description.',
        ]);
    });

    it('sets the textarea to 4 rows', () => {
        const wrapper = mount(DescriptionField, {
            props: { label: 'Description', modelValue: '' },
        });

        expect(wrapper.get('textarea').attributes('rows')).toBe('4');
    });
});
