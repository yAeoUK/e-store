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
import { computed, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import type { RevenueByDayPoint } from './admin';

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

const lineColor = ref('rgb(99, 102, 241)');

onMounted(() => {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-chart-1')
        .trim();

    if (value) {
        lineColor.value = value;
    }
});

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

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: { beginAtZero: true },
    },
};
</script>

<template>
    <div class="h-64">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
