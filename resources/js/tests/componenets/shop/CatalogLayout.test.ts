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
                filters: { search: '', category_id: null, min_price: null, max_price: null },
                categories: [],
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
        });

        expect(wrapper.text()).toContain('Products');
        expect(wrapper.text()).toContain('Browse our collection');
    });

    it('renders product cards when products exist', () => {
        const wrapper = mount(CatalogLayout, {
            props: {
                heading: 'Products',
                products: { data: [{ id: 1, name: 'Keyboard', slug: 'keyboard', price: 99.99 }] },
                filters: { search: '', category_id: null, min_price: null, max_price: null },
                categories: [],
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
            global: {
                stubs: {
                    ProductCard: {
                        template: '<div data-test="product-card" />',
                        props: ['product'],
                    },
                    ProductFilters: {
                        template: '<div data-test="product-filters" />',
                        props: ['categories', 'filters'],
                    },
                    CategoryNavigation: {
                        template: '<div data-test="category-navigation" />',
                        props: ['categories'],
                    },
                },
            },
        });

        expect(wrapper.find('[data-test="product-card"]').exists()).toBe(true);
        // Assert ProductFilters and CategoryNavigation are rendered
        expect(wrapper.find('[data-test="product-filters"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="category-navigation"]').exists()).toBe(true);
    });

    it('renders empty state when no products are available', () => {
        const wrapper = mount(CatalogLayout, {
            props: {
                heading: 'Products',
                products: { data: [] },
                filters: { search: '', category_id: null, min_price: null, max_price: null },
                categories: [],
                emptyMessage: 'No products',
                applyFilters: vi.fn(),
            },
            global: {
                stubs: {
                    ProductFilters: {
                        template: '<div data-test="product-filters" />',
                        props: ['categories', 'filters'],
                    },
                    CategoryNavigation: {
                        template: '<div data-test="category-navigation" />',
                        props: ['categories'],
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('No products');
        // Assert ProductFilters and CategoryNavigation are rendered even when empty
        expect(wrapper.find('[data-test="product-filters"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="category-navigation"]').exists()).toBe(true);
    });
});
