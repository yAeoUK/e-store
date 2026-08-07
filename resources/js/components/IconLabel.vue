<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(
    defineProps<{
        icon?: Component;
        trailing?: boolean;
    }>(),
    {
        icon: undefined,
        trailing: false,
    },
);
</script>

<template>
    <span class="flex items-center gap-2">
        <component :is="icon" v-if="icon && !trailing" class="h-4 w-4" />
        <slot />
        <component :is="icon" v-if="icon && trailing" class="h-4 w-4" />
    </span>
</template>
