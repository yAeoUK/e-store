import { router } from '@inertiajs/vue3';
import { reactive } from 'vue';

type FilterValue = string | number;

export function useFilterForm<T extends Record<string, FilterValue>>(
    filters:
        Partial<Record<keyof T, FilterValue | null | undefined>> | undefined,
    defaults: T,
) {
    const state = reactive({ ...defaults }) as T;

    for (const key in defaults) {
        const value = filters?.[key];

        if (value !== null && value !== undefined) {
            state[key] = value as T[typeof key];
        }
    }

    function normalize(): Record<keyof T, FilterValue | null> {
        const result = {} as Record<keyof T, FilterValue | null>;

        for (const key in defaults) {
            result[key] = state[key] || null;
        }

        return result;
    }

    return { state, normalize };
}

export function submitFilters(
    routeName: string,
    params: Record<string, FilterValue | null>,
): void {
    router.get(route(routeName), params, {
        preserveState: true,
        replace: true,
    });
}
