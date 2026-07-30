<script setup lang="ts">
import { mutedBodyTextClass } from './classNames';
</script>

<template>
    <p :class="['text-sm', mutedBodyTextClass]">
        <slot />
    </p>
</template>
