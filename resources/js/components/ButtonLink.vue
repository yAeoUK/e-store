<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

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

const classes = computed(() => {
  if (props.variant === 'primary') {
    return 'inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  }

  return 'inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800';
});
</script>

<template>
  <Link :href="href" v-bind="$attrs" :class="classes">
    <slot />
  </Link>
</template>
