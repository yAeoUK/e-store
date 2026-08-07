import { usePage } from '@inertiajs/vue3';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import { useServerError } from '@/composables/useServerError';
import { pageWith } from '../utils';

describe('useServerError', () => {
    it('returns null when there are no flashed errors', () => {
        vi.mocked(usePage).mockReturnValue(pageWith({ errors: {} }));

        expect(useServerError('stock').value).toBeNull();
    });

    it('returns null when the key is absent from the errors object', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ errors: { email: 'Required.' } }),
        );

        expect(useServerError('stock').value).toBeNull();
    });

    it('returns the flashed error for the given key', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ errors: { stock: 'Out of stock.' } }),
        );

        expect(useServerError('stock').value).toBe('Out of stock.');
    });

    it('stays reactive as the page object mutates in place, like Inertia does on navigation', () => {
        const page = reactive(pageWith({ errors: {} }));
        vi.mocked(usePage).mockReturnValue(page);

        const error = useServerError('stock');
        expect(error.value).toBeNull();

        page.props.errors = {
            stock: 'Out of stock.',
        } as unknown as typeof page.props.errors;

        expect(error.value).toBe('Out of stock.');
    });
});
