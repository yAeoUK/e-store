export type VariantOptions = Record<string, string | number>;

export interface ProductImage {
    url: string;
    alt_text?: string | null;
}

export interface ProductVariant {
    id: number;
    sku: string;
    options?: VariantOptions | null;
    stock?: number | null;
    is_active: boolean;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number | string;
    description?: string | null;
    short_description?: string | null;
    stock?: number | null;
    category?: {
        name?: string | null;
    } | null;
    images?: ProductImage[];
    variants?: ProductVariant[];
}
