import { router, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CategoriesIndexPage from '@/pages/Admin/Categories/Index.vue';
import {
    expectRendersPageTitle,
    pageWith,
    testConfirmationDialogFlow,
    testRendersEditLink,
    testRendersIndexLayout,
    testRendersLabels,
    testServerErrorFlash,
} from '../../../utils';

const categories = {
    data: [
        {
            id: 1,
            name: 'Electronics',
            slug: 'electronics',
            parent: null,
            products_count: 3,
            children_count: 0,
        },
    ],
    links: [],
};

beforeEach(() => {
    vi.mocked(router.delete).mockClear();
    vi.mocked(usePage).mockReturnValue(pageWith({ errors: {} }));
});

function mountPage() {
    return mount(CategoriesIndexPage, {
        props: { categories, filters: { search: null } },
    });
}

describe('Admin Categories index page', () => {
    testServerErrorFlash(mountPage, {
        errorKey: 'category',
        message: 'Cannot delete a category that still has children.',
    });

    it('shows plain text for a null parent and a zero subcategories count', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.categories.none');

        const links = wrapper.findAll('a');
        expect(links.find((a) => a.text() === '0')).toBeUndefined();
    });

    it('links a non-zero products count to the pre-filtered products list', () => {
        const wrapper = mountPage();

        const link = wrapper.findAll('a').find((a) => a.text() === '3');
        expect(link?.attributes('href')).toBe('admin.products.index');
    });

    it('links the parent name and a non-zero subcategories count', () => {
        const wrapper = mount(CategoriesIndexPage, {
            props: {
                categories: {
                    data: [
                        {
                            id: 2,
                            name: 'Phones',
                            slug: 'phones',
                            parent: { id: 1, name: 'Electronics' },
                            products_count: 0,
                            children_count: 2,
                        },
                    ],
                    links: [],
                },
                filters: { search: null },
            },
        });

        const parentLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'Electronics');
        expect(parentLink?.attributes('href')).toBe('admin.categories.edit');

        const childrenLink = wrapper.findAll('a').find((a) => a.text() === '2');
        expect(childrenLink?.attributes('href')).toBe('admin.categories.index');
    });

    it('renders the page title, heading and create action', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'admin.categories.pageTitle');
        expect(wrapper.text()).toContain('admin.categories.heading');

        const createLink = wrapper
            .findAllComponents({ name: 'ButtonLink' })
            .find((link) => link.text() === 'admin.categories.create');
        expect(createLink?.props('href')).toBe('admin.categories.create');
    });

    testRendersLabels(
        mountPage,
        [
            'admin.categories.columns.name',
            'admin.categories.columns.parent',
            'admin.categories.columns.products',
            'admin.categories.columns.subcategories',
        ],
        'renders the expected column headers',
    );

    it('renders the search field and its submit button', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('admin.categories.searchPlaceholder');
        expect(text).toContain('common.confirm');
        expect(wrapper.findComponent({ name: 'FormField' }).exists()).toBe(
            true,
        );
    });

    it('shows the empty message when there are no categories', () => {
        const wrapper = mount(CategoriesIndexPage, {
            props: {
                categories: { data: [], links: [] },
                filters: { search: null },
            },
        });

        expect(wrapper.text()).toContain('admin.categories.empty');
    });

    testRendersEditLink(mountPage, 'admin.categories.edit');

    testConfirmationDialogFlow(mountPage, {
        triggerText: 'admin.actions.delete',
        title: 'admin.categories.deleteConfirmTitle',
        message: 'admin.categories.deleteConfirmMessage',
        confirmLabel: 'common.delete',
        onConfirm: () =>
            expect(router.delete).toHaveBeenCalledWith(
                'admin.categories.destroy',
                expect.objectContaining({ preserveScroll: true }),
            ),
    });

    testRendersIndexLayout(mountPage, [
        'AdminLayout',
        'Pagination',
        'PrimaryButton',
        'ButtonLink',
    ]);
});
