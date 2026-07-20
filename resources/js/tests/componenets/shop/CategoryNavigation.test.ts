import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryNavigation from '@/components/shop/CategoryNavigation.vue';

describe('CategoryNavigation', () => {
    it('renders category links and child counts', () => {
        const wrapper = mount(CategoryNavigation, {
            props: {
                categories: [
                    { id: 1, name: 'Accessories', slug: 'accessories' },
                    {
                        id: 2,
                        name: 'Wearables',
                        slug: 'wearables',
                        children: [{ id: 3, name: 'Watches', slug: 'watches' }],
                    },
                ],
            },
        });

        expect(wrapper.findAll('a')).toHaveLength(3);
        expect(wrapper.text()).toContain('Accessories');
        expect(wrapper.text()).toContain('Wearables');
        expect(wrapper.text()).toContain('1');
        expect(wrapper.text()).toContain('Watches');
    });
});
