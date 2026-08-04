<script setup lang="ts">
import { sectionHeadingClass } from '@/components/classNames';

defineProps<{
    title: string;
}>();
</script>

<template>
    <div class="space-y-6">
        <h2 :class="sectionHeadingClass">{{ title }}</h2>
        <slot />
    </div>
</template>
