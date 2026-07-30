<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import {
    cardSurfaceClass,
    errorTextClass,
    headingTextClass,
    mutedBodyTextClass,
    mutedTextClass,
    subheadingTextClass,
} from '@/components/classNames';
import LabelText from '@/components/LabelText.vue';
import MutedText from '@/components/MutedText.vue';
import PageContainer from '@/components/PageContainer.vue';
import ProductGallery from '@/components/shop/ProductGallery.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';

interface ProductImage {
    url: string;
    alt_text?: string | null;
}

interface ProductVariant {
    sku: string;
    options?: Record<string, string | number> | null;
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

defineProps<{ product: Product }>();
const selectedImage = ref<string | null>(null);
</script>

<template>
    <Head :title="product.name" />

    <ShopLayout>
        <PageContainer>
            <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <ProductGallery
                    :images="product.images"
                    :title="product.name"
                    v-model:selected-image="selectedImage"
                />

                <div class="space-y-6">
                    <div>
                        <p
                            v-if="product.category?.name"
                            :class="[
                                mutedTextClass,
                                'text-sm font-medium tracking-wide uppercase',
                            ]"
                        >
                            {{ product.category.name }}
                        </p>
                        <h1
                            :class="[
                                'mt-2 text-3xl font-semibold',
                                headingTextClass,
                            ]"
                        >
                            {{ product.name }}
                        </h1>
                        <p
                            :class="[
                                'mt-4 text-base leading-7',
                                mutedBodyTextClass,
                            ]"
                        >
                            {{
                                product.description || product.short_description
                            }}
                        </p>
                    </div>

                    <div :class="[cardSurfaceClass, 'bg-slate-50 p-5']">
                        <div class="flex items-center justify-between">
                            <div>
                                <LabelText>{{ t('common.price') }}</LabelText>
                                <p
                                    :class="[
                                        'text-3xl font-semibold',
                                        headingTextClass,
                                    ]"
                                >
                                    ${{ Number(product.price).toFixed(2) }}
                                </p>
                            </div>
                            <div class="text-end">
                                <LabelText>{{
                                    t('common.availability')
                                }}</LabelText>
                                <p
                                    class="font-semibold"
                                    :class="
                                        product.stock && product.stock > 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : errorTextClass
                                    "
                                >
                                    {{
                                        product.stock && product.stock > 0
                                            ? t('common.inStock')
                                            : t('common.outOfStock')
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-if="product.variants?.length" class="space-y-3">
                        <h2 :class="subheadingTextClass">
                            {{ t('common.variants') }}
                        </h2>
                        <div class="grid gap-3 md:grid-cols-2">
                            <div
                                v-for="variant in product.variants"
                                :key="variant.sku"
                                :class="[cardSurfaceClass, 'p-4']"
                            >
                                <p
                                    :class="[
                                        'text-sm font-medium',
                                        headingTextClass,
                                    ]"
                                >
                                    {{ variant.sku }}
                                </p>
                                <MutedText v-if="variant.options" class="mt-1">
                                    {{
                                        Object.entries(variant.options)
                                            .map(
                                                ([key, value]) =>
                                                    `${key}: ${value}`,
                                            )
                                            .join(', ')
                                    }}
                                </MutedText>
                                <LabelText class="mt-2">
                                    {{ t('common.stock') }}:
                                    {{ variant.stock ?? 0 }}
                                </LabelText>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    </ShopLayout>
</template>
