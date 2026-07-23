<script setup>
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
import Card from '@/components/Card.vue';
import { t } from '@/i18n';
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0 dark:bg-slate-950"
    >
        <div class="flex flex-col items-center gap-2">
            <Link :href="route('home')">
                <ApplicationLogo class="h-16 w-16" />
            </Link>
            <Link :href="route('home')" class="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                &larr; {{ t('common.backToShop') }}
            </Link>
        </div>

        <Card class="p-4 sm:mt-6 sm:w-full sm:max-w-xl">
            <slot />
        </Card>
    </div>
</template>
