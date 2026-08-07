<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import {
    mutedBorderClass,
    pageWidthClass,
    surfaceBgClass,
    wrapBetweenClass,
} from '@/components/classNames';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';

const headerRowClass = `${pageWidthClass} ${wrapBetweenClass} py-3`;

defineProps<{
    logoHref: string;
}>();
</script>

<template>
    <header :class="[mutedBorderClass, 'border-b', surfaceBgClass]">
        <div :class="headerRowClass">
            <Link :href="logoHref" class="flex items-center gap-2">
                <ApplicationLogo class="h-8 w-auto" />
                <slot name="logo-suffix" />
            </Link>

            <div class="flex items-center gap-4">
                <slot name="actions" />
                <LanguageSwitcher />
                <ShopAuthBanner />
            </div>
        </div>

        <div v-if="$slots.subheader" :class="[mutedBorderClass, 'border-t']">
            <div :class="[pageWidthClass, 'py-6']">
                <slot name="subheader" />
            </div>
        </div>
    </header>
</template>
