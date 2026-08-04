<script setup lang="ts">
import { errorTextClass } from './classNames';
</script>

<template>
    <p
        :class="`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm ${errorTextClass} dark:border-red-900 dark:bg-red-950/50`"
    >
        <slot />
    </p>
</template>
