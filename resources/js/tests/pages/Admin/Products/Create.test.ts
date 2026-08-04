import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import FormActions from '@/components/FormActions.vue';
import ProductsCreatePage from '@/pages/Admin/Products/Create.vue';
import { getMockForm, routeMock } from '../../../setup';

describe('Admin Products create page', () => {
    it('auto-fills the slug from the name while untouched', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');

        expect(getMockForm().slug).toBe('wireless-mouse-pro');
        expect(wrapper.text()).toContain('wireless-mouse-pro');
    });

    it('stops auto-syncing once the slug is edited manually via the Edit button', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');

        const editButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.actions.edit');
        await editButton?.trigger('click');

        const slugInput = wrapper.findAll('input[type="text"]')[1];
        await slugInput.setValue('custom-slug');
        await nameInput.setValue('Wireless Mouse Pro 2');

        expect(getMockForm().slug).toBe('custom-slug');
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.products.create',
        );
    });

    it('renders the field labels and form actions', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });
        const text = wrapper.text();

        expect(text).toContain('admin.products.create');
        expect(text).toContain('admin.products.name');
        expect(text).toContain('admin.products.slug');
        expect(text).toContain('admin.products.category');
        expect(text).toContain('admin.products.noCategory');
        expect(text).toContain('admin.products.price');
        expect(text).toContain('admin.products.stock');
        expect(text).toContain('admin.products.shortDescription');
        expect(text).toContain('admin.products.description');
        expect(text).toContain('admin.products.isActive');
        expect(text).toContain('common.cancel');
        expect(text).toContain('admin.products.save');
    });

    it('lists the categories prop as select options', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: {
                categories: [
                    { id: 1, name: 'Electronics' },
                    { id: 2, name: 'Furniture' },
                ],
            },
        });

        expect(wrapper.text()).toContain('Electronics');
        expect(wrapper.text()).toContain('Furniture');
    });

    it('renders the expected layout and form components', () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.findComponent(FormActions).exists()).toBe(true);
        expect(
            wrapper.findAllComponents({ name: 'InputLabel' }).length,
        ).toBeGreaterThan(0);
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
    });

    it('wires ProductFormFields with auto-slug enabled and the categories/errors props', () => {
        const categories = [{ id: 1, name: 'Electronics' }];
        const wrapper = mount(ProductsCreatePage, {
            props: { categories },
        });

        const fields = wrapper.findComponent(ProductFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBe(true);
        expect(fields.props('form').name).toBe('');
        expect(fields.props('form').slug).toBe('');
        expect(fields.props('form').category_id).toBe('');
        expect(fields.props('form').price).toBe('');
        expect(fields.props('form').stock).toBe(0);
        expect(fields.props('form').short_description).toBe('');
        expect(fields.props('form').description).toBe('');
        expect(fields.props('form').is_active).toBe(true);
    });

    it('binds category, stock, short description, description and active status to the form', async () => {
        const categories = [{ id: 3, name: 'Electronics' }];
        const wrapper = mount(ProductsCreatePage, {
            props: { categories },
        });

        await wrapper.find('select').setValue(3);
        await wrapper.findAll('input[type="number"]')[1].setValue(7);
        await wrapper
            .findAll('input[type="text"]')[1]
            .setValue('Great for travel.');
        await wrapper.find('textarea').setValue('Full description.');
        await wrapper.find('input[type="checkbox"]').setValue(false);

        expect(getMockForm().category_id).toBe(3);
        expect(getMockForm().stock).toBe(7);
        expect(getMockForm().short_description).toBe('Great for travel.');
        expect(getMockForm().description).toBe('Full description.');
        expect(getMockForm().is_active).toBe(false);
    });

    it('blocks submission and shows a validation error when name is empty', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.store',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks submission and shows a validation error when price is negative', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');
        const priceInput = wrapper.find('input[type="number"]');
        await priceInput.setValue(-5);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.store',
            expect.anything(),
        );
        expect(wrapper.text()).toContain('validation.min');
    });

    it('submits the form when the required name and price fields are filled in', async () => {
        const wrapper = mount(ProductsCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Wireless Mouse Pro');
        const priceInput = wrapper.find('input[type="number"]');
        await priceInput.setValue(29.99);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.products.store');
        expect(getMockForm().lastPostUrl).toBeDefined();
        expect(wrapper.text()).not.toContain('validation.required');
    });
});
