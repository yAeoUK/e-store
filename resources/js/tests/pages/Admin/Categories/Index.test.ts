import { Head, router, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CategoriesIndexPage from '@/pages/Admin/Categories/Index.vue';
import { routeMock } from '../../../setup';

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

function pageWith(errors: Record<string, string> = {}) {
    return { props: { auth: { user: null }, errors } } as unknown as ReturnType<
        typeof usePage
    >;
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.delete).mockClear();
    vi.mocked(usePage).mockReturnValue(pageWith());
});

afterEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWith());
});

function mountPage() {
    return mount(CategoriesIndexPage, {
        props: { categories, filters: { search: null } },
    });
}

describe('Admin Categories index page', () => {
    it('does not show a delete-blocked message by default', () => {
        const wrapper = mountPage();

        expect(wrapper.text()).not.toContain(
            'Cannot delete a category that still has children.',
        );
    });

    it('shows the server error message when the server flashes a category error', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({
                category: 'Cannot delete a category that still has children.',
            }),
        );

        const wrapper = mountPage();

        expect(wrapper.text()).toContain(
            'Cannot delete a category that still has children.',
        );
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

    it('deletes a category on confirm', async () => {
        const wrapper = mountPage();

        const deleteButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.actions.delete');
        await deleteButton?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);

        await dialog.vm.$emit('confirm');

        expect(router.delete).toHaveBeenCalledWith(
            'admin.categories.destroy',
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    it('renders the page title, heading and create action', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.categories.pageTitle',
        );
        expect(wrapper.text()).toContain('admin.categories.heading');

        const createLink = wrapper
            .findAllComponents({ name: 'ButtonLink' })
            .find((link) => link.text() === 'admin.categories.create');
        expect(createLink?.props('href')).toBe('admin.categories.create');
    });

    it('renders the expected column headers', () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        expect(text).toContain('admin.categories.columns.name');
        expect(text).toContain('admin.categories.columns.parent');
        expect(text).toContain('admin.categories.columns.products');
        expect(text).toContain('admin.categories.columns.subcategories');
    });

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

    it('renders an edit link for each row', () => {
        const wrapper = mountPage();

        const editLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'admin.actions.edit');
        expect(editLink?.attributes('href')).toBe('admin.categories.edit');
    });

    it('passes the expected copy to the delete confirmation dialog', () => {
        const wrapper = mountPage();

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('title')).toBe(
            'admin.categories.deleteConfirmTitle',
        );
        expect(dialog.props('message')).toBe(
            'admin.categories.deleteConfirmMessage',
        );
        expect(dialog.props('confirmLabel')).toBe('common.delete');
    });

    it('renders inside the expected layout and table components', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
        expect(
            wrapper.findAllComponents({ name: 'ButtonLink' }).length,
        ).toBeGreaterThan(0);
    });
});
