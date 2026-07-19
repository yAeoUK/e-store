<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import ProductCard from '@/components/shop/ProductCard.vue';
import ProductFilters from '@/components/shop/ProductFilters.vue';
import CategoryNavigation from '@/components/shop/CategoryNavigation.vue';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
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
    category?: Category;
    products: {
        data: Product[];
        links?: Array<{ url?: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string | null;
        min_price?: number | null;
        max_price?: number | null;
    };
    categories?: Category[];
}

const props = defineProps<Props>();

function applyFilters(filters: Record<string, string | number | null>): void {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            query.set(key, String(value));
        }
    });

    router.get(`/categories/${props.category?.slug ?? ''}`, query, {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head :title="category?.name || 'Categories'" />

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-8">
            <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ category?.name || 'Categories' }}</h1>
            <p v-if="category?.description" class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ category.description }}</p>
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
                    No products found in this category.
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
