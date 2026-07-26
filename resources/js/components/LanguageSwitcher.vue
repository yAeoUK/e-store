<script setup>
import { computed } from 'vue';
import { mutedLinkClass, headingTextClass } from '@/components/classNames';

const current = computed(() => (typeof document !== 'undefined' ? document.documentElement.lang.split('-')[0] : 'en'));

const locales = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
];
</script>

<template>
    <div class="flex items-center gap-1 text-sm font-medium">
        <template v-for="(locale, index) in locales" :key="locale.code">
            <span v-if="index > 0" class="text-slate-300 dark:text-slate-700">|</span>
            <span
                v-if="locale.code === current"
                :class="[headingTextClass, 'px-1']"
            >
                {{ locale.label }}
            </span>
            <a
                v-else
                :href="route('locale.update', locale.code)"
                :class="[mutedLinkClass, 'px-1']"
            >
                {{ locale.label }}
            </a>
        </template>
    </div>
</template>
