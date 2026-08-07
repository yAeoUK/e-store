import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import ProductsShowPage from '@/pages/Products/Show.vue';
import { routeMock } from '../../setup';
import { expectRendersPageTitle } from '../../utils';

const defaultProduct = {
    id: 1,
    name: 'Smart Watch',
    slug: 'smart-watch',
    price: 199.99,
    description: 'A smart watch with fitness tracking.',
    short_description: 'Fitness tracking watch.',
    stock: 5,
    category: { name: 'Wearables' },
    images: [],
    variants: [],
};

function mountProductsShowPage(props = {}) {
    return mount(ProductsShowPage, {
        props: {
            product: defaultProduct,
            ...props,
        },
    });
}

beforeEach(() => {
    routeMock.mockClear();
    vi.mocked(router.post).mockClear();
});

describe('Products show page', () => {
    it('renders the page title via Head, using the product name', () => {
        const wrapper = mountProductsShowPage();

        expectRendersPageTitle(wrapper, defaultProduct.name);
    });

    it('renders the product details', () => {
        const wrapper = mountProductsShowPage();

        expect(wrapper.text()).toContain(defaultProduct.name);
        expect(wrapper.text()).toContain(defaultProduct.description);
        expect(wrapper.text()).toContain('common.price');
        expect(wrapper.text()).toContain('$199.99');
        expect(wrapper.text()).toContain('common.availability');
        expect(wrapper.text()).toContain('common.inStock');
        expect(wrapper.findComponent(ShopLayout).exists()).toBe(true);
    });

    it('shows out-of-stock styling and text when the product has no stock', () => {
        const wrapper = mountProductsShowPage({
            product: { ...defaultProduct, stock: 0 },
        });

        expect(wrapper.text()).toContain('common.outOfStock');

        const availability = wrapper
            .findAll('p')
            .find((paragraph) => paragraph.text() === 'common.outOfStock');

        expect(availability?.classes()).toContain('text-red-600');
    });

    it('displays a placeholder image when the product has none', () => {
        const wrapper = mountProductsShowPage();

        const image = wrapper.get('img');

        expect(image.attributes('src')).toContain(
            'https://placehold.co/600x600?text=Product',
        );
        expect(image.attributes('alt')).toBe(defaultProduct.name);
    });

    it('displays product images and updates the selected image on thumbnail click', async () => {
        const images = [
            { id: 1, url: '/images/watch.jpg', alt_text: 'Front' },
            { id: 2, url: '/images/watch-back.jpg', alt_text: 'Back' },
        ];

        const wrapper = mountProductsShowPage({
            product: {
                ...defaultProduct,
                images,
            },
        });

        expect(wrapper.get('img').attributes('src')).toBe('/images/watch.jpg');

        const thumbnails = wrapper.findAll('button[type="button"]');
        expect(thumbnails).toHaveLength(2);

        await thumbnails[1].trigger('click');

        expect(wrapper.get('img').attributes('src')).toBe(
            '/images/watch-back.jpg',
        );
    });

    it('displays product variants', () => {
        const variants = [
            {
                sku: 'WATCH-BLACK',
                options: { color: 'Black' },
                price: 199.99,
                stock: 3,
            },
            {
                sku: 'WATCH-SILVER',
                options: { color: 'Silver' },
                price: 209.99,
                stock: 0,
            },
        ];

        const wrapper = mountProductsShowPage({
            product: {
                ...defaultProduct,
                variants,
            },
        });

        expect(wrapper.text()).toContain('common.variants');
        expect(wrapper.text()).toContain('WATCH-BLACK');
        expect(wrapper.text()).toContain('color: Black');
        expect(wrapper.text()).toContain('WATCH-SILVER');
        expect(wrapper.text()).toContain('common.stock');
    });

    it('disables adding to cart and shows the out-of-stock label when the product has no stock', () => {
        const wrapper = mountProductsShowPage({
            product: { ...defaultProduct, stock: 0 },
        });

        const button = wrapper.get('button');

        expect(button.text()).toBe('shop.cart.outOfStock');
        expect(button.attributes('disabled')).toBeDefined();
    });

    it('enables adding to cart with a quantity capped at the available stock', () => {
        const wrapper = mountProductsShowPage();

        const button = wrapper.get('button');
        const quantityInput = wrapper.get('input[type="number"]');

        expect(button.text()).toBe('shop.cart.addToCart');
        expect(button.attributes('disabled')).toBeUndefined();
        expect(quantityInput.attributes('max')).toBe('5');
        expect((quantityInput.element as HTMLInputElement).value).toBe('1');
    });

    it('adds a product without variants to the cart with the chosen quantity', async () => {
        const wrapper = mountProductsShowPage();

        await wrapper.get('input[type="number"]').setValue(3);
        await wrapper.get('button').trigger('click');

        expect(routeMock).toHaveBeenCalledWith('cart.items.store');
        expect(vi.mocked(router.post)).toHaveBeenCalledWith(
            'cart.items.store',
            {
                product_id: defaultProduct.id,
                product_variant_id: null,
                quantity: 3,
            },
            { preserveScroll: true },
        );
    });

    it('disables adding to cart when the selected variant is out of stock', async () => {
        const variants = [
            { id: 10, sku: 'WATCH-BLACK', is_active: true, stock: 4 },
            { id: 11, sku: 'WATCH-SILVER', is_active: true, stock: 0 },
        ];

        const wrapper = mountProductsShowPage({
            product: { ...defaultProduct, variants },
        });

        const button = wrapper.get('button');
        const quantityInput = wrapper.get('input[type="number"]');

        expect(quantityInput.attributes('max')).toBe('4');
        expect(button.attributes('disabled')).toBeUndefined();

        await wrapper.get('select').setValue('11');

        expect(quantityInput.attributes('max')).toBe('0');
        expect(button.attributes('disabled')).toBeDefined();
        expect(button.text()).toBe('shop.cart.outOfStock');
    });

    it('adds the selected variant to the cart', async () => {
        const variants = [
            { id: 10, sku: 'WATCH-BLACK', is_active: true, stock: 4 },
            { id: 11, sku: 'WATCH-SILVER', is_active: true, stock: 2 },
        ];

        const wrapper = mountProductsShowPage({
            product: { ...defaultProduct, variants },
        });

        await wrapper.get('select').setValue('11');
        await wrapper.get('button').trigger('click');

        expect(vi.mocked(router.post)).toHaveBeenCalledWith(
            'cart.items.store',
            {
                product_id: defaultProduct.id,
                product_variant_id: 11,
                quantity: 1,
            },
            { preserveScroll: true },
        );
    });
});
