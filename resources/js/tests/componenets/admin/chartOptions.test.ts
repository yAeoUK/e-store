import { describe, expect, it } from 'vitest';
import { chartOptions } from '@/components/admin/chartOptions';

describe('chartOptions', () => {
    it('disables the legend and always starts the y-axis at zero', () => {
        expect(chartOptions.responsive).toBe(true);
        expect(chartOptions.maintainAspectRatio).toBe(false);
        expect(chartOptions.plugins.legend.display).toBe(false);
        expect(chartOptions.scales.y.beginAtZero).toBe(true);
    });
});
