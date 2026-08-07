import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import FormActions from '@/components/FormActions.vue';
import {
    expectRendersPageTitle,
    testEmitsSubmitOnFormSubmit,
} from '../../utils';

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
        expectRendersPageTitle(wrapper, 'Create widget');
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

    testEmitsSubmitOnFormSubmit(() => mountForm());

    it('renders the after slot below the form card', () => {
        const wrapper = mountForm(
            {},
            { after: '<div class="extra">extra section</div>' },
        );

        expect(wrapper.find('.extra').exists()).toBe(true);
        expect(wrapper.find('form .extra').exists()).toBe(false);
    });
});
