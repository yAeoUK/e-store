<script setup lang="ts">
import FormField from '@/components/FormField.vue';

defineProps<{
    label: string;
    error?: string;
}>();

const model = defineModel<number>({ default: 0 });
</script>

<template>
    <FormField
        v-model="model"
        type="number"
        min="0"
        :label="label"
        :error="error"
    />
</template>
