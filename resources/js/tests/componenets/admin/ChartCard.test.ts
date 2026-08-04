import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ChartCard from '@/components/admin/ChartCard.vue';

describe('ChartCard', () => {
    it('renders the title and the default slot content', () => {
        const wrapper = mount(ChartCard, {
            props: { title: 'Revenue' },
            slots: { default: '<p>chart content</p>' },
        });

        expect(wrapper.find('h2').text()).toBe('Revenue');
        expect(wrapper.html()).toContain('<p>chart content</p>');
    });
});
