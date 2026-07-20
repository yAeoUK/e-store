import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductCard from '@/components/shop/ProductCard.vue';

describe('ProductCard', () => {
    it('renders fallback image when no product images exist', () => {
        const wrapper = mount(ProductCard, {
            props: {
                product: {
                    id: 1,
                    name: 'Test Product',
                    slug: 'test-product',
                    price: 49.99,
                    short_description: 'A great product',
                },
            },
        });

        const image = wrapper.get('img');

        expect(image.attributes('src')).toContain('https://placehold.co/600x600?text=Product');
        expect(image.attributes('alt')).toBe('Test Product');
        expect(wrapper.text()).toContain('Test Product');
        expect(wrapper.text()).toContain('$49.99');
        expect(wrapper.text()).toContain('A great product');
    });

    it('renders the provided product image and link text', () => {
        const wrapper = mount(ProductCard, {
            props: {
                product: {
                    id: 2,
                    name: 'Headphones',
                    slug: 'headphones',
                    price: 129.99,
                    short_description: 'Noise cancelling headphones',
                    category: { name: 'Audio' },
                    images: [{ url: '/images/headphones.jpg', alt_text: 'Headphones image' }],
                },
            },
        });

        const image = wrapper.get('img');

        expect(image.attributes('src')).toBe('/images/headphones.jpg');
        expect(image.attributes('alt')).toBe('Headphones image');
        expect(wrapper.text()).toContain('Audio');
        expect(wrapper.text()).toContain('Headphones');
        expect(wrapper.text()).toContain('$129.99');
    });
});
