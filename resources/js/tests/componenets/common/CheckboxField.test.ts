import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Checkbox from '@/components/Checkbox.vue';
import CheckboxField from '@/components/CheckboxField.vue';

describe('CheckboxField', () => {
    it('renders the label text', () => {
        const wrapper = mount(CheckboxField, {
            props: { label: 'Active', checked: false },
        });

        expect(wrapper.text()).toContain('Active');
    });

    it('binds the checked prop to the Checkbox', () => {
        const wrapper = mount(CheckboxField, {
            props: { label: 'Active', checked: true },
        });

        expect(wrapper.findComponent(Checkbox).props('checked')).toBe(true);
    });

    it('emits update:checked when toggled', async () => {
        const wrapper = mount(CheckboxField, {
            props: { label: 'Active', checked: false },
        });

        await wrapper.findComponent(Checkbox).get('input').setValue(true);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);
    });
});
