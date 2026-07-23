import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import ProductsShowPage from '@/pages/Products/Show.vue';

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
    return shallowMount(ProductsShowPage, {
        props: {
            product: defaultProduct,
            ...props,
        },
    });
}

describe('Products show page', () => {
    it('renders the product details', () => {
        const wrapper = mountProductsShowPage();

        expect(wrapper.text()).toContain(defaultProduct.name);
        expect(wrapper.text()).toContain(defaultProduct.description);
        expect(wrapper.text()).toContain('common.price');
        expect(wrapper.text()).toContain('$199.99');
        expect(wrapper.text()).toContain('common.inStock');
        expect(wrapper.findComponent(ShopLayout).exists()).toBe(true);
    });

    it('displays product images', () => {
        const images = [
            { id: 1, url: '/images/watch.jpg', alt_text: 'Smart Watch' },
        ];

        const wrapper = mountProductsShowPage({
            product: {
                ...defaultProduct,
                images,
            },
        });

        const gallery = wrapper.findComponent({ name: 'ProductGallery' });

        expect(gallery.exists()).toBe(true);
        expect(gallery.props('images')).toEqual(images);
        expect(gallery.props('title')).toBe(defaultProduct.name);
    });

    it('displays product variants', () => {
        const variants = [
            { sku: 'WATCH-BLACK', options: { color: 'Black' }, price: 199.99, stock: 3 },
            { sku: 'WATCH-SILVER', options: { color: 'Silver' }, price: 209.99, stock: 0 },
        ];

        const wrapper = mountProductsShowPage({
            product: {
                ...defaultProduct,
                variants,
            },
        });

        expect(wrapper.text()).toContain('WATCH-BLACK');
        expect(wrapper.text()).toContain('color: Black');
        expect(wrapper.text()).toContain('WATCH-SILVER');
        expect(wrapper.text()).toContain('common.stock');
    });
});
