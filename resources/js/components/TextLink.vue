<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { textLinkVariants } from './classNames';

const props = defineProps({
    href: {
        type: [String, Object],
        required: true,
    },
    method: {
        type: String,
        default: null,
    },
    as: {
        type: String,
        default: 'a',
    },
    variant: {
        type: String,
        default: 'muted',
    },
});

const classes = computed(() => textLinkVariants[props.variant] ?? textLinkVariants.muted);
</script>

<template>
    <Link
        :href="href"
        :method="method"
        :as="as"
        v-bind="$attrs"
        :class="['rounded-md text-sm underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2', classes]"
    >
        <slot />
    </Link>
</template>
