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
    it('renders the category content', () => {
        const wrapper = mountCategoriesShowPage();

        const layout = wrapper.findComponent({ name: 'CatalogLayout' });

        expect(layout.exists()).toBe(true);
        expect(layout.props('heading')).toBe('Furniture');
        expect(layout.props('description')).toBe('Comfortable furniture');
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

        expect(layout.props('emptyMessage')).toBe('shop.products.categoryEmpty');
        expect(layout.props('products')).toEqual({ data: [] });
    });

});
