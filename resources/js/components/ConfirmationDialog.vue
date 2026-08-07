<script setup lang="ts">
import { Check, Trash2 } from '@lucide/vue';
import CancelButton from '@/components/CancelButton.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import IconLabel from '@/components/IconLabel.vue';
import Modal from '@/components/Modal.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
    confirmLabel: {
        type: String,
        default: () => t('common.confirm'),
    },
    cancelLabel: {
        type: String,
        default: () => t('common.cancel'),
    },
    danger: {
        type: Boolean,
        default: false,
    },
    processing: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <Modal :show="show" max-width="sm" @close="emit('cancel')">
        <div class="p-6">
            <FormSectionHeader :heading="title" :description="message" />

            <slot />

            <FormActions class="mt-6">
                <CancelButton @click="emit('cancel')">{{
                    cancelLabel
                }}</CancelButton>

                <DangerButton
                    v-if="danger"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    <IconLabel :icon="Trash2">{{ confirmLabel }}</IconLabel>
                </DangerButton>
                <PrimaryButton
                    v-else
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    <IconLabel :icon="Check">{{ confirmLabel }}</IconLabel>
                </PrimaryButton>
            </FormActions>
        </div>
    </Modal>
</template>
