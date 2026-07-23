import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TextInput from '@/components/TextInput.vue';

describe('TextInput', () => {
    it('renders the modelValue prop as the input value', () => {
        const wrapper = mount(TextInput, {
            props: { modelValue: 'hello' },
        });

        expect((wrapper.get('input').element as HTMLInputElement).value).toBe('hello');
    });

    it('emits update:modelValue when typed into', async () => {
        const wrapper = mount(TextInput, {
            props: { modelValue: '' },
        });

        await wrapper.get('input').setValue('world');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world']);
    });

    it('autofocuses on mount when the autofocus attribute is present', () => {
        const wrapper = mount(TextInput, {
            props: { modelValue: '' },
            attrs: { autofocus: true },
            attachTo: document.body,
        });

        expect(document.activeElement).toBe(wrapper.get('input').element);
        wrapper.unmount();
    });

    it('does not autofocus when the autofocus attribute is absent', () => {
        const wrapper = mount(TextInput, {
            props: { modelValue: '' },
            attachTo: document.body,
        });

        expect(document.activeElement).not.toBe(wrapper.get('input').element);
        wrapper.unmount();
    });

    it('exposes a focus method that focuses the input', () => {
        const wrapper = mount(TextInput, {
            props: { modelValue: '' },
            attachTo: document.body,
        });

        (wrapper.vm as unknown as { focus: () => void }).focus();

        expect(document.activeElement).toBe(wrapper.get('input').element);
        wrapper.unmount();
    });
});
