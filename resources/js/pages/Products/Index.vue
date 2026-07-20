<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { t } from '@/i18n';
import CatalogLayout from '@/components/shop/CatalogLayout.vue';
import type { CatalogCategory, CatalogFilters, CatalogProductsPayload, FilterPayload } from '@/components/shop/catalog';

interface Props {
    products: CatalogProductsPayload;
    filters: CatalogFilters;
    categories?: CatalogCategory[];
}

const props = defineProps<Props>();

function applyFilters(filters: FilterPayload): void {
    router.get('/products', filters, {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head :title="t('shop.products.pageTitle')" />

    <CatalogLayout
        :heading="t('shop.products.heading')"
        :description="t('shop.products.description')"
        :products="products"
        :filters="filters"
        :categories="categories"
        :empty-message="t('shop.products.empty')"
        :apply-filters="applyFilters"
    />
</template>
