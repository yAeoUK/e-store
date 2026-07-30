import { Head, router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DataTable from '@/components/admin/DataTable.vue';
import ProductsIndexPage from '@/pages/Admin/Products/Index.vue';
import { routeMock } from '../../../setup';

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
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
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
        const head = wrapper.findComponent(Head);

        expect(head.attributes('title')).toBe('admin.products.pageTitle');
    });

    it('passes the product rows to the DataTable', () => {
        const wrapper = mountPage();
        // DataTable's generic `Row` param isn't inferred through findComponent()
        // by vue-test-utils, so its return type falls back to DOMWrapper.
        const table = wrapper.findComponent(DataTable) as unknown as {
            props: (name: string) => unknown;
        };

        expect(table.props('rows')).toEqual(products.data);
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

    it('opens the delete confirmation dialog and deletes on confirm', async () => {
        const wrapper = mountPage();

        const deleteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.actions.delete');
        await deleteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);

        await dialog.vm.$emit('confirm');

        expect(router.delete).toHaveBeenCalledWith(
            'admin.products.destroy',
            expect.objectContaining({ preserveScroll: true }),
        );
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

    it('renders the table column labels', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('admin.products.columns.name');
        expect(text).toContain('admin.products.columns.category');
        expect(text).toContain('admin.products.columns.price');
        expect(text).toContain('admin.products.columns.stock');
        expect(text).toContain('admin.products.columns.status');
    });

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

    it('renders an edit link for each row', () => {
        const wrapper = mountPage();

        const editLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'admin.actions.edit');

        expect(editLink?.attributes('href')).toBe('admin.products.edit');
    });

    it('renders the delete confirmation dialog copy', async () => {
        const wrapper = mountPage();

        const deleteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.actions.delete');
        await deleteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });

        expect(dialog.props('title')).toBe(
            'admin.products.deleteConfirmTitle',
        );
        expect(dialog.props('message')).toBe(
            'admin.products.deleteConfirmMessage',
        );
        expect(dialog.props('confirmLabel')).toBe('common.delete');
    });

    it('renders the expected layout and form components', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(
            wrapper.findAllComponents({ name: 'ButtonLink' }).length,
        ).toBeGreaterThan(0);
        expect(
            wrapper.findAllComponents({ name: 'InputLabel' }).length,
        ).toBeGreaterThan(0);
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
    });
});
