<script setup lang="ts">
import { SearchX } from '@lucide/vue';
import {
    borderColorClass,
    headingTextClass,
    surfaceBgClass,
} from '@/components/classNames';
import EmptyState from '@/components/EmptyState.vue';
import MutedText from '@/components/MutedText.vue';
import PageContainer from '@/components/PageContainer.vue';
import Pagination from '@/components/Pagination.vue';
import type {
    CatalogCategory,
    CatalogFilters,
    CatalogProductsPayload,
    FilterPayload,
} from '@/components/shop/catalog';
import CategoryNavigation from '@/components/shop/CategoryNavigation.vue';
import ProductCard from '@/components/shop/ProductCard.vue';
import ProductFilters from '@/components/shop/ProductFilters.vue';

interface Props {
    heading: string;
    description?: string | null;
    products: CatalogProductsPayload;
    filters: CatalogFilters;
    categories?: CatalogCategory[];
    emptyMessage: string;
    applyFilters: (filters: FilterPayload) => void;
}

const props = defineProps<Props>();

function handleApplyFilters(filters: FilterPayload): void {
    props.applyFilters(filters);
}
</script>

<template>
    <PageContainer>
        <div
            class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
            <div>
                <h1 :class="['text-3xl font-semibold', headingTextClass]">
                    {{ heading }}
                </h1>
                <MutedText v-if="description" class="mt-2">{{
                    description
                }}</MutedText>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div>
                <CategoryNavigation :categories="categories" />
            </div>

            <div class="space-y-6">
                <ProductFilters
                    :categories="categories"
                    :filters="filters"
                    @apply="handleApplyFilters"
                />

                <div
                    v-if="products.data.length"
                    class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                    <ProductCard
                        v-for="product in products.data"
                        :key="product.id"
                        :product="product"
                    />
                </div>

                <EmptyState
                    v-else
                    :icon="SearchX"
                    :class="[
                        borderColorClass,
                        surfaceBgClass,
                        'rounded-xl border border-dashed p-8 text-center',
                    ]"
                >
                    <MutedText>{{ emptyMessage }}</MutedText>
                </EmptyState>

                <Pagination :links="products.links" />
            </div>
        </div>
    </PageContainer>
</template>
