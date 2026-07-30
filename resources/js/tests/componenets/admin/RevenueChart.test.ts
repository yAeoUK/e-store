import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-chartjs', () => ({
    Line: { name: 'Line', props: ['data', 'options'], template: '<canvas />' },
}));

import { Line } from 'vue-chartjs';
import RevenueChart from '@/components/admin/RevenueChart.vue';

describe('RevenueChart', () => {
    it('maps revenue-by-day points into Chart.js labels and data', () => {
        const wrapper = mount(RevenueChart, {
            props: {
                data: [
                    { date: '2026-07-01', revenue: '10.50', orders_count: 1 },
                    { date: '2026-07-02', revenue: 20, orders_count: 2 },
                ],
            },
        });

        const line = wrapper.findComponent(Line);
        expect(line.exists()).toBe(true);

        const chartData = line.props('data') as {
            labels: string[];
            datasets: Array<{ data: number[] }>;
        };

        expect(chartData.labels).toEqual(['2026-07-01', '2026-07-02']);
        expect(chartData.datasets[0].data).toEqual([10.5, 20]);
    });
});
