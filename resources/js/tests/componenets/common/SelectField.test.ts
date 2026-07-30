import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InputLabel from '@/components/InputLabel.vue';
import SelectField from '@/components/SelectField.vue';

function mountField(props = {}, slots = {}) {
    return mount(SelectField, {
        props: { label: 'Category', modelValue: '', ...props },
        slots: {
            default: '<option value="">None</option><option value="1">A</option>',
            ...slots,
        },
    });
}

describe('SelectField', () => {
    it('renders the label prop via InputLabel', () => {
        const wrapper = mountField();

        expect(wrapper.findComponent(InputLabel).props('value')).toBe(
            'Category',
        );
    });

    it('links the label to the select via a matching for/id pair', () => {
        const wrapper = mountField();

        const forAttr = wrapper.findComponent(InputLabel).attributes('for');

        expect(forAttr).toBeTruthy();
        expect(wrapper.get('select').attributes('id')).toBe(forAttr);
    });

    it('uses an explicit id when provided instead of generating one', () => {
        const wrapper = mountField({ id: 'category' });

        expect(wrapper.get('select').attributes('id')).toBe('category');
        expect(wrapper.findComponent(InputLabel).attributes('for')).toBe(
            'category',
        );
    });

    it('renders the option elements passed via the default slot', () => {
        const wrapper = mountField();

        const options = wrapper.findAll('option');
        expect(options).toHaveLength(2);
        expect(options[1].text()).toBe('A');
    });

    it('renders the modelValue prop as the selected value', () => {
        const wrapper = mountField({ modelValue: '1' });

        expect((wrapper.get('select').element as HTMLSelectElement).value).toBe(
            '1',
        );
    });

    it('emits update:modelValue when a different option is selected', async () => {
        const wrapper = mountField();

        await wrapper.get('select').setValue('1');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1']);
    });

    it('renders the error message when provided', () => {
        const wrapper = mountField({ error: 'This field is required.' });

        expect(wrapper.text()).toContain('This field is required.');
    });

    it('applies labelClass to the label and selectClass to the select', () => {
        const wrapper = mountField({
            labelClass: 'sr-only',
            selectClass: 'w-3/4',
        });

        expect(wrapper.findComponent(InputLabel).classes()).toContain(
            'sr-only',
        );
        expect(wrapper.get('select').classes()).toContain('w-3/4');
    });
});
