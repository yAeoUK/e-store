import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import { testLabeledFieldContract } from '../../utils';

describe('FormField', () => {
    testLabeledFieldContract(FormField, {
        label: 'Email',
        elementSelector: 'input',
        classProp: 'inputClass',
        setValue: 'world',
        forwardedAttrs: { type: 'email', placeholder: 'you@example.com' },
    });

    it('generates distinct ids for two instances rendered at once', () => {
        const wrapper = mount({
            components: { FormField },
            template: `
                <FormField label="First" model-value="" />
                <FormField label="Second" model-value="" />
            `,
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'));
    });

    it('emits update:modelValue as a number for number inputs', async () => {
        const wrapper = mount(FormField, {
            props: { label: 'Price', modelValue: '' },
            attrs: { type: 'number' },
        });

        await wrapper.get('input').setValue('42');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });

    it('autofocuses on mount when the autofocus attribute is present', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
            attrs: { autofocus: true },
            attachTo: document.body,
        });

        expect(document.activeElement).toBe(wrapper.get('input').element);
        wrapper.unmount();
    });

    it('does not autofocus when the autofocus attribute is absent', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
            attachTo: document.body,
        });

        expect(document.activeElement).not.toBe(wrapper.get('input').element);
        wrapper.unmount();
    });

    it('exposes a focus method that focuses the input', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
            attachTo: document.body,
        });

        (wrapper.vm as unknown as { focus: () => void }).focus();

        expect(document.activeElement).toBe(wrapper.get('input').element);
        wrapper.unmount();
    });

    it('renders no visible error text when none is provided', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
        });

        expect(wrapper.text()).not.toContain('undefined');
    });
});
