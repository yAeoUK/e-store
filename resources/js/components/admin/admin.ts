export type { PaginationLink, Paginated } from '@/components/Pagination.vue';

export interface DataTableColumn<Row> {
    key: string;
    label: string;
    align?: 'start' | 'center' | 'end';
    render?: (row: Row) => string;
}

export interface AdminCategoryRef {
    id: number;
    name: string;
}

export interface AdminProductImage {
    id: number;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
}

export interface AdminProductVariant {
    id: number;
    sku: string;
    options: Record<string, string> | null;
    price: number | string | null;
    stock: number;
    is_active: boolean;
}

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    price: number | string;
    stock: number;
    is_active: boolean;
    category?: AdminCategoryRef | null;
    images?: AdminProductImage[];
    variants?: AdminProductVariant[];
}

export interface AdminCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: number | null;
    parent?: AdminCategoryRef | null;
    products_count?: number;
    children_count?: number;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
    orders_count?: number;
    is_admin: boolean;
}

export interface AdminAdmin {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface AdminOrder {
    id: number;
    total: number | string;
    status: string;
    created_at: string;
    user?: { id: number; name: string; email: string } | null;
}

export interface DashboardStats {
    total_products: number;
    total_categories: number;
    total_users: number;
    low_stock_products: number;
    out_of_stock_products: number;
    total_orders: number;
    total_revenue: number | string;
}

export interface RevenueByDayPoint {
    date: string;
    revenue: number | string;
    orders_count: number | string;
}

export interface TopCategoryStat {
    id: number;
    name: string;
    products_count: number;
}
