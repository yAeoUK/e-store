<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { t } from '@/i18n';
import ProductGallery from '@/components/shop/ProductGallery.vue';
import { ref } from 'vue';

interface ProductImage {
    id?: number;
    url: string;
    alt_text?: string | null;
}

interface ProductVariant {
    id?: number;
    sku: string;
    options?: Record<string, string | number> | null;
    price?: number | string | null;
    stock?: number | null;
}

interface Product {
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

const props = defineProps<{ product: Product }>();
const selectedImage = ref<string | null>(null);
</script>

<template>
    <Head :title="product.name" />

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <ProductGallery :images="product.images" :title="product.name" v-model:selected-image="selectedImage" />

            <div class="space-y-6">
                <div>
                    <p v-if="product.category?.name" class="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        {{ product.category.name }}
                    </p>
                    <h1 class="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ product.name }}</h1>
                    <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{{ product.description || product.short_description }}</p>
                </div>

                <div class="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/80">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('common.price') }}</p>
                            <p class="text-3xl font-semibold text-slate-900 dark:text-slate-100">${{ Number(product.price).toFixed(2) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('common.availability') }}</p>
                            <p class="font-semibold" :class="product.stock && product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'">
                                {{ product.stock && product.stock > 0 ? t('common.inStock') : t('common.outOfStock') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="product.variants?.length" class="space-y-3">
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t('common.variants') }}</h2>
                    <div class="grid gap-3 md:grid-cols-2">
                        <div v-for="variant in product.variants" :key="variant.sku" class="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ variant.sku }}</p>
                            <p v-if="variant.options" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {{ Object.entries(variant.options).map(([key, value]) => `${key}: ${value}`).join(', ') }}
                            </p>
                            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {{ t('common.stock') }}: {{ variant.stock ?? 0 }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
