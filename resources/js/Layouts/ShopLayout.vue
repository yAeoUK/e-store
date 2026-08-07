<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { pageBgClass } from '@/components/classNames';
</script>

<template>
    <div :class="['min-h-screen', pageBgClass]">
        <AppHeader logo-href="/">
            <template v-if="$slots.header" #subheader>
                <slot name="header" />
            </template>
        </AppHeader>

        <main>
            <slot />
        </main>
    </div>
</template>
