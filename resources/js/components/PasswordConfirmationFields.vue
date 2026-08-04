<script setup lang="ts">
import { ref } from 'vue';
import FormField from '@/components/FormField.vue';

defineProps<{
    passwordLabel: string;
    confirmLabel: string;
    passwordError?: string;
    confirmError?: string;
    fieldClass?: string;
}>();

const password = defineModel<string>('password', { default: '' });
const confirmation = defineModel<string>('confirmation', { default: '' });

const passwordField = ref<{ focus: () => void } | null>(null);

defineExpose({ focus: () => passwordField.value?.focus() });
</script>

<template>
    <FormField
        id="password"
        ref="passwordField"
        v-model="password"
        type="password"
        :class="fieldClass"
        :label="passwordLabel"
        :error="passwordError"
        required
        autocomplete="new-password"
    />

    <FormField
        id="password_confirmation"
        v-model="confirmation"
        type="password"
        :class="fieldClass"
        :label="confirmLabel"
        :error="confirmError"
        required
        autocomplete="new-password"
    />
</template>
