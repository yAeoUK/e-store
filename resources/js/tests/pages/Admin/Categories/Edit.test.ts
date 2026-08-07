import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import CategoriesEditPage from '@/pages/Admin/Categories/Edit.vue';
import { getMockForm } from '../../../setup';
import {
    expectRendersPageTitle,
    testAdminResourceFormLayout,
    testRendersLabels,
    testSlugNotAutoSyncedOnEdit,
    testSubmitsToUpdateRoute,
} from '../../../utils';

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

    testSlugNotAutoSyncedOnEdit(
        () =>
            mount(CategoriesEditPage, { props: { category, categories: [] } }),
        { newName: 'Kitchen', expectedSlug: 'home-appliances' },
    );

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

    testSubmitsToUpdateRoute(
        () =>
            mount(CategoriesEditPage, { props: { category, categories: [] } }),
        'admin.categories.update',
        category.id,
    );

    it('renders the page title via Head', () => {
        const wrapper = mount(CategoriesEditPage, {
            props: { category, categories: [] },
        });

        expectRendersPageTitle(wrapper, 'admin.categories.edit');
    });

    testRendersLabels(
        () =>
            mount(CategoriesEditPage, { props: { category, categories: [] } }),
        [
            'admin.categories.edit',
            'admin.categories.name',
            'admin.categories.slug',
            'admin.categories.parent',
            'admin.categories.description',
            'common.cancel',
            'admin.categories.save',
        ],
        'renders the form labels and actions',
    );

    testAdminResourceFormLayout(() =>
        mount(CategoriesEditPage, { props: { category, categories: [] } }),
    );

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
