<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { linkClass } from '@/components/classNames';

interface Props {
    show: boolean;
    href?: string;
    fallback: string;
}

defineProps<Props>();
</script>

<template>
    <Link v-if="show" :href="href!" :class="linkClass">
        <slot />
    </Link>
    <span v-else>{{ fallback }}</span>
</template>
