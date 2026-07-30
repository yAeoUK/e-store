import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import SlugField from '@/components/admin/SlugField.vue';
import FormField from '@/components/FormField.vue';

const baseProps = {
    categories: [],
    errors: {},
    name: '',
    slug: '',
    parent_id: '' as number | '',
    description: '',
};

function mountFields(props = {}) {
    return mount(CategoryFormFields, {
        props: { ...baseProps, ...props },
    });
}

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

    it('pre-fills each field from its model prop', () => {
        const wrapper = mountFields({
            name: 'Home Appliances',
            slug: 'home-appliances',
            description: 'Everything for the home.',
        });

        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            'Home Appliances',
        );
        expect(wrapper.text()).toContain('home-appliances');
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement).value,
        ).toBe('Everything for the home.');
    });

    it('emits update:name and update:description when edited', async () => {
        const wrapper = mountFields();

        await wrapper.find('input').setValue('Electronics');
        expect(wrapper.emitted('update:name')?.[0]).toEqual(['Electronics']);

        await wrapper.find('textarea').setValue('New description');
        expect(wrapper.emitted('update:description')?.[0]).toEqual([
            'New description',
        ]);
    });

    it('lists the categories prop as parent options and emits update:parent_id when selected', async () => {
        const wrapper = mountFields({
            categories: [
                { id: 1, name: 'Electronics' },
                { id: 2, name: 'Furniture' },
            ],
        });

        expect(wrapper.text()).toContain('Electronics');
        expect(wrapper.text()).toContain('Furniture');

        await wrapper.find('select').setValue(2);
        expect(wrapper.emitted('update:parent_id')?.[0]).toEqual([2]);
    });

    it('passes each error to its matching field', () => {
        const wrapper = mountFields({
            errors: {
                name: 'The name field is required.',
                slug: 'The slug has already been taken.',
            },
        });

        expect(wrapper.findComponent(FormField).props('error')).toBe(
            'The name field is required.',
        );
        expect(wrapper.findComponent(SlugField).props('error')).toBe(
            'The slug has already been taken.',
        );
    });

    it('only passes a slug source when autoSlug is enabled', () => {
        const withoutAutoSlug = mountFields({ name: 'Home Appliances' });
        expect(
            withoutAutoSlug.findComponent(SlugField).props('source'),
        ).toBeUndefined();

        const withAutoSlug = mountFields({
            name: 'Home Appliances',
            autoSlug: true,
        });
        expect(withAutoSlug.findComponent(SlugField).props('source')).toBe(
            'Home Appliances',
        );
    });
});
