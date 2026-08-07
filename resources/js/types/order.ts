import type { AddressSnapshot } from '@/types/address';
import type { VariantOptions } from '@/types/product';

export interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    product_snapshot: {
        name: string;
        slug: string;
        image_url?: string | null;
        category?: { name: string; slug: string } | null;
        variant?: {
            sku: string;
            options?: VariantOptions | null;
        } | null;
    } | null;
}

export interface OrderDetail {
    id: number;
    status: string;
    total: number | string;
    payment_method: string | null;
    payment_status: string;
    created_at: string;
    shipping_address_snapshot: AddressSnapshot | null;
    customer_note: string | null;
    order_items: OrderItem[];
}
