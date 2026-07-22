<script setup>
import { buttonVariants } from './classNames';
</script>

<template>
    <button
        v-bind="$attrs"
        :class="buttonVariants.primary"
    >
        <slot />
    </button>
</template>
