<script setup lang="ts">
import { endRowClass } from '@/components/classNames';
</script>

<template>
    <div :class="endRowClass">
        <slot />
    </div>
</template>
