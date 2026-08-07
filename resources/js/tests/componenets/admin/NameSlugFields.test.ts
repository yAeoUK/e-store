import { describe, expect, it } from 'vitest';
import NameSlugFields from '@/components/admin/NameSlugFields.vue';
import SlugField from '@/components/admin/SlugField.vue';
import FormField from '@/components/FormField.vue';
import {
    createFieldsHarness,
    testAutoSlugSourceProp,
    testErrorsAssignedToFormFields,
} from '../../utils';

const { makeForm, mountFields } = createFieldsHarness(
    NameSlugFields,
    { name: '', slug: '' },
    { nameLabel: 'Name', slugLabel: 'Slug' },
);

describe('NameSlugFields', () => {
    it('renders the name and slug fields with the given labels', () => {
        const wrapper = mountFields();

        expect(wrapper.findComponent(FormField).props('label')).toBe('Name');
        expect(wrapper.findComponent(SlugField).props('label')).toBe('Slug');
    });

    it('pre-fills each field from the form values', () => {
        const wrapper = mountFields({
            form: makeForm({ name: 'Wireless Mouse', slug: 'wireless-mouse' }),
        });

        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            'Wireless Mouse',
        );
        expect(wrapper.text()).toContain('wireless-mouse');
    });

    it('updates form.name when the name input changes', async () => {
        const form = makeForm();
        const wrapper = mountFields({ form });

        await wrapper.find('input').setValue('Wireless Mouse');

        expect(form.name).toBe('Wireless Mouse');
    });

    testErrorsAssignedToFormFields(mountFields, {
        name: 'The name field is required.',
        slug: 'The slug has already been taken.',
    });

    it('always marks the name field as required', () => {
        const wrapper = mountFields();

        expect(wrapper.findComponent(FormField).props('required')).toBe(true);
    });

    testAutoSlugSourceProp(mountFields, makeForm, 'Wireless Mouse');
});
