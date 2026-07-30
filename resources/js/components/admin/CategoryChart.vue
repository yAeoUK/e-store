<script setup lang="ts">
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { computed, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import type { TopCategoryStat } from './admin';

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

const barColor = ref('rgb(99, 102, 241)');

onMounted(() => {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-chart-2')
        .trim();

    if (value) {
        barColor.value = value;
    }
});

const chartData = computed(() => ({
    labels: props.data.map((category) => category.name),
    datasets: [
        {
            data: props.data.map((category) => category.products_count),
            backgroundColor: barColor.value,
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
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>
