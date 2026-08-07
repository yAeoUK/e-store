import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ProductsCreatePage from '@/pages/Admin/Products/Create.vue';
import { getMockForm, routeMock } from '../../../setup';
import {
    expectRendersPageTitle,
    testAdminResourceFormLayout,
    testAutoSlugFromNameOnCreate,
    testBindsProductMiscFieldsToForm,
    testRendersLabels,
} from '../../../utils';

function mountPage() {
    return mount(ProductsCreatePage, { props: { categories: [] } });
}

describe('Admin Products create page', () => {
    testAutoSlugFromNameOnCreate(mountPage, {
        name: 'Wireless Mouse Pro',
        expectedSlug: 'wireless-mouse-pro',
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        expectRendersPageTitle(wrapper, 'admin.products.create');
    });

    testRendersLabels(
        mountPage,
        [
            'admin.products.create',
            'admin.products.name',
            'admin.products.slug',
            'admin.products.category',
            'admin.products.noCategory',
            'admin.products.price',
            'admin.products.stock',
            'admin.products.shortDescription',
            'admin.products.description',
            'admin.products.isActive',
            'common.cancel',
            'admin.products.save',
        ],
        'renders the field labels and form actions',
    );

    it('lists the categories prop as select options', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: {
                categories: [
                    { id: 1, name: 'Electronics' },
                    { id: 2, name: 'Furniture' },
                ],
            },
        });

        expect(wrapper.text()).toContain('Electronics');
        expect(wrapper.text()).toContain('Furniture');
    });

    testAdminResourceFormLayout(() =>
        mount(ProductsCreatePage, { props: { categories: [] } }),
    );

    it('wires ProductFormFields with auto-slug enabled and the categories/errors props', () => {
        const categories = [{ id: 1, name: 'Electronics' }];
        const wrapper = mount(ProductsCreatePage, {
            props: { categories },
        });

        const fields = wrapper.findComponent(ProductFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBe(true);
        expect(fields.props('form').name).toBe('');
        expect(fields.props('form').slug).toBe('');
        expect(fields.props('form').category_id).toBe('');
        expect(fields.props('form').price).toBe('');
        expect(fields.props('form').stock).toBe(0);
        expect(fields.props('form').short_description).toBe('');
        expect(fields.props('form').description).toBe('');
        expect(fields.props('form').is_active).toBe(true);
    });

    testBindsProductMiscFieldsToForm(
        () =>
            mount(ProductsCreatePage, {
                props: { categories: [{ id: 3, name: 'Electronics' }] },
            }),
        { categorySelectValue: 3 },
    );

    it('blocks submission and shows a validation error when name is empty', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.store',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows a validation error when price is negative', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');
        const priceInput = wrapper.find('input[type="number"]');
        await priceInput.setValue(-5);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.store',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.min');
    });

    it('submits the form when the required name and price fields are filled in', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');
        const priceInput = wrapper.find('input[type="number"]');
        await priceInput.setValue(29.99);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.products.store');
        expect(getMockForm().lastPostUrl).toBeDefined();
        expect(wrapper.text()).not.toContain('validation.required');
    });
});
