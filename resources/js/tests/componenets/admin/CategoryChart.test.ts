import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-chartjs', () => ({
    Bar: { name: 'Bar', props: ['data', 'options'], template: '<canvas />' },
}));

import { Bar } from 'vue-chartjs';
import CategoryChart from '@/components/admin/CategoryChart.vue';

describe('CategoryChart', () => {
    it('maps top-category stats into Chart.js labels and data', () => {
        const wrapper = mount(CategoryChart, {
            props: {
                data: [
                    { id: 1, name: 'Electronics', products_count: 5 },
                    { id: 2, name: 'Books', products_count: 3 },
                ],
            },
        });

        const bar = wrapper.findComponent(Bar);
        expect(bar.exists()).toBe(true);

        const chartData = bar.props('data') as {
            labels: string[];
            datasets: Array<{ data: number[] }>;
        };

        expect(chartData.labels).toEqual(['Electronics', 'Books']);
        expect(chartData.datasets[0].data).toEqual([5, 3]);
    });
});
