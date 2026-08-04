<script setup lang="ts">
import { bodyTextClass } from './classNames';

defineProps({
    value: {
        type: String,
    },
    required: {
        type: Boolean,
        default: false,
    },
});

// Browsers compute a <label for="..."> element's accessible name from its
// raw textContent, ignoring aria-hidden on descendants (that exclusion only
// applies to the generic accessible-name-from-content algorithm, not
// label-based form control naming). So the required-field marker has to be
// rendered as CSS content rather than a DOM text node, or it leaks into the
// input's accessible name (e.g. "Password*" instead of "Password").
const requiredMarkerClass =
    "after:ms-0.5 after:content-['*'] after:text-red-600 dark:after:text-red-400";
</script>

<template>
    <label
        :class="[
            'mb-2 block text-sm font-medium',
            bodyTextClass,
            required && requiredMarkerClass,
        ]"
    >
        <span v-if="value">{{ value }}</span>
        <span v-else><slot /></span>
    </label>
</template>
