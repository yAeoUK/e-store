import { useForm } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VariantFormFields from '@/components/admin/VariantFormFields.vue';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';
import CheckboxField from '@/components/CheckboxField.vue';
import FormField from '@/components/FormField.vue';

function makeForm(overrides = {}) {
    return useForm({
        sku: '',
        options: {} as Record<string, string>,
        price: '' as number | string,
        stock: 0,
        is_active: true,
        ...overrides,
    });
}

function mountFields(props = {}) {
    return mount(VariantFormFields, {
        props: { form: makeForm(), errors: {}, ...props },
    });
}

describe('VariantFormFields', () => {
    it('renders the sku, price, stock, options, and active fields', () => {
        const wrapper = mountFields();

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('label')).toBe('admin.products.sku');
        expect(fields[1].props('label')).toBe('admin.products.variantPrice');
        expect(fields[2].props('label')).toBe('admin.products.stock');
        expect(wrapper.text()).toContain('admin.products.variantPriceHint');
        expect(wrapper.text()).toContain('admin.products.options');
        expect(wrapper.findComponent(VariantOptionsEditor).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent(CheckboxField).props('label')).toBe(
            'admin.products.isActive',
        );
    });

    it('pre-fills each field from the form values', () => {
        const wrapper = mountFields({
            form: makeForm({
                sku: 'SKU-RED-M',
                options: { color: 'Red' },
                price: 24.99,
                stock: 5,
                is_active: false,
            }),
        });

        const inputs = wrapper.findAll(
            'input[type="text"], input[type="number"]',
        );
        expect((inputs[0].element as HTMLInputElement).value).toBe(
            'SKU-RED-M',
        );
        expect((inputs[1].element as HTMLInputElement).value).toBe('24.99');
        expect((inputs[2].element as HTMLInputElement).value).toBe('5');
        expect(
            wrapper.findComponent(VariantOptionsEditor).props('modelValue'),
        ).toEqual({ color: 'Red' });
        expect(wrapper.findComponent(CheckboxField).props('checked')).toBe(
            false,
        );
    });

    it('updates the form fields when inputs change', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        const inputs = wrapper.findAll(
            'input[type="text"], input[type="number"]',
        );
        await inputs[0].setValue('SKU-NEW-1');
        expect(form.sku).toBe('SKU-NEW-1');

        await inputs[1].setValue('19.99');
        expect(form.price).toBe(19.99);

        await inputs[2].setValue('10');
        expect(form.stock).toBe(10);
    });

    it('updates form.options when the options editor changes', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        await wrapper.findComponent(VariantOptionsEditor).vm.$emit(
            'update:modelValue',
            { color: 'Blue' },
        );

        expect(form.options).toEqual({ color: 'Blue' });
    });

    it('updates form.is_active when the checkbox is toggled', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        await wrapper
            .findComponent(CheckboxField)
            .vm.$emit('update:checked', false);

        expect(form.is_active).toBe(false);
    });

    it('passes each error to its matching field', () => {
        const wrapper = mountFields({
            errors: {
                sku: 'The sku field is required.',
                price: 'The price must be a number.',
                stock: 'The stock field is required.',
            },
        });

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('error')).toBe('The sku field is required.');
        expect(fields[1].props('error')).toBe(
            'The price must be a number.',
        );
        expect(fields[2].props('error')).toBe(
            'The stock field is required.',
        );
    });

    it('marks only the sku field as required', () => {
        const wrapper = mountFields();

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('required')).toBe(true);
        expect(fields[1].props('required')).toBeFalsy();
        expect(fields[2].props('required')).toBeFalsy();
    });

    it('remounts the options editor with the reset options when optionsResetKey changes', async () => {
        const form = makeForm({ options: { color: 'Red' } });
        const wrapper = mountFields({ form, optionsResetKey: 1 });
        expect(
            wrapper.findComponent(VariantOptionsEditor).findAll('input')[1]
                .element as HTMLInputElement,
        ).toHaveProperty('value', 'Red');

        form.options = { size: 'M' };
        await wrapper.setProps({ optionsResetKey: 2 });

        const inputs = wrapper.findComponent(VariantOptionsEditor).findAll(
            'input',
        );
        expect((inputs[0].element as HTMLInputElement).value).toBe('size');
        expect((inputs[1].element as HTMLInputElement).value).toBe('M');
    });
});
