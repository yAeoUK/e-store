import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import IsActiveField from '@/components/admin/IsActiveField.vue';
import CheckboxField from '@/components/CheckboxField.vue';

describe('IsActiveField', () => {
    it('renders the translated isActive label', () => {
        const wrapper = mount(IsActiveField, { props: { checked: false } });

        expect(wrapper.text()).toContain('admin.products.isActive');
    });

    it('binds the checked prop to CheckboxField', () => {
        const wrapper = mount(IsActiveField, { props: { checked: true } });

        expect(wrapper.findComponent(CheckboxField).props('checked')).toBe(
            true,
        );
    });

    it('emits update:checked when toggled', async () => {
        const wrapper = mount(IsActiveField, { props: { checked: false } });

        await wrapper.get('input[type="checkbox"]').setValue(true);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);
    });

    it('defaults checked to false when omitted', () => {
        const wrapper = mount(IsActiveField);

        expect(wrapper.findComponent(CheckboxField).props('checked')).toBe(
            false,
        );
    });
});
