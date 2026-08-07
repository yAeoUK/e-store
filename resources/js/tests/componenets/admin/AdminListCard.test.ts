import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdminListCard from '@/components/admin/AdminListCard.vue';

describe('AdminListCard', () => {
    it('shows the empty message when empty', () => {
        const wrapper = mount(AdminListCard, {
            props: { empty: true, emptyMessage: 'No products found' },
        });

        expect(wrapper.text()).toContain('No products found');
    });

    it('hides the empty message when not empty', () => {
        const wrapper = mount(AdminListCard, {
            props: { empty: false, emptyMessage: 'No products found' },
        });

        expect(wrapper.text()).not.toContain('No products found');
    });

    it('renders the default slot content', () => {
        const wrapper = mount(AdminListCard, {
            props: { empty: false, emptyMessage: 'No products found' },
            slots: { default: '<p>List content</p>' },
        });

        expect(wrapper.find('p').text()).toBe('List content');
    });
});
