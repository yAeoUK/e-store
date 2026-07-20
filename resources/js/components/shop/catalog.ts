export interface CatalogCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    children?: CatalogCategory[];
}

export interface CatalogProduct {
    id: number;
    name: string;
    slug: string;
    price: number | string;
    short_description?: string | null;
    category?: {
        name?: string | null;
    } | null;
    images?: Array<{ url: string; alt_text?: string | null }>;
}

export interface CatalogProductsPayload {
    data: CatalogProduct[];
    links?: Array<{ url?: string | null; label: string; active: boolean }>;
}

export interface CatalogFilters {
    search?: string | null;
    category_id?: number | null;
    min_price?: number | null;
    max_price?: number | null;
}

export type FilterValue = string | number | null;
export type FilterPayload = Record<string, FilterValue>;
