import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import FormActions from '@/components/FormActions.vue';
import CategoriesCreatePage from '@/pages/Admin/Categories/Create.vue';
import { getMockForm } from '../../../setup';

describe('Admin Categories create page', () => {
    it('auto-fills the slug from the name while untouched', async () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Home Appliances');

        expect(getMockForm().slug).toBe('home-appliances');
        expect(wrapper.text()).toContain('home-appliances');
    });

    it('stops auto-syncing once the slug is edited manually via the Edit button', async () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue('Home Appliances');

        const editButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'admin.actions.edit');
        await editButton?.trigger('click');

        const slugInput = wrapper.findAll('input[type="text"]')[1];
        await slugInput.setValue('custom-slug');
        await nameInput.setValue('Home Appliances 2');

        expect(getMockForm().slug).toBe('custom-slug');
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.categories.create',
        );
    });

    it('renders the form labels and actions', () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });
        const text = wrapper.text();

        expect(text).toContain('admin.categories.create');
        expect(text).toContain('admin.categories.name');
        expect(text).toContain('admin.categories.slug');
        expect(text).toContain('admin.categories.parent');
        expect(text).toContain('admin.categories.description');
        expect(text).toContain('common.cancel');
        expect(text).toContain('admin.categories.save');
    });

    it('renders inside the expected layout and form components', () => {
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories: [] },
        });

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.findComponent(FormActions).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'InputLabel' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
        expect(
            wrapper.findComponent({ name: 'PrimaryButton' }).exists(),
        ).toBe(true);
    });

    it('wires CategoryFormFields with auto-slug enabled and the categories/errors props', () => {
        const categories = [{ id: 1, name: 'Electronics' }];
        const wrapper = mount(CategoriesCreatePage, {
            props: { categories },
        });

        const fields = wrapper.findComponent(CategoryFormFields);
        expect(fields.props('categories')).toEqual(categories);
        expect(fields.props('errors')).toEqual({});
        expect(fields.props('autoSlug')).toBe(true);
    });
});
