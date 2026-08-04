<script setup lang="ts">
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useChartColor } from '@/composables/useChartColor';
import type { TopCategoryStat } from './admin';
import { chartOptions } from './chartOptions';

ChartJS.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
);

const props = defineProps<{
    data: TopCategoryStat[];
}>();

const barColor = useChartColor('--color-chart-2', 'rgb(99, 102, 241)');

const chartData = computed(() => ({
    labels: props.data.map((category) => category.name),
    datasets: [
        {
            data: props.data.map((category) => category.products_count),
            backgroundColor: barColor.value,
        },
    ],
}));
</script>

<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>
