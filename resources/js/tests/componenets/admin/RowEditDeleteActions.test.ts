import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RowEditDeleteActions from '@/components/admin/RowEditDeleteActions.vue';

describe('RowEditDeleteActions', () => {
    it('renders an edit link pointing to the given href', () => {
        const wrapper = mount(RowEditDeleteActions, {
            props: { editHref: '/admin/products/1/edit' },
        });

        const link = wrapper.findComponent({ name: 'Link' });

        expect(link.props('href')).toBe('/admin/products/1/edit');
    });

    it('emits delete when the delete button is clicked', async () => {
        const wrapper = mount(RowEditDeleteActions, {
            props: { editHref: '/admin/products/1/edit' },
        });

        await wrapper.findComponent({ name: 'DangerButton' }).trigger('click');

        expect(wrapper.emitted('delete')).toHaveLength(1);
    });
});
