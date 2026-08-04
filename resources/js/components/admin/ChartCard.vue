<script setup lang="ts">
import Card from '@/components/Card.vue';
import { compactHeadingClass } from '@/components/classNames';

defineProps<{
    title: string;
}>();
</script>

<template>
    <Card class="p-4">
        <h2 class="mb-4" :class="compactHeadingClass">
            {{ title }}
        </h2>
        <div class="h-64">
            <slot />
        </div>
    </Card>
</template>
