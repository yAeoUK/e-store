<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { t } from '@/i18n';

interface ProductImage {
    url: string;
    alt_text?: string | null;
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
    images?: ProductImage[];
}

const props = defineProps<{
    product: Product;
}>();

const imageUrl = props.product.images?.[0]?.url ?? 'https://placehold.co/600x600?text=Product';
const imageAlt = props.product.images?.[0]?.alt_text ?? props.product.name;
</script>

<template>
    <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <Link :href="`/products/${product.slug}`" class="block">
            <img :src="imageUrl" :alt="imageAlt" class="h-56 w-full object-cover" />
        </Link>

        <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-2">
                <span v-if="product.category?.name" class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {{ product.category.name }}
                </span>
                <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    ${{ Number(product.price).toFixed(2) }}
                </span>
            </div>

            <Link :href="`/products/${product.slug}`" class="block">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ product.name }}</h3>
            </Link>

            <p v-if="product.short_description" class="text-sm text-slate-600 dark:text-slate-400">
                {{ product.short_description }}
            </p>

            <Link :href="`/products/${product.slug}`" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                {{ t('common.viewProduct') }}
            </Link>
        </div>
    </article>
</template>
