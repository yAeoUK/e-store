<script setup lang="ts">
import { bodyTextClass } from './classNames';

defineProps({
    value: {
        type: String,
    },
});
</script>

<template>
    <label :class="['mb-2 block text-sm font-medium', bodyTextClass]">
        <span v-if="value">{{ value }}</span>
        <span v-else><slot /></span>
    </label>
</template>
