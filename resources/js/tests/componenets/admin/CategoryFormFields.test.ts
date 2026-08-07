import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import SlugField from '@/components/admin/SlugField.vue';
import FormField from '@/components/FormField.vue';
import {
    adminCategoryRefs,
    createFieldsHarness,
    testAutoSlugSourceProp,
    testErrorsAssignedToFormFields,
} from '../../utils';

const { makeForm, mountFields } = createFieldsHarness(
    CategoryFormFields,
    {
        parent_id: '' as number | '',
        name: '',
        slug: '',
        description: '',
    },
    { categories: [] },
);

describe('CategoryFormFields', () => {
    it('renders the name field, slug field, parent select and description', () => {
        const wrapper = mountFields();

        expect(wrapper.findComponent(FormField).props('label')).toBe(
            'admin.categories.name',
        );
        expect(wrapper.findComponent(SlugField).props('label')).toBe(
            'admin.categories.slug',
        );
        expect(wrapper.find('select').exists()).toBe(true);
        expect(wrapper.text()).toContain('admin.categories.parent');
        expect(wrapper.text()).toContain('admin.categories.none');
        expect(wrapper.find('textarea').exists()).toBe(true);
        expect(wrapper.text()).toContain('admin.categories.description');
    });

    it('pre-fills each field from the form values', () => {
        const wrapper = mountFields({
            form: makeForm({
                name: 'Home Appliances',
                slug: 'home-appliances',
                parent_id: 1,
                description: 'Everything for the home.',
            }),
        });

        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            'Home Appliances',
        );
        expect(wrapper.text()).toContain('home-appliances');
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement).value,
        ).toBe('Everything for the home.');
    });

    it('updates the form fields when inputs change', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        await wrapper.find('input').setValue('Electronics');
        expect(form.name).toBe('Electronics');

        await wrapper.find('textarea').setValue('New description');
        expect(form.description).toBe('New description');
    });

    it('lists the categories prop as parent options and updates form.parent_id when selected', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form, categories: adminCategoryRefs });

        expect(wrapper.text()).toContain('Electronics');
        expect(wrapper.text()).toContain('Furniture');

        await wrapper.find('select').setValue(2);
        expect(form.parent_id).toBe(2);
    });

    testErrorsAssignedToFormFields(mountFields, {
        name: 'The name field is required.',
        slug: 'The slug has already been taken.',
    });

    it('marks only the name field as required', () => {
        const wrapper = mountFields();

        expect(wrapper.findComponent(FormField).props('required')).toBe(true);
        expect(
            (wrapper.find('input').element as HTMLInputElement).required,
        ).toBe(true);
        expect(
            (wrapper.find('select').element as HTMLSelectElement).required,
        ).toBe(false);
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement).required,
        ).toBe(false);
    });

    testAutoSlugSourceProp(mountFields, makeForm, 'Home Appliances');
});
