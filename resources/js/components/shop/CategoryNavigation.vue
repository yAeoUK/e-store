<script setup lang="ts">
import { t } from '@/i18n';

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

const props = defineProps<{
    categories?: Category[];
}>();
</script>

<template>
    <nav class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ t('common.categories') }}</h3>

        <ul class="space-y-2">
            <li v-for="category in categories" :key="category.id">
                <a :href="`/categories/${category.slug}`" class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span>{{ category.name }}</span>
                    <span v-if="category.children?.length" class="text-xs text-slate-400 dark:text-slate-500">{{ category.children.length }}</span>
                </a>

                <ul v-if="category.children?.length" class="mt-2 ml-4 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                    <li v-for="child in category.children" :key="child.id">
                        <a :href="`/categories/${child.slug}`" class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                            {{ child.name }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
