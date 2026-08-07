<script setup lang="ts">
import CheckboxField from '@/components/CheckboxField.vue';
import { t } from '@/i18n';

const checked = defineModel<boolean>('checked', { default: false });
</script>

<template>
    <CheckboxField
        v-model:checked="checked"
        :label="t('admin.products.isActive')"
    />
</template>
