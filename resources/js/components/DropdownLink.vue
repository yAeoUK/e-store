<script setup lang="ts">
import type { Method, UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/vue3';
import type { PropType } from 'vue';

defineProps({
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
});
</script>

<template>
    <Link
        :href="href"
        :method="method"
        :as="as"
        v-bind="$attrs"
        class="block w-full px-4 py-2 text-start text-sm leading-5 text-popover-foreground transition duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
    >
        <slot />
    </Link>
</template>
