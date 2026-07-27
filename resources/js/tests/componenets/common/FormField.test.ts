import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import InputLabel from '@/components/InputLabel.vue';

describe('FormField', () => {
    it('renders the label prop via InputLabel', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
        });

        expect(wrapper.findComponent(InputLabel).props('value')).toBe('Email');
    });

    it('links the label to the input via a matching for/id pair', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
        });

        const forAttr = wrapper.findComponent(InputLabel).attributes('for');

        expect(forAttr).toBeTruthy();
        expect(wrapper.get('input').attributes('id')).toBe(forAttr);
    });

    it('uses an explicit id when provided instead of generating one', () => {
        const wrapper = mount(FormField, {
            props: { id: 'email', label: 'Email', modelValue: '' },
        });

        expect(wrapper.get('input').attributes('id')).toBe('email');
        expect(wrapper.findComponent(InputLabel).attributes('for')).toBe(
            'email',
        );
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

    it('renders the modelValue prop as the input value', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: 'hello' },
        });

        expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
            'hello',
        );
    });

    it('emits update:modelValue as a string when typed into', async () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
        });

        await wrapper.get('input').setValue('world');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world']);
    });

    it('emits update:modelValue as a number for number inputs', async () => {
        const wrapper = mount(FormField, {
            props: { label: 'Price', modelValue: '' },
            attrs: { type: 'number' },
        });

        await wrapper.get('input').setValue('42');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });

    it('forwards arbitrary attributes like placeholder and type to the input', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
            attrs: { type: 'email', placeholder: 'you@example.com' },
        });

        expect(wrapper.get('input').attributes('type')).toBe('email');
        expect(wrapper.get('input').attributes('placeholder')).toBe(
            'you@example.com',
        );
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

    it('renders the error message when provided', () => {
        const wrapper = mount(FormField, {
            props: {
                label: 'Email',
                modelValue: '',
                error: 'This field is required.',
            },
        });

        expect(wrapper.text()).toContain('This field is required.');
    });

    it('renders no visible error text when none is provided', () => {
        const wrapper = mount(FormField, {
            props: { label: 'Email', modelValue: '' },
        });

        expect(wrapper.text()).not.toContain('undefined');
    });

    it('applies labelClass to the label and inputClass to the input', () => {
        const wrapper = mount(FormField, {
            props: {
                label: 'Password',
                modelValue: '',
                labelClass: 'sr-only',
                inputClass: 'w-3/4',
            },
        });

        expect(wrapper.findComponent(InputLabel).classes()).toContain(
            'sr-only',
        );
        expect(wrapper.get('input').classes()).toContain('w-3/4');
    });
});
