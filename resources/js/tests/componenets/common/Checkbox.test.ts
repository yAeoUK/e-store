import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Checkbox from '@/components/Checkbox.vue';

describe('Checkbox', () => {
    it('emits update:checked with true when toggled on in boolean mode', async () => {
        const wrapper = mount(Checkbox, {
            props: { checked: false },
        });

        await wrapper.get('input').setValue(true);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);
    });

    it('emits update:checked with false when toggled off in boolean mode', async () => {
        const wrapper = mount(Checkbox, {
            props: { checked: true },
        });

        await wrapper.get('input').setValue(false);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([false]);
    });

    it('emits the array with the value added when toggled on in array mode', async () => {
        const wrapper = mount(Checkbox, {
            props: { checked: [], value: 'blue' } as Record<string, unknown>,
        });

        await wrapper.get('input').setValue(true);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([['blue']]);
    });

    it('emits the array with the value removed when toggled off in array mode', async () => {
        const wrapper = mount(Checkbox, {
            props: { checked: ['blue'], value: 'blue' } as Record<string, unknown>,
        });

        await wrapper.get('input').setValue(false);

        expect(wrapper.emitted('update:checked')?.[0]).toEqual([[]]);
    });
});
