import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductGallery from '@/components/shop/ProductGallery.vue';

describe('ProductGallery', () => {
    it('renders placeholder image when no images are provided', () => {
        const wrapper = mount(ProductGallery, {
            props: {
                title: 'Test Product',
            },
        });

        const image = wrapper.get('img');

        expect(image.attributes('src')).toContain('https://placehold.co/600x600?text=Product');
        expect(image.attributes('alt')).toBe('Test Product');
    });

    it('renders provided images and updates selected image on thumbnail click', async () => {
        const images = [
            { id: 1, url: '/images/first.jpg', alt_text: 'First' },
            { id: 2, url: '/images/second.jpg', alt_text: 'Second' },
        ];

        const wrapper = mount(ProductGallery, {
            props: {
                images,
                title: 'Test Product',
            },
        });

        expect(wrapper.get('img').attributes('src')).toBe('/images/first.jpg');
        expect(wrapper.findAll('button')).toHaveLength(2);

        await wrapper.findAll('button')[1].trigger('click');

        expect(wrapper.get('img').attributes('src')).toBe('/images/second.jpg');
        expect(wrapper.get('img').attributes('alt')).toBe('Test Product');
    });
});
