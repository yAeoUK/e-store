<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { Component } from 'vue';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import Card from '@/components/Card.vue';
import {
    mutedLinkClass,
    pageBgClass,
    pageTitleClass,
} from '@/components/classNames';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { t } from '@/i18n';

defineProps<{
    heading?: string;
    icon?: Component;
}>();
</script>

<template>
    <div
        :class="[
            'flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0',
            pageBgClass,
        ]"
    >
        <div class="mb-2">
            <LanguageSwitcher />
        </div>

        <div class="flex flex-col items-center gap-2">
            <Link :href="route('home')">
                <ApplicationLogo class="h-16 w-16" />
            </Link>
            <Link
                :href="route('home')"
                :class="[mutedLinkClass, 'text-sm font-medium']"
            >
                <span class="rtl:hidden">&larr;</span
                ><span class="ltr:hidden">&rarr;</span>
                {{ t('common.backToShop') }}
            </Link>
        </div>

        <Card class="p-4 sm:mt-6 sm:w-full sm:max-w-xl">
            <div
                v-if="heading"
                class="mb-6 flex flex-col items-center gap-3 text-center"
            >
                <div
                    v-if="icon"
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                    <component :is="icon" class="h-5 w-5" />
                </div>
                <h1 :class="pageTitleClass">{{ heading }}</h1>
            </div>

            <slot />
        </Card>
    </div>
</template>
