<script setup lang="ts">
import { ref } from 'vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SelectField from '@/components/SelectField.vue';
import { t } from '@/i18n';
import { cardSurfaceClass } from '../classNames';

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
    <form
        @submit.prevent="applyFilters"
        :class="[
            cardSurfaceClass,
            'bg-slate-50 p-4 shadow-sm dark:shadow-none',
        ]"
    >
        <div class="grid gap-4 md:grid-cols-4">
            <FormField
                v-model="localFilters.search"
                type="text"
                :label="t('shop.products.filters.search')"
                :placeholder="t('shop.products.filters.searchPlaceholder')"
            />

            <SelectField
                id="category_id"
                v-model="localFilters.category_id"
                :label="t('shop.products.filters.category')"
            >
                <option value="">
                    {{ t('shop.products.filters.allCategories') }}
                </option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </SelectField>

            <FormField
                v-model="localFilters.min_price"
                type="number"
                min="0"
                step="0.01"
                :label="t('shop.products.filters.minPrice')"
            />

            <FormField
                v-model="localFilters.max_price"
                type="number"
                min="0"
                step="0.01"
                :label="t('shop.products.filters.maxPrice')"
            />
        </div>

        <div class="mt-4 flex justify-end">
            <PrimaryButton type="submit">
                {{ t('shop.products.filters.apply') }}
            </PrimaryButton>
        </div>
    </form>
</template>
