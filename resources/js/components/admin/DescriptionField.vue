<script setup lang="ts">
import TextareaField from '@/components/TextareaField.vue';

defineProps<{
    label: string;
}>();

const model = defineModel<string>({ default: '' });
</script>

<template>
    <TextareaField v-model="model" :label="label" rows="4" />
</template>
