import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InputLabel from '@/components/InputLabel.vue';
import TextareaField from '@/components/TextareaField.vue';

describe('TextareaField', () => {
    it('renders the label prop via InputLabel', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '' },
        });

        expect(wrapper.findComponent(InputLabel).props('value')).toBe(
            'Description',
        );
    });

    it('links the label to the textarea via a matching for/id pair', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '' },
        });

        const forAttr = wrapper.findComponent(InputLabel).attributes('for');

        expect(forAttr).toBeTruthy();
        expect(wrapper.get('textarea').attributes('id')).toBe(forAttr);
    });

    it('uses an explicit id when provided instead of generating one', () => {
        const wrapper = mount(TextareaField, {
            props: { id: 'description', label: 'Description', modelValue: '' },
        });

        expect(wrapper.get('textarea').attributes('id')).toBe('description');
        expect(wrapper.findComponent(InputLabel).attributes('for')).toBe(
            'description',
        );
    });

    it('renders the modelValue prop as the textarea value', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: 'hello' },
        });

        expect(
            (wrapper.get('textarea').element as HTMLTextAreaElement).value,
        ).toBe('hello');
    });

    it('emits update:modelValue when typed into', async () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '' },
        });

        await wrapper.get('textarea').setValue('world');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world']);
    });

    it('forwards arbitrary attributes like rows to the textarea', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '' },
            attrs: { rows: 6 },
        });

        expect(wrapper.get('textarea').attributes('rows')).toBe('6');
    });

    it('renders the error message when provided', () => {
        const wrapper = mount(TextareaField, {
            props: {
                label: 'Description',
                modelValue: '',
                error: 'This field is required.',
            },
        });

        expect(wrapper.text()).toContain('This field is required.');
    });

    it('shows an asterisk on the label when required is true', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '', required: true },
        });

        expect(wrapper.findComponent(InputLabel).text()).toBe('Description*');
    });

    it('does not show an asterisk on the label when required is omitted', () => {
        const wrapper = mount(TextareaField, {
            props: { label: 'Description', modelValue: '' },
        });

        expect(wrapper.findComponent(InputLabel).text()).toBe('Description');
    });

    it('applies labelClass to the label and textareaClass to the textarea', () => {
        const wrapper = mount(TextareaField, {
            props: {
                label: 'Description',
                modelValue: '',
                labelClass: 'sr-only',
                textareaClass: 'w-3/4',
            },
        });

        expect(wrapper.findComponent(InputLabel).classes()).toContain(
            'sr-only',
        );
        expect(wrapper.get('textarea').classes()).toContain('w-3/4');
    });
});
