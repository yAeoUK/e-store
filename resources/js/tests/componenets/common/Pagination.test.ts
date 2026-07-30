import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination.vue';

describe('Pagination', () => {
    it('renders nothing when there are no links', () => {
        const wrapper = mount(Pagination, { props: { links: [] } });

        expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('renders one link per entry, marking the active one', () => {
        const wrapper = mount(Pagination, {
            props: {
                links: [
                    {
                        url: '/?page=1',
                        label: '&laquo; Previous',
                        active: false,
                    },
                    { url: '/?page=1', label: '1', active: true },
                    { url: '/?page=2', label: '2', active: false },
                ],
            },
        });

        const links = wrapper.findAll('a');
        expect(links).toHaveLength(3);
        expect(links[1].classes()).toContain('text-white');
        expect(links[2].classes()).not.toContain('text-white');
    });

    it('still renders a link element for entries with a null url', () => {
        const wrapper = mount(Pagination, {
            props: {
                links: [
                    { url: null, label: '&laquo; Previous', active: false },
                ],
            },
        });

        expect(wrapper.find('a').attributes('href')).toBe('');
    });
});
