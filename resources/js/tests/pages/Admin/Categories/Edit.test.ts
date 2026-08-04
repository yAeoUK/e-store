import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import FormActions from '@/components/FormActions.vue';
import CategoriesEditPage from '@/pages/Admin/Categories/Edit.vue';
import { getMockForm, routeMock } from '../../../setup';

const category = {
    id: 1,
    name: 'Home Appliances',
    slug: 'home-appliances',
    description: 'Appliances for the home.',
    parent_id: null,
};

describe('Admin Categories edit page', () => {
    it('pre-fills the form from the category prop', () => {
        mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        expect(getMockForm().name).toBe(category.name);
        expect(getMockForm().slug).toBe(category.slug);
        expect(getMockForm().description).toBe(category.description);
        expect(getMockForm().parent_id).toBe('');
    });

    it('renders the existing name, slug and description', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]')
            .element as HTMLInputElement;
        expect(nameInput.value).toBe('Home Appliances');
        expect(wrapper.text()).toContain('home-appliances');
        expect(
            (wrapper.find('textarea').element as HTMLTextAreaElement).value,
        ).toBe('Appliances for the home.');
    });

    it('does not auto-sync the slug when the name is edited', async () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        await wrapper.find('input[type="text"]').setValue('Kitchen');

        expect(getMockForm().slug).toBe('home-appliances');
    });

    it('lists the given categories as parent options', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: {
                category,
                categories: [
                    { id: 2, name: 'Electronics' },
                    { id: 3, name: 'Furniture' },
                ],
            },
        });

        const options = wrapper.findAll('option');
        expect(options.map((option) => option.text())).toEqual([
            'admin.categories.none',
            'Electronics',
            'Furniture',
        ]);
    });

    it('submits to the category update route', async () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.categories.update',
            category.id,
        );
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.categories.edit',
        );
    });

    it('renders the form labels and actions', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });
        const text = wrapper.text();

        expect(text).toContain('admin.categories.edit');
        expect(text).toContain('admin.categories.name');
        expect(text).toContain('admin.categories.slug');
        expect(text).toContain('admin.categories.parent');
        expect(text).toContain('admin.categories.description');
        expect(text).toContain('common.cancel');
        expect(text).toContain('admin.categories.save');
    });

    it('renders inside the expected layout and form components', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.findComponent(FormActions).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'InputLabel' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
    });

    it('wires CategoryFormFields with auto-slug disabled and the categories/errors props', () => {
        const categories = [{ id: 2, name: 'Electronics' }];
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories },
        });

        const fields = wrapper.findComponent(CategoryFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBeFalsy();
        expect(fields.props('form').name).toBe(category.name);
        expect(fields.props('form').slug).toBe(category.slug);
        expect(fields.props('form').parent_id).toBe('');
        expect(fields.props('form').description).toBe(category.description);
    });

    it('binds the parent_id and description fields to the form', async () => {
        const categories = [{ id: 2, name: 'Electronics' }];
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories },
        });

        await wrapper.find('select').setValue(2);
        await wrapper.find('textarea').setValue('Updated description.');

        expect(getMockForm().parent_id).toBe(2);
        expect(getMockForm().description).toBe('Updated description.');
    });

    it('blocks submit and renders the required message when the name is empty', async () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        await wrapper.find('input[type="text"]').setValue('');
        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });
});
