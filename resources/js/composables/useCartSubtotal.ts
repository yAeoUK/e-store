import { computed } from 'vue';
import type { ComputedRef } from 'vue';

function sumOrderItems(
    items: { unit_price: number | string; quantity: number }[],
): number {
    return items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
    );
}

export function useCartSubtotal(
    items: () => { unit_price: number | string; quantity: number }[],
): ComputedRef<number> {
    return computed(() => sumOrderItems(items()));
}
