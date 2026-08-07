import { router } from '@inertiajs/vue3';
import { useConfirmAction } from '@/composables/useConfirmAction';

export function useDeleteConfirmation<T = number>(
    buildRoute: (id: T) => string,
) {
    const {
        confirming: confirmingId,
        processing: deleting,
        confirm: confirmDelete,
        cancel,
        run: destroy,
    } = useConfirmAction<T>((id, onFinish) =>
        router.delete(buildRoute(id), { preserveScroll: true, onFinish }),
    );

    return { confirmingId, deleting, confirmDelete, cancel, destroy };
}
