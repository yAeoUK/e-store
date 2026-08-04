<script setup lang="ts">
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import Modal from '@/components/Modal.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
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
                <SecondaryButton @click="emit('cancel')">
                    {{ cancelLabel }}
                </SecondaryButton>

                <DangerButton
                    v-if="danger"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </DangerButton>
                <PrimaryButton
                    v-else
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </PrimaryButton>
            </FormActions>
        </div>
    </Modal>
</template>
