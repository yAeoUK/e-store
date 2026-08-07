import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ProductImageManager from '@/components/admin/ProductImageManager.vue';
import ProductVariantManager from '@/components/admin/ProductVariantManager.vue';
import ProductsEditPage from '@/pages/Admin/Products/Edit.vue';
import { getMockForm, routeMock } from '../../../setup';
import {
    expectRendersPageTitle,
    testAdminResourceFormLayout,
    testBindsProductMiscFieldsToForm,
    testRendersLabels,
    testSlugNotAutoSyncedOnEdit,
    testSubmitsToUpdateRoute,
} from '../../../utils';

const product = {
    id: 5,
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    price: 19.99,
    stock: 42,
    is_active: true,
    short_description: 'A great mouse.',
    description: 'A very great mouse indeed.',
    category: { id: 2, name: 'Electronics' },
    images: [
        {
            id: 1,
            url: '/images/mouse.png',
            alt_text: null,
            sort_order: 0,
            is_primary: true,
        },
    ],
    variants: [
        {
            id: 1,
            sku: 'WM-001',
            options: { color: 'black' },
            price: null,
            stock: 10,
            is_active: true,
        },
    ],
};

describe('Admin Products edit page', () => {
    it('pre-fills the form from the product prop', () => {
        mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        expect(getMockForm().name).toBe(product.name);
        expect(getMockForm().slug).toBe(product.slug);
        expect(getMockForm().price).toBe(product.price);
        expect(getMockForm().stock).toBe(product.stock);
        expect(getMockForm().category_id).toBe(2);
        expect(getMockForm().short_description).toBe(product.short_description);
        expect(getMockForm().description).toBe(product.description);
        expect(getMockForm().is_active).toBe(true);
    });

    it('defaults category_id to an empty string when the product has no category', () => {
        mount(ProductsEditPage, {
            props: {
                product: { ...product, category: null },
                categories: [],
            },
        });

        expect(getMockForm().category_id).toBe('');
    });

    testSlugNotAutoSyncedOnEdit(
        () => mount(ProductsEditPage, { props: { product, categories: [] } }),
        { newName: 'Wireless Mouse 2', expectedSlug: 'wireless-mouse' },
    );

    testSubmitsToUpdateRoute(
        () => mount(ProductsEditPage, { props: { product, categories: [] } }),
        'admin.products.update',
        product.id,
    );

    it('renders the product image and variant managers with the product data', () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        const imageManager = wrapper.findComponent(ProductImageManager);
        expect(imageManager.props('productId')).toBe(product.id);
        expect(imageManager.props('images')).toEqual(product.images);

        const variantManager = wrapper.findComponent(ProductVariantManager);
        expect(variantManager.props('productId')).toBe(product.id);
        expect(variantManager.props('variants')).toEqual(product.variants);
    });

    it('falls back to empty arrays when images/variants are omitted', () => {
        const wrapper = mount(ProductsEditPage, {
            props: {
                product: { ...product, images: undefined, variants: undefined },
                categories: [],
            },
        });

        expect(
            wrapper.findComponent(ProductImageManager).props('images'),
        ).toEqual([]);
        expect(
            wrapper.findComponent(ProductVariantManager).props('variants'),
        ).toEqual([]);
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        expectRendersPageTitle(wrapper, 'admin.products.edit');
    });

    testRendersLabels(
        () => mount(ProductsEditPage, { props: { product, categories: [] } }),
        [
            'admin.products.edit',
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

    testAdminResourceFormLayout(() =>
        mount(ProductsEditPage, { props: { product, categories: [] } }),
    );

    it('wires ProductFormFields with auto-slug disabled and the categories/errors props', () => {
        const categories = [{ id: 2, name: 'Electronics' }];
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories },
        });

        const fields = wrapper.findComponent(ProductFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBeFalsy();
        expect(fields.props('form').name).toBe(product.name);
        expect(fields.props('form').slug).toBe(product.slug);
        expect(fields.props('form').category_id).toBe(2);
        expect(fields.props('form').price).toBe(product.price);
        expect(fields.props('form').stock).toBe(product.stock);
        expect(fields.props('form').short_description).toBe(
            product.short_description,
        );
        expect(fields.props('form').description).toBe(product.description);
        expect(fields.props('form').is_active).toBe(true);
    });

    testBindsProductMiscFieldsToForm(
        () =>
            mount(ProductsEditPage, {
                props: {
                    product,
                    categories: [
                        { id: 2, name: 'Electronics' },
                        { id: 5, name: 'Toys' },
                    ],
                },
            }),
        { categorySelectValue: 5 },
    );

    it('blocks submission and shows a validation error when name is empty', async () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        await wrapper.find('input[type="text"]').setValue('');
        await wrapper.find('form').trigger('submit');

        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.update',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows a validation error when price is negative', async () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        const priceInput = wrapper.find('input[type="number"]');
        await priceInput.setValue(-5);
        await wrapper.find('form').trigger('submit');

        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.update',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.min');
    });
});
