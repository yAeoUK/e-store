<script setup lang="ts">
import { Save } from '@lucide/vue';
import type { Component } from 'vue';
import CancelButton from '@/components/CancelButton.vue';
import FormActions from '@/components/FormActions.vue';
import IconLabel from '@/components/IconLabel.vue';
import Modal from '@/components/Modal.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SectionHeading from '@/components/SectionHeading.vue';

defineProps<{
    show: boolean;
    title: string;
    processing: boolean;
    saveLabel: string;
    icon?: Component;
}>();

const emit = defineEmits<{
    close: [];
    submit: [];
}>();
</script>

<template>
    <Modal :show="show" @close="emit('close')">
        <div class="p-6">
            <SectionHeading :heading="title" :icon="icon" />

            <form @submit.prevent="emit('submit')" class="space-y-4">
                <slot />

                <FormActions>
                    <CancelButton @click="emit('close')" />
                    <PrimaryButton :disabled="processing">
                        <IconLabel :icon="Save">{{ saveLabel }}</IconLabel>
                    </PrimaryButton>
                </FormActions>
            </form>
        </div>
    </Modal>
</template>
