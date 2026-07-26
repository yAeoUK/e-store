<script setup lang="ts">
import type { UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { PropType } from 'vue';
import { buttonVariants } from './classNames';

const props = defineProps({
    href: {
        type: [String, Object] as PropType<string | UrlMethodPair>,
        required: true,
    },
    variant: {
        type: String as PropType<keyof typeof buttonVariants>,
        default: 'secondary',
    },
});

const classes = computed(
    () => buttonVariants[props.variant] ?? buttonVariants.secondary,
);
</script>

<template>
    <Link :href="href" v-bind="$attrs" :class="classes">
        <slot />
    </Link>
</template>
