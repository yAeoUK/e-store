import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PriceField from '@/components/admin/PriceField.vue';
import FormField from '@/components/FormField.vue';

describe('PriceField', () => {
    it('forwards label, error and required to FormField as a number input', () => {
        const wrapper = mount(PriceField, {
            props: {
                label: 'Price',
                modelValue: '',
                error: 'The price field is required.',
                required: true,
            },
        });

        const field = wrapper.findComponent(FormField);

        expect(field.props('label')).toBe('Price');
        expect(field.props('error')).toBe('The price field is required.');
        expect(field.props('required')).toBe(true);
        expect(wrapper.get('input').attributes('type')).toBe('number');
        expect(wrapper.get('input').attributes('min')).toBe('0');
        expect(wrapper.get('input').attributes('step')).toBe('0.01');
    });

    it('renders the modelValue as the input value', () => {
        const wrapper = mount(PriceField, {
            props: { label: 'Price', modelValue: 19.99 },
        });

        expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
            '19.99',
        );
    });

    it('emits update:modelValue as a number when changed', async () => {
        const wrapper = mount(PriceField, {
            props: { label: 'Price', modelValue: '' },
        });

        await wrapper.get('input').setValue('42.5');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42.5]);
    });

    it('renders the hint when provided', () => {
        const wrapper = mount(PriceField, {
            props: {
                label: 'Price',
                modelValue: '',
                hint: 'Excludes tax.',
            },
        });

        expect(wrapper.text()).toContain('Excludes tax.');
    });

    it('does not render a hint when omitted', () => {
        const wrapper = mount(PriceField, {
            props: { label: 'Price', modelValue: '' },
        });

        expect(wrapper.text()).not.toContain('undefined');
        expect(wrapper.find('.mt-1.text-xs').exists()).toBe(false);
    });
});
