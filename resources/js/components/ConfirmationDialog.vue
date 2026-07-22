<script setup>
import Modal from '@/Components/Modal.vue';
import DangerButton from '@/Components/DangerButton.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

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
        default: 'Confirm',
    },
    cancelLabel: {
        type: String,
        default: 'Cancel',
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

            <p
                v-if="message"
                class="mt-1 text-sm text-gray-600 dark:text-slate-400"
            >
                {{ message }}
            </p>

            <slot />

            <div class="mt-6 flex justify-end gap-3">
                <SecondaryButton @click="emit('cancel')">
                    {{ cancelLabel }}
                </SecondaryButton>

                <DangerButton
                    v-if="danger"
                    :class="{ 'opacity-25': processing }"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </DangerButton>
                <PrimaryButton
                    v-else
                    :class="{ 'opacity-25': processing }"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </PrimaryButton>
            </div>
        </div>
    </Modal>
</template>
