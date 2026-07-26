<script setup lang="ts">
import type { Method, UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { PropType } from 'vue';

const textLinkVariants = {
    muted: 'text-gray-600 hover:text-gray-900',
    slate: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
};

const props = defineProps({
    href: {
        type: [String, Object] as PropType<string | UrlMethodPair>,
        required: true,
    },
    method: {
        type: String as PropType<Method>,
        default: null,
    },
    as: {
        type: String,
        default: 'a',
    },
    variant: {
        type: String as PropType<keyof typeof textLinkVariants>,
        default: 'muted',
    },
});

const classes = computed(
    () => textLinkVariants[props.variant] ?? textLinkVariants.muted,
);
</script>

<template>
    <Link
        :href="href"
        :method="method"
        :as="as"
        v-bind="$attrs"
        :class="[
            'rounded-md text-sm underline focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
            classes,
        ]"
    >
        <slot />
    </Link>
</template>
