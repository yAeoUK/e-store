import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SelectField from '@/components/SelectField.vue';
import { testLabeledFieldContract } from '../../utils';

const options = '<option value="">None</option><option value="1">A</option>';

describe('SelectField', () => {
    testLabeledFieldContract(SelectField, {
        label: 'Category',
        elementSelector: 'select',
        classProp: 'selectClass',
        setValue: '1',
        slots: { default: options },
    });

    it('renders the option elements passed via the default slot', () => {
        const wrapper = mount(SelectField, {
            props: { label: 'Category', modelValue: '' },
            slots: { default: options },
        });

        const rendered = wrapper.findAll('option');
        expect(rendered).toHaveLength(2);
        expect(rendered[1].text()).toBe('A');
    });
});
