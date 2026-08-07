import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import { expectRendersPageTitle } from '../../utils';

describe('AdminPageHeader', () => {
    it('sets the Head title and uses it as the h1 when no heading is given', () => {
        const wrapper = mount(AdminPageHeader, {
            props: { title: 'Products' },
        });

        expectRendersPageTitle(wrapper, 'Products');
        expect(wrapper.find('h1').text()).toBe('Products');
    });

    it('uses a distinct heading for the h1 when given, independent of the Head title', () => {
        const wrapper = mount(AdminPageHeader, {
            props: {
                title: 'admin.products.pageTitle',
                heading: 'admin.products.heading',
            },
        });

        expectRendersPageTitle(wrapper, 'admin.products.pageTitle');
        expect(wrapper.find('h1').text()).toBe('admin.products.heading');
    });

    it('renders the default slot inside the layout', () => {
        const wrapper = mount(AdminPageHeader, {
            props: { title: 'Products' },
            slots: { default: '<div class="body">body content</div>' },
        });

        expect(wrapper.find('.body').exists()).toBe(true);
    });

    it('renders a plain heading with no wrapping row when no actions slot is provided', () => {
        const wrapper = mount(AdminPageHeader, {
            props: { title: 'Products' },
        });

        const heading = wrapper.find('h1').element;
        expect(
            heading.parentElement?.classList.contains('justify-between'),
        ).toBe(false);
    });

    it('renders the actions slot alongside the heading when provided', () => {
        const wrapper = mount(AdminPageHeader, {
            props: { title: 'Products' },
            slots: {
                actions: '<button class="create-action">Create</button>',
            },
        });

        const header = wrapper.find('h1').element.parentElement;

        expect(header?.classList.contains('justify-between')).toBe(true);
        expect(header?.querySelector('.create-action')).not.toBeNull();
    });

    it('renders inside the AdminLayout component', () => {
        const wrapper = mount(AdminPageHeader, {
            props: { title: 'Products' },
        });

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
    });
});
