import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import PasswordConfirmationFields from '@/components/PasswordConfirmationFields.vue';

function mountFields(
    props: Partial<
        InstanceType<typeof PasswordConfirmationFields>['$props']
    > = {},
) {
    return mount(PasswordConfirmationFields, {
        props: {
            passwordLabel: 'Password',
            confirmLabel: 'Confirm password',
            password: '',
            confirmation: '',
            ...props,
        },
    });
}

describe('PasswordConfirmationFields', () => {
    it('renders a password field and a password_confirmation field', () => {
        const wrapper = mountFields();

        expect(wrapper.find('#password').exists()).toBe(true);
        expect(wrapper.find('#password_confirmation').exists()).toBe(true);
        expect(wrapper.find('#password').attributes('type')).toBe(
            'password',
        );
        expect(
            wrapper.find('#password_confirmation').attributes('type'),
        ).toBe('password');
    });

    it('passes the labels through to each FormField', () => {
        const wrapper = mountFields({
            passwordLabel: 'New password',
            confirmLabel: 'Confirm new password',
        });
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(2);
        expect(fields[0].props('label')).toBe('New password');
        expect(fields[1].props('label')).toBe('Confirm new password');
        expect(fields[0].props('required')).toBe(true);
        expect(fields[1].props('required')).toBe(true);
    });

    it('passes the error props through to each FormField', () => {
        const wrapper = mountFields({
            passwordError: 'The password field is required.',
            confirmError: 'The password confirmation does not match.',
        });
        const fields = wrapper.findAllComponents(FormField);

        expect(fields[0].props('error')).toBe(
            'The password field is required.',
        );
        expect(fields[1].props('error')).toBe(
            'The password confirmation does not match.',
        );
    });

    it('renders the bound password and confirmation values', () => {
        const wrapper = mountFields({
            password: 'secret',
            confirmation: 'secret',
        });

        expect(
            (wrapper.find('#password').element as HTMLInputElement).value,
        ).toBe('secret');
        expect(
            (wrapper.find('#password_confirmation').element as HTMLInputElement)
                .value,
        ).toBe('secret');
    });

    it('emits update:password and update:confirmation when typed into', async () => {
        const wrapper = mountFields();

        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');

        expect(wrapper.emitted('update:password')?.[0]).toEqual(['secret']);
        expect(wrapper.emitted('update:confirmation')?.[0]).toEqual([
            'secret',
        ]);
    });

    it('applies fieldClass to both fields when provided', () => {
        const wrapper = mountFields({ fieldClass: 'mt-4' });

        expect(wrapper.find('#password').classes()).toContain('mt-4');
        expect(wrapper.find('#password_confirmation').classes()).toContain(
            'mt-4',
        );
    });

    it('does not apply a margin class when fieldClass is omitted', () => {
        const wrapper = mountFields();

        expect(wrapper.find('#password').classes()).not.toContain('mt-4');
        expect(
            wrapper.find('#password_confirmation').classes(),
        ).not.toContain('mt-4');
    });

    it('exposes a focus method that focuses the password field', () => {
        const wrapper = mount(PasswordConfirmationFields, {
            props: {
                passwordLabel: 'Password',
                confirmLabel: 'Confirm password',
                password: '',
                confirmation: '',
            },
            attachTo: document.body,
        });

        (wrapper.vm as unknown as { focus: () => void }).focus();

        expect(document.activeElement).toBe(
            wrapper.get('#password').element,
        );
        wrapper.unmount();
    });
});
