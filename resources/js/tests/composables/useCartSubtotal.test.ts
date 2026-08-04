import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { useCartSubtotal } from '@/composables/useCartSubtotal';

describe('useCartSubtotal', () => {
    it('is zero for an empty cart', () => {
        const subtotal = useCartSubtotal(() => []);

        expect(subtotal.value).toBe(0);
    });

    it('sums unit_price times quantity across items', () => {
        const subtotal = useCartSubtotal(() => [
            { unit_price: 9.99, quantity: 2 },
            { unit_price: '5.00', quantity: 3 },
        ]);

        expect(subtotal.value).toBeCloseTo(34.98);
    });

    it('coerces string unit prices to numbers', () => {
        const subtotal = useCartSubtotal(() => [
            { unit_price: '10.50', quantity: 3 },
        ]);

        expect(subtotal.value).toBe(31.5);
    });

    it('stays reactive to the underlying items', () => {
        const state = reactive({ items: [{ unit_price: 10, quantity: 1 }] });
        const subtotal = useCartSubtotal(() => state.items);

        expect(subtotal.value).toBe(10);

        state.items = [{ unit_price: 10, quantity: 3 }];

        expect(subtotal.value).toBe(30);
    });
});
