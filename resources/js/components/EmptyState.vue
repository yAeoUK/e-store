<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
    icon: Component;
}>();
</script>

<template>
    <div class="flex flex-col items-center gap-2">
        <component
            :is="icon"
            class="h-8 w-8 text-slate-300 dark:text-slate-700"
        />
        <slot />
    </div>
</template>
