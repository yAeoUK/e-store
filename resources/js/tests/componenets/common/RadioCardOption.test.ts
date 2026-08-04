import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RadioCardOption from '@/components/RadioCardOption.vue';

describe('RadioCardOption', () => {
    it('renders slot content', () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 'cod', value: 'cod' },
            slots: { default: 'Cash on delivery' },
        });

        expect(wrapper.text()).toContain('Cash on delivery');
    });

    it('checks the radio input when modelValue matches value', () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 'cod', value: 'cod' },
        });

        expect(
            (wrapper.find('input').element as HTMLInputElement).checked,
        ).toBe(true);
    });

    it('leaves the radio input unchecked when modelValue does not match value', () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 'stripe', value: 'cod' },
        });

        expect(
            (wrapper.find('input').element as HTMLInputElement).checked,
        ).toBe(false);
    });

    it('emits update:modelValue with its own value when selected', async () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 'cod', value: 'stripe' },
        });

        await wrapper.find('input').setValue();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['stripe']);
    });

    it('supports numeric values', async () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 1, value: 2 },
        });

        await wrapper.find('input').setValue();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    });

    it('centers items and skips the input offset by default', () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 1, value: 1 },
        });

        expect(wrapper.find('label').classes()).toContain('items-center');
        expect(wrapper.find('input').classes()).not.toContain('mt-1');
    });

    it('aligns to the start and offsets the input when align is "start"', () => {
        const wrapper = mount(RadioCardOption, {
            props: { modelValue: 1, value: 1, align: 'start' },
        });

        expect(wrapper.find('label').classes()).toContain('items-start');
        expect(wrapper.find('input').classes()).toContain('mt-1');
    });
});
