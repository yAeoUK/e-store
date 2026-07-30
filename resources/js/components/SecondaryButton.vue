<script setup lang="ts">
import type { PropType } from 'vue';
import {
    bodyTextClass,
    borderColorClass,
    focusRingClass,
    legacyButtonBaseClass,
} from './classNames';

defineProps({
    type: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button',
    },
});
</script>

<template>
    <button
        :type="type"
        :class="[
            legacyButtonBaseClass,
            borderColorClass,
            bodyTextClass,
            focusRingClass,
            'bg-white shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700',
        ]"
    >
        <slot />
    </button>
</template>
