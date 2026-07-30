<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';
import { dialogTitleClass } from '@/components/classNames';
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import Modal from '@/components/Modal.vue';
import MutedText from '@/components/MutedText.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';

const confirmingUserDeletion = ref(false);
const passwordInput = ref<{ focus: () => void } | null>(null);

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value?.focus());
};

const deleteUser = () => {
    form.delete(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.clearErrors();
    form.reset();
};
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 :class="dialogTitleClass">
                {{ t('profile.deleteAccount.heading') }}
            </h2>

            <MutedText class="mt-1">
                {{ t('profile.deleteAccount.description') }}
            </MutedText>
        </header>

        <DangerButton @click="confirmUserDeletion">{{
            t('profile.deleteAccount.heading')
        }}</DangerButton>

        <Modal :show="confirmingUserDeletion" @close="closeModal">
            <div class="p-6">
                <h2 :class="dialogTitleClass">
                    {{ t('profile.deleteAccount.confirmTitle') }}
                </h2>

                <MutedText class="mt-1">
                    {{ t('profile.deleteAccount.confirmDescription') }}
                </MutedText>

                <FormField
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    type="password"
                    class="mt-6"
                    label-class="sr-only"
                    input-class="w-3/4"
                    :label="t('profile.deleteAccount.passwordPlaceholder')"
                    :error="form.errors.password"
                    :placeholder="
                        t('profile.deleteAccount.passwordPlaceholder')
                    "
                    @keyup.enter="deleteUser"
                />

                <FormActions class="mt-6">
                    <SecondaryButton @click="closeModal">
                        {{ t('common.cancel') }}
                    </SecondaryButton>

                    <DangerButton
                        :disabled="form.processing"
                        @click="deleteUser"
                    >
                        {{ t('profile.deleteAccount.heading') }}
                    </DangerButton>
                </FormActions>
            </div>
        </Modal>
    </section>
</template>
