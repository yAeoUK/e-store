import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StockField from '@/components/admin/StockField.vue';
import FormField from '@/components/FormField.vue';

describe('StockField', () => {
    it('forwards label and error to FormField as a number input', () => {
        const wrapper = mount(StockField, {
            props: {
                label: 'Stock',
                modelValue: 0,
                error: 'The stock field is required.',
            },
        });

        const field = wrapper.findComponent(FormField);

        expect(field.props('label')).toBe('Stock');
        expect(field.props('error')).toBe('The stock field is required.');
        expect(wrapper.get('input').attributes('type')).toBe('number');
        expect(wrapper.get('input').attributes('min')).toBe('0');
    });

    it('renders the modelValue as the input value', () => {
        const wrapper = mount(StockField, {
            props: { label: 'Stock', modelValue: 15 },
        });

        expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
            '15',
        );
    });

    it('defaults the modelValue to 0', () => {
        const wrapper = mount(StockField, {
            props: { label: 'Stock' },
        });

        expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
            '0',
        );
    });

    it('emits update:modelValue as a number when changed', async () => {
        const wrapper = mount(StockField, {
            props: { label: 'Stock', modelValue: 0 },
        });

        await wrapper.get('input').setValue('42');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });
});
