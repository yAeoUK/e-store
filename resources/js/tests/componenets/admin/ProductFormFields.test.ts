import { useForm } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import SlugField from '@/components/admin/SlugField.vue';
import Checkbox from '@/components/Checkbox.vue';
import FormField from '@/components/FormField.vue';

function makeForm(overrides = {}) {
    return useForm({
        category_id: '' as number | '',
        name: '',
        slug: '',
        price: '' as number | string,
        stock: 0,
        short_description: '',
        description: '',
        is_active: true,
        ...overrides,
    });
}

const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
];

function mountFields(props = {}) {
    return mount(ProductFormFields, {
        props: { form: makeForm(), categories: [], errors: {}, ...props },
    });
}

describe('ProductFormFields', () => {
    it('renders every field with its label', () => {
        const wrapper = mountFields();
        const text = wrapper.text();

        expect(wrapper.findAllComponents(FormField)[0].props('label')).toBe(
            'admin.products.name',
        );
        expect(wrapper.findComponent(SlugField).props('label')).toBe(
            'admin.products.slug',
        );
        expect(text).toContain('admin.products.category');
        expect(text).toContain('admin.products.noCategory');
        expect(
            wrapper
                .findAllComponents(FormField)
                .map((field) => field.props('label')),
        ).toEqual([
            'admin.products.name',
            'admin.products.price',
            'admin.products.stock',
            'admin.products.shortDescription',
        ]);
        expect(text).toContain('admin.products.description');
        expect(text).toContain('admin.products.isActive');
    });

    it('pre-fills each field from the form values', () => {
        const wrapper = mountFields({
            form: makeForm({
                name: 'Wireless Mouse',
                slug: 'wireless-mouse',
                category_id: 1,
                price: '29.99',
                stock: 10,
                short_description: 'A great mouse.',
                description: 'Full details here.',
                is_active: false,
            }),
        });

        const inputs = wrapper.findAll(
            'input[type="text"], input[type="number"]',
        );
        expect((inputs[0].element as HTMLInputElement).value).toBe(
            'Wireless Mouse',
        );
        expect(wrapper.text()).toContain('wireless-mouse');
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement).value,
        ).toBe('Full details here.');
        expect(wrapper.findComponent(Checkbox).props('checked')).toBe(false);
    });

    it('lists the categories prop as select options', () => {
        const wrapper = mountFields({ categories });

        expect(wrapper.text()).toContain('Electronics');
        expect(wrapper.text()).toContain('Furniture');
    });

    it('updates the form fields when inputs change', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse');
        expect(form.name).toBe('Wireless Mouse');

        await wrapper.findComponent(Checkbox).get('input').setValue(false);
        expect(form.is_active).toBe(false);
    });

    it('passes each error to its matching field', () => {
        const wrapper = mountFields({
            errors: {
                name: 'The name field is required.',
                price: 'The price must be a number.',
                stock: 'The stock field is required.',
            },
        });

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('error')).toBe('The name field is required.');
        expect(fields[1].props('error')).toBe('The price must be a number.');
        expect(fields[2].props('error')).toBe('The stock field is required.');
    });

    it('marks only the name and price fields as required', () => {
        const wrapper = mountFields();

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('required')).toBe(true);
        expect(fields[1].props('required')).toBe(true);
        expect(fields[2].props('required')).toBeFalsy();
        expect(fields[3].props('required')).toBeFalsy();

        const inputs = wrapper.findAll(
            'input[type="text"], input[type="number"]',
        );
        expect((inputs[0].element as HTMLInputElement).required).toBe(true);
        expect((inputs[1].element as HTMLInputElement).required).toBe(true);
        expect((inputs[2].element as HTMLInputElement).required).toBe(false);
        expect(
            (wrapper.find('select').element as HTMLSelectElement).required,
        ).toBe(false);
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement)
                .required,
        ).toBe(false);
    });

    it('only passes a slug source when autoSlug is enabled', () => {
        const withoutAutoSlug = mountFields({
            form: makeForm({ name: 'Wireless Mouse' }),
        });
        expect(
            withoutAutoSlug.findComponent(SlugField).props('source'),
        ).toBeUndefined();

        const withAutoSlug = mountFields({
            form: makeForm({ name: 'Wireless Mouse' }),
            autoSlug: true,
        });
        expect(withAutoSlug.findComponent(SlugField).props('source')).toBe(
            'Wireless Mouse',
        );
    });
});
