import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';

describe('VariantOptionsEditor', () => {
    it('renders one row per existing option', () => {
        const wrapper = mount(VariantOptionsEditor, {
            props: { modelValue: { color: 'Red', size: 'M' } },
        });

        const inputs = wrapper.findAll('input');
        expect(inputs).toHaveLength(4);
        expect((inputs[0].element as HTMLInputElement).value).toBe('color');
        expect((inputs[1].element as HTMLInputElement).value).toBe('Red');
        expect((inputs[2].element as HTMLInputElement).value).toBe('size');
        expect((inputs[3].element as HTMLInputElement).value).toBe('M');
    });

    it('renders no rows when there are no options', () => {
        const wrapper = mount(VariantOptionsEditor, {
            props: { modelValue: {} },
        });

        expect(wrapper.findAll('input')).toHaveLength(0);
    });

    it('adds a new row and emits it once a key and value are entered', async () => {
        const wrapper = mount(VariantOptionsEditor, {
            props: { modelValue: {} },
        });

        await wrapper.find('button').trigger('click');
        const inputs = wrapper.findAll('input');
        expect(inputs).toHaveLength(2);

        await inputs[0].setValue('color');
        await inputs[1].setValue('Blue');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            { color: 'Blue' },
        ]);
    });

    it('removes a row and updates the model', async () => {
        const wrapper = mount(VariantOptionsEditor, {
            props: { modelValue: { color: 'Red', size: 'M' } },
        });

        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            { size: 'M' },
        ]);
        expect(wrapper.findAll('input')).toHaveLength(2);
    });

    it('ignores rows whose key is blank when syncing', async () => {
        const wrapper = mount(VariantOptionsEditor, {
            props: { modelValue: {} },
        });

        await wrapper.find('button').trigger('click');
        const inputs = wrapper.findAll('input');
        await inputs[1].setValue('Blue');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{}]);
    });
});
