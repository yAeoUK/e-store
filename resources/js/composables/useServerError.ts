import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

/**
 * Surfaces a server-flashed error for the given key (e.g. from
 * `back()->with('errors', [...])` on a failed action), or null if absent.
 */
export function useServerError(key: string) {
    const page = usePage();

    return computed(() => page.props.errors?.[key] ?? null);
}
