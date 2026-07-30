<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import {
    headerRowClass,
    mutedBorderClass,
    pageBgClass,
    pageWidthClass,
    surfaceBgClass,
} from '@/components/classNames';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';
</script>

<template>
    <div :class="['min-h-screen', pageBgClass]">
        <header :class="[mutedBorderClass, 'border-b', surfaceBgClass]">
            <div :class="headerRowClass">
                <Link href="/">
                    <ApplicationLogo class="h-8 w-auto" />
                </Link>

                <div class="flex items-center gap-4">
                    <LanguageSwitcher />
                    <ShopAuthBanner />
                </div>
            </div>

            <div v-if="$slots.header" :class="[mutedBorderClass, 'border-t']">
                <div :class="[pageWidthClass, 'py-6']">
                    <slot name="header" />
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>
    </div>
</template>
