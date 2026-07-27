import { Head } from '@inertiajs/vue3';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import CategoriesShowPage from '@/pages/Categories/Show.vue';
import { defaultProducts } from '../../utils';

function mountCategoriesShowPage(props = {}) {
    return shallowMount(CategoriesShowPage, {
        props: {
            category: {
                id: 4,
                name: 'Furniture',
                slug: 'furniture',
                description: 'Comfortable furniture',
            },
            products: defaultProducts,
            filters: {
                search: '',
                min_price: null,
                max_price: null,
            },
            categories: [],
            ...props,
        },
    });
}

describe('Categories show page', () => {
    it('renders the page title via Head, using the category name', () => {
        const wrapper = mountCategoriesShowPage();
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('Furniture');
    });

    it('falls back to the default page title via Head when there is no category', () => {
        const wrapper = mountCategoriesShowPage({ category: undefined });
        const head = wrapper.findComponent(Head);

        expect(head.attributes('title')).toBe('shop.categories.pageTitle');
    });

    it('renders the category content', () => {
        const categories = [
            { id: 2, name: 'Living Room', slug: 'living-room' },
        ];
        const wrapper = mountCategoriesShowPage({ categories });

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.exists()).toBe(true);
        expect(layout.props('heading')).toBe('Furniture');
        expect(layout.props('description')).toBe('Comfortable furniture');
        expect(layout.props('categories')).toEqual(categories);
        expect(wrapper.findComponent(ShopLayout).exists()).toBe(true);
    });

    it('displays category filters', () => {
        const wrapper = mountCategoriesShowPage({
            filters: { search: 'chair', min_price: 15, max_price: 100 },
        });

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.props('filters')).toMatchObject({
            search: 'chair',
            min_price: 15,
            max_price: 100,
        });
    });

    it('shows empty state when no products exist', () => {
        const wrapper = mountCategoriesShowPage();

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.props('emptyMessage')).toBe(
            'shop.products.categoryEmpty',
        );
        expect(layout.props('products')).toEqual({ data: [] });
    });
});
