<script setup lang="ts">
import type { Component } from 'vue';
import { sectionHeadingClass } from '@/components/classNames';

withDefaults(
    defineProps<{
        heading: string;
        icon?: Component;
        iconClass?: string;
        spacingClass?: string;
    }>(),
    {
        icon: undefined,
        iconClass: 'text-slate-500 dark:text-slate-400',
        spacingClass: 'mb-4',
    },
);
</script>

<template>
    <div v-if="icon" class="flex items-center gap-2" :class="spacingClass">
        <component :is="icon" class="h-4 w-4" :class="iconClass" />
        <h3 :class="sectionHeadingClass">{{ heading }}</h3>
        <slot />
    </div>
    <h3 v-else :class="[spacingClass, sectionHeadingClass]">{{ heading }}</h3>
</template>
