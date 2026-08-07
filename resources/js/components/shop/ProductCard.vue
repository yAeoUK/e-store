<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    cardSurfaceClass,
    compactHeadingClass,
    eyebrowTextClass,
    subheadingTextClass,
} from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';
import { t } from '@/i18n';
import { formatCurrency, PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/format';
import type { Product } from '@/types/product';

const props = defineProps<{
    product: Product;
}>();

const imageUrl = props.product.images?.[0]?.url ?? PRODUCT_IMAGE_PLACEHOLDER;
const imageAlt = props.product.images?.[0]?.alt_text ?? props.product.name;
const productUrl = computed(() => `/products/${props.product.slug}`);
</script>

<template>
    <article
        :class="[
            cardSurfaceClass,
            'overflow-hidden bg-white shadow-sm transition hover:shadow-md dark:shadow-none',
        ]"
    >
        <Link :href="productUrl" class="block">
            <img
                :src="imageUrl"
                :alt="imageAlt"
                class="h-56 w-full object-cover"
            />
        </Link>

        <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-2">
                <span v-if="product.category?.name" :class="eyebrowTextClass">
                    {{ product.category.name }}
                </span>
                <span :class="compactHeadingClass">
                    {{ formatCurrency(product.price) }}
                </span>
            </div>

            <Link :href="productUrl" class="block">
                <h3 :class="subheadingTextClass">
                    {{ product.name }}
                </h3>
            </Link>

            <MutedText v-if="product.short_description">
                {{ product.short_description }}
            </MutedText>

            <Link
                :href="productUrl"
                class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                {{ t('common.viewProduct') }}
            </Link>
        </div>
    </article>
</template>
