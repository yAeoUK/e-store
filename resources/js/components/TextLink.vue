<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

const textLinkVariants = {
    muted: 'text-gray-600 hover:text-gray-900',
    slate: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
};

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
