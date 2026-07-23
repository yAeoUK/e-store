<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/i18n';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import InputLabel from '../InputLabel.vue';
import { formFieldClass, cardSurfaceClass } from '../classNames';

const props = defineProps<{
    categories?: Array<{ id: number; name: string; slug?: string }>;
    filters?: {
        search?: string | null;
        category_id?: number | null;
        min_price?: number | null;
        max_price?: number | null;
    };
}>();

const emit = defineEmits<{
    (e: 'apply', value: Record<string, string | number | null>): void;
}>();

const localFilters = ref({
    search: props.filters?.search ?? '',
    category_id: props.filters?.category_id ?? '',
    min_price: props.filters?.min_price ?? '',
    max_price: props.filters?.max_price ?? '',
});

function applyFilters(): void {
    emit('apply', {
        search: localFilters.value.search || null,
        category_id: localFilters.value.category_id || null,
        min_price: localFilters.value.min_price || null,
        max_price: localFilters.value.max_price || null,
    });
}
</script>

<template>
    <form @submit.prevent="applyFilters" :class="[cardSurfaceClass, 'bg-slate-50 p-4 shadow-sm dark:shadow-none']">
        <div class="grid gap-4 md:grid-cols-4">
            <div>
                <InputLabel for="search">{{ t('shop.products.filters.search') }}</InputLabel>
                <TextInput v-model="localFilters.search" type="text" :placeholder="t('shop.products.filters.searchPlaceholder')" />
            </div>

            <div>
                <InputLabel for="category_id">{{ t('shop.products.filters.category') }}</InputLabel>
                <select v-model="localFilters.category_id" :class="formFieldClass">
                    <option value="">{{ t('shop.products.filters.allCategories') }}</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div>
                <InputLabel for="min_price">{{ t('shop.products.filters.minPrice') }}</InputLabel>
                <TextInput v-model="localFilters.min_price" type="number" min="0" step="0.01" />
            </div>

            <div>
                <InputLabel for="max_price">{{ t('shop.products.filters.maxPrice') }}</InputLabel>
                <TextInput v-model="localFilters.max_price" type="number" min="0" step="0.01" />
            </div>
        </div>

        <div class="mt-4 flex justify-end">
            <PrimaryButton type="submit">
                {{ t('shop.products.filters.apply') }}
            </PrimaryButton>
        </div>
    </form>
</template>
