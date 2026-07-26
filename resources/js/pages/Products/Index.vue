<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import type {
    CatalogCategory,
    CatalogFilters,
    CatalogProductsPayload,
    FilterPayload,
} from '@/components/shop/catalog';
import CatalogLayout from '@/components/shop/CatalogLayout.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';

interface Props {
    products: CatalogProductsPayload;
    filters: CatalogFilters;
    categories?: CatalogCategory[];
}

defineProps<Props>();

function applyFilters(filters: FilterPayload): void {
    router.get(route('home'), filters, {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head :title="t('shop.products.pageTitle')" />

    <ShopLayout>
        <CatalogLayout
            :heading="t('shop.products.heading')"
            :description="t('shop.products.description')"
            :products="products"
            :filters="filters"
            :categories="categories"
            :empty-message="t('shop.products.empty')"
            :apply-filters="applyFilters"
        />
    </ShopLayout>
</template>
