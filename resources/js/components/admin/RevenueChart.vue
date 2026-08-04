<script setup lang="ts">
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { useChartColor } from '@/composables/useChartColor';
import type { RevenueByDayPoint } from './admin';
import { chartOptions } from './chartOptions';

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Filler,
);

const props = defineProps<{
    data: RevenueByDayPoint[];
}>();

const lineColor = useChartColor('--color-chart-1', 'rgb(99, 102, 241)');

const chartData = computed(() => ({
    labels: props.data.map((point) => point.date),
    datasets: [
        {
            data: props.data.map((point) => Number(point.revenue)),
            borderColor: lineColor.value,
            backgroundColor: lineColor.value,
            tension: 0.3,
            fill: false,
        },
    ],
}));
</script>

<template>
    <Line :data="chartData" :options="chartOptions" />
</template>
