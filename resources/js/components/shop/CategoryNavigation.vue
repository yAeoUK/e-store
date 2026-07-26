<script setup lang="ts">
import {
    interactiveRowClass,
    cardSurfaceClass,
    mutedTextClass,
} from '@/components/classNames';
import { t } from '@/i18n';

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

defineProps<{
    categories?: Category[];
}>();
</script>

<template>
    <nav :class="[cardSurfaceClass, 'bg-white p-4 shadow-sm dark:shadow-none']">
        <h3
            :class="[
                mutedTextClass,
                'mb-3 text-sm font-semibold tracking-wide uppercase',
            ]"
        >
            {{ t('common.categories') }}
        </h3>

        <ul class="space-y-2">
            <li v-for="category in categories" :key="category.id">
                <a
                    :href="`/categories/${category.slug}`"
                    :class="[
                        'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium',
                        interactiveRowClass,
                    ]"
                >
                    <span>{{ category.name }}</span>
                    <span
                        v-if="category.children?.length"
                        class="text-xs text-slate-400 dark:text-slate-500"
                        >{{ category.children.length }}</span
                    >
                </a>

                <ul
                    v-if="category.children?.length"
                    class="ms-4 mt-2 space-y-1 border-s border-slate-200 ps-3 dark:border-slate-800"
                >
                    <li v-for="child in category.children" :key="child.id">
                        <a
                            :href="`/categories/${child.slug}`"
                            class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            {{ child.name }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
