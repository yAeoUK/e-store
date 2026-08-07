<script setup lang="ts">
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { t } from '@/i18n';

defineProps<{
    show: boolean;
    title: string;
    message: string;
    processing: boolean;
}>();

const emit = defineEmits<{
    confirm: [];
    cancel: [];
}>();
</script>

<template>
    <ConfirmationDialog
        :show="show"
        :title="title"
        :message="message"
        :confirm-label="t('common.delete')"
        danger
        :processing="processing"
        @confirm="emit('confirm')"
        @cancel="emit('cancel')"
    />
</template>
