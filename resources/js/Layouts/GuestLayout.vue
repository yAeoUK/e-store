<script setup>
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import Card from '@/components/Card.vue';
import { mutedLinkClass } from '@/components/classNames';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { t } from '@/i18n';
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0 dark:bg-slate-950"
    >
        <div class="mb-2">
            <LanguageSwitcher />
        </div>

        <div class="flex flex-col items-center gap-2">
            <Link :href="route('home')">
                <ApplicationLogo class="h-16 w-16" />
            </Link>
            <Link :href="route('home')" :class="[mutedLinkClass, 'text-sm font-medium']">
                <span class="rtl:hidden">&larr;</span><span class="ltr:hidden">&rarr;</span> {{ t('common.backToShop') }}
            </Link>
        </div>

        <Card class="p-4 sm:mt-6 sm:w-full sm:max-w-xl">
            <slot />
        </Card>
    </div>
</template>
