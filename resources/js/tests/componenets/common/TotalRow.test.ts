import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TotalRow from '@/components/TotalRow.vue';

describe('TotalRow', () => {
    it('renders the label', () => {
        const wrapper = mount(TotalRow, {
            props: { label: 'Subtotal', total: 0 },
        });

        expect(wrapper.text()).toContain('Subtotal');
    });

    it('formats a numeric total as currency', () => {
        const wrapper = mount(TotalRow, {
            props: { label: 'Total', total: 39.98 },
        });

        expect(wrapper.text()).toContain('$39.98');
    });

    it('formats a string total as currency', () => {
        const wrapper = mount(TotalRow, {
            props: { label: 'Total', total: '59.98' },
        });

        expect(wrapper.text()).toContain('$59.98');
    });
});
