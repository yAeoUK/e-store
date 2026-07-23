<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { buttonVariants } from './classNames';

const props = defineProps({
  href: {
    type: [String, Object],
    required: true,
  },
  variant: {
    type: String,
    default: 'secondary',
  },
});

const classes = computed(() => buttonVariants[props.variant] ?? buttonVariants.secondary);
</script>

<template>
  <Link :href="href" v-bind="$attrs" :class="classes">
    <slot />
  </Link>
</template>
