import type { ProductImage, VariantOptions } from '@/types/product';

export interface Cart<TItem> {
    id: number;
    order_items: TItem[];
}

export interface CartOrderItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    product: {
        id: number;
        name: string;
        slug: string;
        images?: ProductImage[];
    };
    product_variant: {
        id: number;
        sku: string;
        options?: VariantOptions | null;
    } | null;
}
