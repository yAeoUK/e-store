import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import FormActions from '@/components/FormActions.vue';

function mountForm(props = {}, slots = {}) {
    return mount(AdminResourceForm, {
        props: {
            title: 'Create widget',
            cancelHref: '/admin/widgets',
            saveLabel: 'Save widget',
            processing: false,
            ...props,
        },
        slots: {
            default: '<div class="fields">fields</div>',
            ...slots,
        },
    });
}

describe('AdminResourceForm', () => {
    it('renders inside the expected layout with the title as page heading and Head title', () => {
        const wrapper = mountForm();

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'Create widget',
        );
        expect(wrapper.find('h1').text()).toBe('Create widget');
    });

    it('renders the default slot content inside the form', () => {
        const wrapper = mountForm();

        expect(wrapper.find('form .fields').exists()).toBe(true);
    });

    it('points the cancel link at cancelHref and shows the save label', () => {
        const wrapper = mountForm();
        const actions = wrapper.findComponent(FormActions);

        expect(
            actions.findComponent({ name: 'ButtonLink' }).props('href'),
        ).toBe('/admin/widgets');
        expect(actions.text()).toContain('Save widget');
    });

    it('disables the save button while processing', () => {
        const wrapper = mountForm({ processing: true });
        const saveButton = wrapper.findComponent(FormActions).find('button');

        expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('emits submit when the form is submitted', async () => {
        const wrapper = mountForm();

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
    });

    it('renders the after slot below the form card', () => {
        const wrapper = mountForm(
            {},
            { after: '<div class="extra">extra section</div>' },
        );

        expect(wrapper.find('.extra').exists()).toBe(true);
        expect(wrapper.find('form .extra').exists()).toBe(false);
    });
});
