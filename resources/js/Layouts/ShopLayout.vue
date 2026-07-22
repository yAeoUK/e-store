<script setup>
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
            <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/">
                    <ApplicationLogo class="h-8 w-auto" />
                </Link>

                <ShopAuthBanner />
            </div>

            <div v-if="$slots.header" class="border-t border-slate-200 dark:border-slate-800">
                <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <slot name="header" />
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>
    </div>
</template>
