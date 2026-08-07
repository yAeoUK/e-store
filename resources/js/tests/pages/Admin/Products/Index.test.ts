import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DataTable from '@/components/admin/DataTable.vue';
import ProductsIndexPage from '@/pages/Admin/Products/Index.vue';
import {
    expectRendersPageTitle,
    testConfirmationDialogFlow,
    testRendersEditLink,
    testRendersIndexLayout,
    testRendersLabels,
} from '../../../utils';

const products = {
    data: [
        {
            id: 1,
            name: 'Wireless Mouse',
            slug: 'wireless-mouse',
            price: '19.99',
            stock: 5,
            is_active: true,
            category: { id: 1, name: 'Accessories' },
        },
    ],
    links: [],
};

const categories = [{ id: 1, name: 'Accessories' }];

beforeEach(() => {
    vi.mocked(router.get).mockClear();
    vi.mocked(router.delete).mockClear();
});

function mountPage() {
    return mount(ProductsIndexPage, {
        props: {
            products,
            categories,
            filters: { search: null, category_id: null },
        },
    });
}

describe('Admin Products index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mountPage();

        expectRendersPageTitle(wrapper, 'admin.products.pageTitle');
    });

    it('passes the product rows to the DataTable', () => {
        const wrapper = mountPage();
        // DataTable's generic `Row` param isn't inferred through findComponent()
        // by vue-test-utils, so its return type falls back to DOMWrapper.
        const table = wrapper.findComponent(DataTable) as unknown as {
            props: (name: string) => unknown;
        };

        expect((table.props('paginated') as typeof products).data).toEqual(
            products.data,
        );
        expect(table.props('emptyMessage')).toBe('admin.products.empty');
    });

    it('submits the search/category filters via router.get', async () => {
        const wrapper = mountPage();

        await wrapper.find('input[type="text"]').setValue('mouse');
        await wrapper.find('form').trigger('submit');

        expect(router.get).toHaveBeenCalledWith(
            'admin.products.index',
            { search: 'mouse', category_id: null },
            { preserveState: true, replace: true },
        );
    });

    it("links the category cell to that category's edit page", () => {
        const wrapper = mountPage();

        const categoryLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'Accessories');

        expect(categoryLink?.attributes('href')).toBe('admin.categories.edit');
    });

    it('shows plain text when a product has no category', () => {
        const wrapper = mount(ProductsIndexPage, {
            props: {
                products: {
                    data: [{ ...products.data[0], category: null }],
                    links: [],
                },
                categories,
                filters: { search: null, category_id: null },
            },
        });

        expect(wrapper.text()).toContain('admin.products.noCategory');
        expect(
            wrapper.findAll('a').find((a) => a.text() === 'Accessories'),
        ).toBeUndefined();
    });

    it('renders the heading and create button', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('admin.products.heading');
        expect(text).toContain('admin.products.create');

        const createLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'admin.products.create');
        expect(createLink?.attributes('href')).toBe('admin.products.create');
    });

    it('renders the filter form labels', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('admin.products.searchPlaceholder');
        expect(text).toContain('admin.products.category');
        expect(text).toContain('admin.categories.none');
        expect(text).toContain('common.confirm');
    });

    testRendersLabels(
        mountPage,
        [
            'admin.products.columns.name',
            'admin.products.columns.category',
            'admin.products.columns.price',
            'admin.products.columns.stock',
            'admin.products.columns.status',
        ],
        'renders the table column labels',
    );

    it('renders the active status label for an active product', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).toContain('admin.products.isActive');
    });

    it('renders the inactive status label for an inactive product', () => {
        const wrapper = mount(ProductsIndexPage, {
            props: {
                products: {
                    data: [{ ...products.data[0], is_active: false }],
                    links: [],
                },
                categories,
                filters: { search: null, category_id: null },
            },
        });

        expect(wrapper.text()).toContain('admin.products.isInactive');
    });

    testRendersEditLink(mountPage, 'admin.products.edit');

    testConfirmationDialogFlow(mountPage, {
        triggerText: 'admin.actions.delete',
        title: 'admin.products.deleteConfirmTitle',
        message: 'admin.products.deleteConfirmMessage',
        confirmLabel: 'common.delete',
        onConfirm: () =>
            expect(router.delete).toHaveBeenCalledWith(
                'admin.products.destroy',
                expect.objectContaining({ preserveScroll: true }),
            ),
    });

    testRendersIndexLayout(mountPage, [
        'AdminLayout',
        'ButtonLink',
        'InputLabel',
        'Pagination',
        'PrimaryButton',
    ]);
});
