<script setup lang="ts">
import type { Method, UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { PropType } from 'vue';
import { focusRingClass, mutedBodyTextClass } from './classNames';

const textLinkVariants = {
    muted: `${mutedBodyTextClass} hover:text-slate-900 dark:hover:text-slate-200`,
    slate: `${mutedBodyTextClass} hover:text-slate-900 dark:hover:text-white`,
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
        :class="['rounded-md text-sm underline', focusRingClass, classes]"
    >
        <slot />
    </Link>
</template>
