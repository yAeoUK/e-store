import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ProductImageManager from '@/components/admin/ProductImageManager.vue';
import ProductVariantManager from '@/components/admin/ProductVariantManager.vue';
import FormActions from '@/components/FormActions.vue';
import ProductsEditPage from '@/pages/Admin/Products/Edit.vue';
import { getMockForm, routeMock } from '../../../setup';

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
        expect(getMockForm().short_description).toBe(
            product.short_description,
        );
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

    it('does not auto-sync the slug when the name is edited', async () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        await wrapper.find('input[type="text"]').setValue('Wireless Mouse 2');

        expect(getMockForm().slug).toBe('wireless-mouse');
    });

    it('submits to the product update route', async () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.update',
            product.id,
        );
    });

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

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.products.edit',
        );
    });

    it('renders the field labels and form actions', () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });
        const text = wrapper.text();

        expect(text).toContain('admin.products.edit');
        expect(text).toContain('admin.products.name');
        expect(text).toContain('admin.products.slug');
        expect(text).toContain('admin.products.category');
        expect(text).toContain('admin.products.noCategory');
        expect(text).toContain('admin.products.price');
        expect(text).toContain('admin.products.stock');
        expect(text).toContain('admin.products.shortDescription');
        expect(text).toContain('admin.products.description');
        expect(text).toContain('admin.products.isActive');
        expect(text).toContain('common.cancel');
        expect(text).toContain('admin.products.save');
    });

    it('renders the expected layout and form components', () => {
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories: [] },
        });

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.findComponent(FormActions).exists()).toBe(true);
        expect(
            wrapper.findAllComponents({ name: 'InputLabel' }).length,
        ).toBeGreaterThan(0);
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
    });

    it('wires ProductFormFields with auto-slug disabled and the categories/errors props', () => {
        const categories = [{ id: 2, name: 'Electronics' }];
        const wrapper = mount(ProductsEditPage, {
            props: { product, categories },
        });

        const fields = wrapper.findComponent(ProductFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBeFalsy();
    });
});
