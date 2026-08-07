<script setup lang="ts">
import { Trash2 } from '@lucide/vue';
import { nextTick, ref } from 'vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormField from '@/components/FormField.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import IconLabel from '@/components/IconLabel.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { required } from '@/lib/validation';

const confirmingUserDeletion = ref(false);
const passwordInput = ref<{ focus: () => void } | null>(null);

const {
    form,
    errors,
    submit: deleteUser,
    reset: resetAttempted,
} = useValidatedSubmit(
    { password: '' },
    {
        password: [required(t('profile.deleteAccount.passwordPlaceholder'))],
    },
    (form) =>
        form.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.value?.focus(),
            onFinish: () => form.reset(),
        }),
);

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value?.focus());
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    resetAttempted();
    form.clearErrors();
    form.reset();
};
</script>

<template>
    <section class="space-y-6">
        <FormSectionHeader
            :heading="t('profile.deleteAccount.heading')"
            :description="t('profile.deleteAccount.description')"
        />

        <DangerButton @click="confirmUserDeletion">
            <IconLabel :icon="Trash2">{{
                t('profile.deleteAccount.heading')
            }}</IconLabel>
        </DangerButton>

        <ConfirmationDialog
            :show="confirmingUserDeletion"
            :title="t('profile.deleteAccount.confirmTitle')"
            :message="t('profile.deleteAccount.confirmDescription')"
            :confirm-label="t('profile.deleteAccount.heading')"
            danger
            :processing="form.processing"
            @confirm="deleteUser"
            @cancel="closeModal"
        >
            <FormField
                id="password"
                ref="passwordInput"
                v-model="form.password"
                type="password"
                class="mt-6"
                label-class="sr-only"
                input-class="w-3/4"
                :label="t('profile.deleteAccount.passwordPlaceholder')"
                :error="errors.password"
                :placeholder="t('profile.deleteAccount.passwordPlaceholder')"
                required
                @keyup.enter="deleteUser"
            />
        </ConfirmationDialog>
    </section>
</template>
