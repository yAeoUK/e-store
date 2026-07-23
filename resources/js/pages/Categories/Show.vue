<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import CatalogLayout from '@/components/shop/CatalogLayout.vue';
import type { CatalogCategory, CatalogFilters, CatalogProductsPayload, FilterPayload } from '@/components/shop/catalog';

interface Props {
    category?: CatalogCategory;
    products: CatalogProductsPayload;
    filters: Omit<CatalogFilters, 'category_id'>;
    categories?: CatalogCategory[];
}

const props = defineProps<Props>();

function applyFilters(filters: FilterPayload): void {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            query.set(key, String(value));
        }
    });

    router.get(`/categories/${props.category?.slug ?? ''}`, Object.fromEntries(query.entries()), {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head :title="category?.name || t('shop.categories.pageTitle')" />

    <ShopLayout>
        <CatalogLayout
            :heading="category?.name || t('shop.categories.pageTitle')"
            :description="category?.description"
            :products="products"
            :filters="filters"
            :categories="categories"
            :empty-message="t('shop.products.categoryEmpty')"
            :apply-filters="applyFilters"
        />
    </ShopLayout>
</template>
