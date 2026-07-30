<script setup lang="ts">
import { pageWidthClass } from './classNames';
</script>

<template>
    <div :class="[pageWidthClass, 'py-8']">
        <slot />
    </div>
</template>
