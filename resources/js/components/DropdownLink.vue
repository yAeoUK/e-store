<script setup lang="ts">
import type { Method, UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/vue3';
import type { PropType } from 'vue';
import { dropdownItemBaseClass } from './classNames';

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
        :class="[
            dropdownItemBaseClass,
            'text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        ]"
    >
        <slot />
    </Link>
</template>
