<script setup lang="ts">
import { computed } from 'vue';
import { t } from '@/i18n';

interface ProductImage {
    id?: number;
    url: string;
    alt_text?: string | null;
}

const props = defineProps<{
    images?: ProductImage[];
    title?: string;
}>();

const selectedImage = defineModel<string | null>('selectedImage');

const images = computed(() => {
    if (!props.images || props.images.length === 0) {
        return [{ url: 'https://placehold.co/600x600?text=Product', alt_text: props.title ?? t('common.productImage') }];
    }

    return props.images;
});

if (!selectedImage.value) {
    selectedImage.value = images.value[0]?.url ?? null;
}
</script>

<template>
    <div class="space-y-4">
        <img
            v-if="selectedImage"
            :src="selectedImage"
            :alt="title ?? t('common.productImage')"
            class="h-[420px] w-full rounded-xl border border-slate-200 object-cover"
        />

        <div v-if="images.length > 1" class="flex flex-wrap gap-3">
            <button
                v-for="image in images"
                :key="image.url"
                type="button"
                @click="selectedImage = image.url"
                class="h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
            >
                <img :src="image.url" :alt="image.alt_text ?? title ?? t('common.productImage')" class="h-full w-full object-cover" />
            </button>
        </div>
    </div>
</template>
