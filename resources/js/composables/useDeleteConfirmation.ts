import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

export function useDeleteConfirmation<T = number>(
    buildRoute: (id: T) => string,
) {
    const confirmingId = ref<T | null>(null);
    const deleting = ref(false);

    function confirmDelete(id: T): void {
        confirmingId.value = id;
    }

    function cancel(): void {
        confirmingId.value = null;
    }

    function destroy(): void {
        if (confirmingId.value === null) {
            return;
        }

        deleting.value = true;

        router.delete(buildRoute(confirmingId.value), {
            preserveScroll: true,
            onFinish: () => {
                deleting.value = false;
                confirmingId.value = null;
            },
        });
    }

    return { confirmingId, deleting, confirmDelete, cancel, destroy };
}
