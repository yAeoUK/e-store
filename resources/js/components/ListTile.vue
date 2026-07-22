<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  href: {
    type: [String, Object],
    required: true,
  },
  badge: {
    type: [String, Number],
    default: null,
  },
  method: {
    type: String,
    default: null,
  },
  as: {
    type: String,
    default: 'a',
  },
});

const classes = computed(() =>
  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
);
</script>

<template>
  <Link
    :href="href"
    :as="as"
    :method="method"
    v-bind="$attrs"
    :class="classes"
  >
    <span><slot /></span>
    <span v-if="badge" class="text-xs text-slate-400 dark:text-slate-500">{{ badge }}</span>
  </Link>
</template>
