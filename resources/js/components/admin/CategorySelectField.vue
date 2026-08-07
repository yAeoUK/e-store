<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import SelectField from '@/components/SelectField.vue';

defineProps<{
    label: string;
    noneLabel: string;
    categories: AdminCategoryRef[];
}>();

const model = defineModel<string | number>({ default: '' });
</script>

<template>
    <SelectField v-model="model" :label="label">
        <option value="">{{ noneLabel }}</option>
        <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
        >
            {{ category.name }}
        </option>
    </SelectField>
</template>
