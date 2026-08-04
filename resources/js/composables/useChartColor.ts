import { onMounted, ref } from 'vue';

export function useChartColor(cssVariable: string, fallback: string) {
    const color = ref(fallback);

    onMounted(() => {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(cssVariable)
            .trim();

        if (value) {
            color.value = value;
        }
    });

    return color;
}
