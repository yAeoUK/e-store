import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CatalogLayout from '@/components/shop/CatalogLayout.vue';

describe('CatalogLayout', () => {
    it('renders heading and description when provided', () => {
        const wrapper = mount(CatalogLayout, {
            props: {
                heading: 'Products',
                description: 'Browse our collection',
                products: { data: [] },
                filters: {
                    search: '',
                    category_id: null,
                    min_price: null,
                    max_price: null,
                },
                categories: [],
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
        });

        expect(wrapper.text()).toContain('Products');
        expect(wrapper.text()).toContain('Browse our collection');
    });

    it('renders product cards when products exist', () => {
        const categories = [
            { id: 1, name: 'Accessories', slug: 'accessories' },
        ];
        const filters = {
            search: 'keyboard',
            category_id: null,
            min_price: null,
            max_price: null,
        };
        const product = {
            id: 1,
            name: 'Keyboard',
            slug: 'keyboard',
            price: 99.99,
        };
        const wrapper = mount(CatalogLayout, {
            props: {
                heading: 'Products',
                products: { data: [product] },
                filters,
                categories,
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
            global: {
                stubs: {
                    ProductCard: {
                        name: 'ProductCard',
                        template: '<div data-test="product-card" />',
                        props: ['product'],
                    },
                    ProductFilters: {
                        name: 'ProductFilters',
                        template: '<div data-test="product-filters" />',
                        props: ['categories', 'filters'],
                    },
                    CategoryNavigation: {
                        name: 'CategoryNavigation',
                        template: '<div data-test="category-navigation" />',
                        props: ['categories'],
                    },
                },
            },
        });

        const productCard = wrapper.findComponent({ name: 'ProductCard' });
        expect(productCard.exists()).toBe(true);
        expect(productCard.props('product')).toEqual(product);

        const productFilters = wrapper.findComponent({
            name: 'ProductFilters',
        });
        expect(productFilters.props('categories')).toEqual(categories);
        expect(productFilters.props('filters')).toEqual(filters);

        expect(
            wrapper
                .findComponent({ name: 'CategoryNavigation' })
                .props('categories'),
        ).toEqual(categories);
    });

    it('renders empty state when no products are available', () => {
        const categories = [
            { id: 1, name: 'Accessories', slug: 'accessories' },
        ];
        const wrapper = mount(CatalogLayout, {
            props: {
                heading: 'Products',
                products: { data: [] },
                filters: {
                    search: '',
                    category_id: null,
                    min_price: null,
                    max_price: null,
                },
                categories,
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
            global: {
                stubs: {
                    ProductFilters: {
                        name: 'ProductFilters',
                        template: '<div data-test="product-filters" />',
                        props: ['categories', 'filters'],
                    },
                    CategoryNavigation: {
                        name: 'CategoryNavigation',
                        template: '<div data-test="category-navigation" />',
                        props: ['categories'],
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('No products');
        // Assert ProductFilters and CategoryNavigation are rendered (with the
        // right categories) even when there are no products.
        expect(
            wrapper
                .findComponent({ name: 'ProductFilters' })
                .props('categories'),
        ).toEqual(categories);
        expect(
            wrapper
                .findComponent({ name: 'CategoryNavigation' })
                .props('categories'),
        ).toEqual(categories);
    });
});
