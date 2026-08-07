import type { VariantOptions } from '@/types/product';

export const PRODUCT_IMAGE_PLACEHOLDER =
    'https://placehold.co/600x600?text=Product';

export function formatCurrency(value: number | string): string {
    return `$${Number(value).toFixed(2)}`;
}

export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
}

export function formatVariantOptions(
    options: VariantOptions | null | undefined,
): string {
    return Object.entries(options ?? {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

export interface SummaryItem {
    id: number;
    name: string;
    variantOptions?: VariantOptions | null;
    quantity: number;
    unitPrice: number | string;
}

export function toSummaryItems<
    T extends { id: number; quantity: number; unit_price: number | string },
>(
    items: T[],
    getName: (item: T) => string,
    getVariantOptions: (item: T) => VariantOptions | null | undefined,
): SummaryItem[] {
    return items.map((item) => ({
        id: item.id,
        name: getName(item),
        variantOptions: getVariantOptions(item),
        quantity: item.quantity,
        unitPrice: item.unit_price,
    }));
}
