import { router } from '@inertiajs/vue3';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';

beforeEach(() => {
    vi.mocked(router.delete).mockReset();
});

describe('useDeleteConfirmation', () => {
    it('starts with nothing pending', () => {
        const { confirmingId, deleting } = useDeleteConfirmation<number>(
            (id) => `/items/${id}`,
        );

        expect(confirmingId.value).toBeNull();
        expect(deleting.value).toBe(false);
    });

    it('confirmDelete records the pending id, cancel clears it', () => {
        const { confirmingId, confirmDelete, cancel } =
            useDeleteConfirmation<number>((id) => `/items/${id}`);

        confirmDelete(5);
        expect(confirmingId.value).toBe(5);

        cancel();
        expect(confirmingId.value).toBeNull();
    });

    it('destroy is a no-op when no id is confirmed', () => {
        const { destroy } = useDeleteConfirmation<number>(
            (id) => `/items/${id}`,
        );

        destroy();

        expect(router.delete).not.toHaveBeenCalled();
    });

    it('destroy deletes the confirmed id and sets deleting while in flight', () => {
        vi.mocked(router.delete).mockImplementation(() => undefined);

        const { deleting, confirmDelete, destroy } =
            useDeleteConfirmation<number>((id) => `/items/${id}`);

        confirmDelete(3);
        destroy();

        expect(router.delete).toHaveBeenCalledWith(
            '/items/3',
            expect.objectContaining({ preserveScroll: true }),
        );
        expect(deleting.value).toBe(true);
    });

    it('resets deleting and confirmingId once the request finishes', () => {
        vi.mocked(router.delete).mockImplementation((_url, options) => {
            (options as { onFinish?: () => void })?.onFinish?.();
        });

        const { confirmingId, deleting, confirmDelete, destroy } =
            useDeleteConfirmation<number>((id) => `/items/${id}`);

        confirmDelete(7);
        destroy();

        expect(deleting.value).toBe(false);
        expect(confirmingId.value).toBeNull();
    });
});
