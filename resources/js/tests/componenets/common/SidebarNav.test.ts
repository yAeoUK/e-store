import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SidebarNav from '@/components/SidebarNav.vue';

describe('SidebarNav', () => {
    it('renders an optional title', () => {
        const wrapper = mount(SidebarNav, {
            props: { title: 'Categories', items: [] },
        });

        expect(wrapper.text()).toContain('Categories');
    });

    it('renders one link per item with the badge shown when present', () => {
        const wrapper = mount(SidebarNav, {
            props: {
                items: [
                    {
                        key: 1,
                        label: 'Electronics',
                        href: '/categories/electronics',
                        badge: 2,
                    },
                    { key: 2, label: 'Books', href: '/categories/books' },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links).toHaveLength(2);
        expect(links[0].text()).toContain('Electronics');
        expect(links[0].text()).toContain('2');
        expect(links[1].text()).not.toMatch(/\d/);
    });

    it('marks the active item with the active-row styling', () => {
        const wrapper = mount(SidebarNav, {
            props: {
                items: [
                    {
                        key: 1,
                        label: 'Dashboard',
                        href: '/admin',
                        active: true,
                    },
                    {
                        key: 2,
                        label: 'Products',
                        href: '/admin/products',
                        active: false,
                    },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links[0].classes().join(' ')).toContain('bg-indigo-50');
        expect(links[1].classes().join(' ')).not.toContain('bg-indigo-50');
    });

    it('renders nested children under a parent item', () => {
        const wrapper = mount(SidebarNav, {
            props: {
                items: [
                    {
                        key: 1,
                        label: 'Wearables',
                        href: '/categories/wearables',
                        children: [
                            {
                                key: 2,
                                label: 'Watches',
                                href: '/categories/watches',
                            },
                        ],
                    },
                ],
            },
        });

        expect(wrapper.text()).toContain('Watches');
        expect(wrapper.findAll('a')).toHaveLength(2);
    });

    it('marks an active child item with the active-row styling', () => {
        const wrapper = mount(SidebarNav, {
            props: {
                items: [
                    {
                        key: 1,
                        label: 'Wearables',
                        href: '/categories/wearables',
                        children: [
                            {
                                key: 2,
                                label: 'Watches',
                                href: '/categories/watches',
                                active: true,
                            },
                            {
                                key: 3,
                                label: 'Bands',
                                href: '/categories/bands',
                                active: false,
                            },
                        ],
                    },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links[1].classes().join(' ')).toContain('bg-indigo-50');
        expect(links[2].classes().join(' ')).not.toContain('bg-indigo-50');
    });
});
