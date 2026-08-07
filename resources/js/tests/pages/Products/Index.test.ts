import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import ProductsIndexPage from '@/pages/Products/Index.vue';
import {
    defaultCategories,
    defaultFilters,
    defaultProducts,
    expectRendersPageTitle,
} from '../../utils';

function mountProductsIndexPage(props = {}) {
    return shallowMount(ProductsIndexPage, {
        props: {
            products: defaultProducts,
            filters: defaultFilters,
            categories: defaultCategories,
            ...props,
        },
    });
}

describe('Products index page', () => {
    it('renders the page title via Head', () => {
        expectRendersPageTitle(
            mountProductsIndexPage(),
            'shop.products.pageTitle',
        );
    });

    it('renders the product grid through the catalog layout', () => {
        const categories = [
            { id: 1, name: 'Accessories', slug: 'accessories' },
        ];
        const wrapper = mountProductsIndexPage({
            products: { data: [{ id: 1, name: 'Wireless Mouse' }] },
            categories,
        });

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.exists()).toBe(true);
        expect(layout.props('heading')).toBe('shop.products.heading');
        expect(layout.props('description')).toBe('shop.products.description');
        expect(layout.props('emptyMessage')).toBe('shop.products.empty');
        expect(layout.props('categories')).toEqual(categories);
        expect(wrapper.findComponent(ShopLayout).exists()).toBe(true);
    });

    it('displays product filters in the catalog layout', () => {
        const wrapper = mountProductsIndexPage({
            filters: {
                search: 'keyboard',
                category_id: 2,
                min_price: 20,
                max_price: 80,
            },
            categories: [],
        });

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.props('filters')).toMatchObject({
            search: 'keyboard',
            category_id: 2,
            min_price: 20,
            max_price: 80,
        });
    });

    it('shows empty state when no products are available', () => {
        const wrapper = mountProductsIndexPage({
            products: { data: [] },
            categories: [],
        });

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.props('products')).toEqual({ data: [] });
        expect(layout.props('emptyMessage')).toBe('shop.products.empty');
    });
});
