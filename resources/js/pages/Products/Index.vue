<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { t } from '@/i18n';
import ProductCard from '@/components/shop/ProductCard.vue';
import ProductFilters from '@/components/shop/ProductFilters.vue';
import CategoryNavigation from '@/components/shop/CategoryNavigation.vue';

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

interface Product {
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

interface Props {
    products: {
        data: Product[];
        links?: Array<{ url?: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string | null;
        category_id?: number | null;
        min_price?: number | null;
        max_price?: number | null;
    };
    categories?: Category[];
}

const props = defineProps<Props>();

function applyFilters(filters: Record<string, string | number | null>): void {
    router.get('/products', filters, {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head :title="t('shop.products.pageTitle')" />

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t('shop.products.heading') }}</h1>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t('shop.products.description') }}</p>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div class="space-y-6">
                <CategoryNavigation :categories="categories" />
            </div>

            <div class="space-y-6">
                <ProductFilters :categories="categories" :filters="filters" @apply="applyFilters" />

                <div v-if="products.data.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <ProductCard v-for="product in products.data" :key="product.id" :product="product" />
                </div>

                <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                    {{ t('shop.products.empty') }}
                </div>

                <nav v-if="products.links?.length" class="flex flex-wrap items-center gap-2">
                    <a
                        v-for="link in products.links"
                        :key="link.label"
                        :href="link.url ?? ''"
                        class="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                        :class="link.active ? 'bg-slate-900 text-white dark:bg-indigo-600' : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800'"
                    >
                        <span v-html="link.label"></span>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</template>
