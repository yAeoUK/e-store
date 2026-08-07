<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ShoppingCart } from '@lucide/vue';
import { computed, ref } from 'vue';
import {
    cardSurfaceClass,
    errorTextClass,
    headingTextClass,
    mutedBodyTextClass,
    mutedBorderClass,
    mutedTextClass,
    subheadingTextClass,
} from '@/components/classNames';
import IconLabel from '@/components/IconLabel.vue';
import LabelText from '@/components/LabelText.vue';
import MutedText from '@/components/MutedText.vue';
import PageContainer from '@/components/PageContainer.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SelectField from '@/components/SelectField.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import {
    formatCurrency,
    formatVariantOptions,
    PRODUCT_IMAGE_PLACEHOLDER,
} from '@/lib/format';
import type { Product } from '@/types/product';

const props = defineProps<{ product: Product }>();

const galleryImages = computed(() => {
    if (!props.product.images || props.product.images.length === 0) {
        return [
            { url: PRODUCT_IMAGE_PLACEHOLDER, alt_text: props.product.name },
        ];
    }

    return props.product.images;
});
const selectedImage = ref<string | null>(galleryImages.value[0]?.url ?? null);

const activeVariants = computed(
    () => props.product.variants?.filter((variant) => variant.is_active) ?? [],
);
const selectedVariantId = ref<number | ''>(activeVariants.value[0]?.id ?? '');
const quantity = ref(1);

const selectedVariant = computed(() =>
    activeVariants.value.find(
        (variant) => variant.id === selectedVariantId.value,
    ),
);

const availableStock = computed(() =>
    activeVariants.value.length > 0
        ? (selectedVariant.value?.stock ?? 0)
        : (props.product.stock ?? 0),
);

const canAddToCart = computed(
    () =>
        availableStock.value > 0 &&
        (activeVariants.value.length === 0 || selectedVariantId.value !== ''),
);

function addToCart() {
    router.post(
        route('cart.items.store'),
        {
            product_id: props.product.id,
            product_variant_id: selectedVariantId.value || null,
            quantity: quantity.value,
        },
        { preserveScroll: true },
    );
}
</script>

<template>
    <Head :title="product.name" />

    <ShopLayout>
        <PageContainer>
            <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div class="space-y-4">
                    <img
                        v-if="selectedImage"
                        :src="selectedImage"
                        :alt="product.name"
                        :class="`h-[420px] w-full rounded-xl border object-cover ${mutedBorderClass}`"
                    />

                    <div
                        v-if="galleryImages.length > 1"
                        class="flex flex-wrap gap-3"
                    >
                        <button
                            v-for="image in galleryImages"
                            :key="image.url"
                            type="button"
                            @click="selectedImage = image.url"
                            :class="`h-20 w-20 overflow-hidden rounded-lg border bg-slate-50 dark:bg-slate-800 ${mutedBorderClass}`"
                        >
                            <img
                                :src="image.url"
                                :alt="image.alt_text ?? product.name"
                                class="h-full w-full object-cover"
                            />
                        </button>
                    </div>
                </div>

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
                                    {{ formatCurrency(product.price) }}
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
                                    {{ formatVariantOptions(variant.options) }}
                                </MutedText>
                                <LabelText class="mt-2">
                                    {{ t('common.stock') }}:
                                    {{ variant.stock ?? 0 }}
                                </LabelText>
                            </div>
                        </div>
                    </div>

                    <div :class="[cardSurfaceClass, 'space-y-4 p-5']">
                        <SelectField
                            v-if="activeVariants.length"
                            v-model="selectedVariantId"
                            :label="t('shop.cart.selectVariant')"
                        >
                            <option
                                v-for="variant in activeVariants"
                                :key="variant.id"
                                :value="variant.id"
                            >
                                {{ variant.sku }}
                            </option>
                        </SelectField>

                        <div class="flex items-end gap-3">
                            <div>
                                <LabelText>{{
                                    t('shop.cart.quantity')
                                }}</LabelText>
                                <input
                                    v-model.number="quantity"
                                    type="number"
                                    min="1"
                                    :max="availableStock"
                                    class="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                            </div>
                            <PrimaryButton
                                :disabled="!canAddToCart"
                                @click="addToCart"
                            >
                                <IconLabel
                                    :icon="
                                        canAddToCart ? ShoppingCart : undefined
                                    "
                                    >{{
                                        canAddToCart
                                            ? t('shop.cart.addToCart')
                                            : t('shop.cart.outOfStock')
                                    }}</IconLabel
                                >
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    </ShopLayout>
</template>
