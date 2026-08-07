import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import CategoriesCreatePage from '@/pages/Admin/Categories/Create.vue';
import { getMockForm, routeMock } from '../../../setup';
import {
    expectRendersPageTitle,
    testAdminResourceFormLayout,
    testAutoSlugFromNameOnCreate,
    testRendersLabels,
} from '../../../utils';

function mountPage() {
    return mount(CategoriesCreatePage, { props: { categories: [] } });
}

describe('Admin Categories create page', () => {
    testAutoSlugFromNameOnCreate(mountPage, {
        name: 'Home Appliances',
        expectedSlug: 'home-appliances',
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        expectRendersPageTitle(wrapper, 'admin.categories.create');
    });

    testRendersLabels(
        mountPage,
        [
            'admin.categories.create',
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
        mount(CategoriesCreatePage, { props: { categories: [] } }),
    );

    it('wires CategoryFormFields with auto-slug enabled and the categories/errors props', () => {
        const categories = [{ id: 1, name: 'Electronics' }];
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories },
        });

        const fields = wrapper.findComponent(CategoryFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBe(true);
        expect(fields.props('form').name).toBe('');
        expect(fields.props('form').slug).toBe('');
        expect(fields.props('form').parent_id).toBe('');
        expect(fields.props('form').description).toBe('');
    });

    it('binds the parent_id and description fields to the form', async () => {
        const categories = [{ id: 1, name: 'Electronics' }];
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories },
        });

        await wrapper.find('select').setValue(1);
        await wrapper.find('textarea').setValue('Appliances for the home.');

        expect(getMockForm().parent_id).toBe(1);
        expect(getMockForm().description).toBe('Appliances for the home.');
    });

    it('blocks submit and renders the required message when the name is empty', async () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('submits the form when the required name field is filled in', async () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        await wrapper.find('input[type="text"]').setValue('Home Appliances');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.categories.store');
        expect(getMockForm().lastPostUrl).toBeDefined();
        expect(wrapper.text()).not.toContain('validation.required');
    });
});
