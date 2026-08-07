<script setup lang="ts">
import { hintTextClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';

defineProps<{
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
}>();

const model = defineModel<number | string>({ default: '' });
</script>

<template>
    <div>
        <FormField
            v-model="model"
            type="number"
            min="0"
            step="0.01"
            :label="label"
            :error="error"
            :required="required"
        />
        <p v-if="hint" :class="hintTextClass">{{ hint }}</p>
    </div>
</template>
