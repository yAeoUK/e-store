<script setup lang="ts">
import { ref } from 'vue';

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
    <form @submit.prevent="applyFilters" class="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <div class="grid gap-4 md:grid-cols-4">
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
                <input v-model="localFilters.search" type="text" placeholder="Search products" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500" />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select v-model="localFilters.category_id" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <option value="">All categories</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Min price</label>
                <input v-model="localFilters.min_price" type="number" min="0" step="0.01" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Max price</label>
                <input v-model="localFilters.max_price" type="number" min="0" step="0.01" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>
        </div>

        <div class="mt-4 flex justify-end">
            <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Apply filters
            </button>
        </div>
    </form>
</template>
