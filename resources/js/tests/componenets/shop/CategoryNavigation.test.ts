import { usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CategoryNavigation from '@/components/shop/CategoryNavigation.vue';
import { pageWithUrl } from '../../utils';

beforeEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWithUrl('/categories/accessories'));
});

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
        expect(wrapper.text()).toContain('common.categories');
    });

    it('marks the current category active', () => {
        const wrapper = mount(CategoryNavigation, {
            props: {
                categories: [
                    { id: 1, name: 'Accessories', slug: 'accessories' },
                    { id: 2, name: 'Wearables', slug: 'wearables' },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links[0].classes().join(' ')).toContain('bg-indigo-50');
        expect(links[1].classes().join(' ')).not.toContain('bg-indigo-50');
    });

    it('marks the current child category active without matching its sibling prefix', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWithUrl('/categories/shoes-kids'),
        );

        const wrapper = mount(CategoryNavigation, {
            props: {
                categories: [
                    {
                        id: 1,
                        name: 'Shoes',
                        slug: 'shoes',
                        children: [
                            { id: 2, name: 'Kids', slug: 'shoes-kids' },
                            { id: 3, name: 'Adults', slug: 'shoes-adults' },
                        ],
                    },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links[0].classes().join(' ')).not.toContain('bg-indigo-50');
        expect(links[1].classes().join(' ')).toContain('bg-indigo-50');
        expect(links[2].classes().join(' ')).not.toContain('bg-indigo-50');
    });
});
