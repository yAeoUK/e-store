<script setup lang="ts">
import Checkbox from './Checkbox.vue';

defineProps<{
    label: string;
}>();

const checked = defineModel<boolean>('checked', { default: false });
</script>

<template>
    <label
        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
    >
        <Checkbox v-model:checked="checked" />
        {{ label }}
    </label>
</template>
