<script setup>
import Modal from '@/components/Modal.vue';
import DangerButton from '@/components/DangerButton.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import MutedText from '@/components/MutedText.vue';
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
            <h2 class="text-lg font-medium text-gray-900 dark:text-slate-100">
                {{ title }}
            </h2>

            <MutedText v-if="message" class="mt-1">
                {{ message }}
            </MutedText>

            <slot />

            <div class="mt-6 flex justify-end gap-3">
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
            </div>
        </div>
    </Modal>
</template>
