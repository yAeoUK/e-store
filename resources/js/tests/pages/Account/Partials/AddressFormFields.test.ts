import { useForm } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import AddressFormFields from '@/pages/Account/Partials/AddressFormFields.vue';

function makeForm(overrides = {}) {
    return useForm({
        label: '',
        name: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        is_default: false,
        ...overrides,
    });
}

function mountFields(props = {}) {
    return mount(AddressFormFields, {
        props: { form: makeForm(), errors: {}, ...props },
    });
}

const fieldsInOrder = [
    {
        key: 'label',
        label: 'account.addresses.label',
        placeholder: 'account.addresses.labelPlaceholder',
        required: false,
    },
    {
        key: 'name',
        label: 'account.addresses.name',
        placeholder: 'account.addresses.namePlaceholder',
        required: false,
    },
    {
        key: 'line1',
        label: 'account.addresses.line1',
        placeholder: 'account.addresses.line1Placeholder',
        required: true,
    },
    {
        key: 'line2',
        label: 'account.addresses.line2',
        placeholder: 'account.addresses.line2Placeholder',
        required: false,
    },
    {
        key: 'city',
        label: 'account.addresses.city',
        placeholder: 'account.addresses.cityPlaceholder',
        required: true,
    },
    {
        key: 'state',
        label: 'account.addresses.state',
        placeholder: 'account.addresses.statePlaceholder',
        required: false,
    },
    {
        key: 'postal_code',
        label: 'account.addresses.postalCode',
        placeholder: 'account.addresses.postalCodePlaceholder',
        required: true,
    },
    {
        key: 'country',
        label: 'account.addresses.country',
        placeholder: 'account.addresses.countryPlaceholder',
        required: true,
    },
    {
        key: 'phone',
        label: 'account.addresses.phone',
        placeholder: 'account.addresses.phonePlaceholder',
        required: false,
    },
];

describe('AddressFormFields', () => {
    it('renders a FormField for every address field with the right label and placeholder', () => {
        const wrapper = mountFields();
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(9);

        fieldsInOrder.forEach((expected, i) => {
            expect(fields[i].props('label')).toBe(expected.label);
            expect(fields[i].get('input').attributes('placeholder')).toBe(
                expected.placeholder,
            );
        });
    });

    it('marks line1, city, postal_code and country as required', () => {
        const wrapper = mountFields();
        const fields = wrapper.findAllComponents(FormField);

        fieldsInOrder.forEach((expected, i) => {
            const requiredAttr = fields[i].get('input').attributes('required');

            if (expected.required) {
                expect(requiredAttr).not.toBeUndefined();
                expect(fields[i].props('required')).toBe(true);
            } else {
                expect(requiredAttr).toBeUndefined();
                expect(fields[i].props('required')).toBeFalsy();
            }
        });
    });

    it('pre-fills each field from the form values', () => {
        const wrapper = mountFields({
            form: makeForm({
                label: 'Home',
                name: 'Jane Doe',
                line1: '123 Main St',
                line2: 'Apt 4',
                city: 'Springfield',
                state: 'IL',
                postal_code: '62704',
                country: 'US',
                phone: '555-0100',
            }),
        });

        const inputs = wrapper.findAll('input');

        expect((inputs[0].element as HTMLInputElement).value).toBe('Home');
        expect((inputs[1].element as HTMLInputElement).value).toBe('Jane Doe');
        expect((inputs[2].element as HTMLInputElement).value).toBe(
            '123 Main St',
        );
        expect((inputs[6].element as HTMLInputElement).value).toBe('62704');
        expect((inputs[8].element as HTMLInputElement).value).toBe(
            '555-0100',
        );
    });

    it('updates the form field when an input changes', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        await wrapper.findAll('input')[2].setValue('456 Oak Ave');

        expect(form.line1).toBe('456 Oak Ave');
    });

    it('passes each error to its matching field', () => {
        const wrapper = mountFields({
            errors: {
                line1: 'The line1 field is required.',
                city: 'The city field is required.',
                postal_code: 'The postal code field is required.',
                phone: 'The phone field must not exceed 64 characters.',
            },
        });

        const fields = wrapper.findAllComponents(FormField);

        expect(fields[2].props('error')).toBe('The line1 field is required.');
        expect(fields[4].props('error')).toBe('The city field is required.');
        expect(fields[6].props('error')).toBe(
            'The postal code field is required.',
        );
        expect(fields[8].props('error')).toBe(
            'The phone field must not exceed 64 characters.',
        );
        expect(fields[0].props('error')).toBeUndefined();
    });

    it('binds the default checkbox to is_default and updates the form when toggled', async () => {
        const form = makeForm({ is_default: false });
        const wrapper = mountFields({ form });
        const checkbox = wrapper.findComponent({ name: 'Checkbox' });

        expect(checkbox.props('checked')).toBe(false);

        await checkbox.get('input').setValue(true);

        expect(form.is_default).toBe(true);
    });

    it('renders the set-default checkbox label text', () => {
        const wrapper = mountFields();

        expect(wrapper.text()).toContain('account.addresses.setDefault');
    });
});
