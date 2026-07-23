<script setup>
import DangerButton from '@/components/DangerButton.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import Modal from '@/components/Modal.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import MutedText from '@/components/MutedText.vue';
import FormActions from '@/components/FormActions.vue';
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';
import { t } from '@/i18n';

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value.focus());
};

const deleteUser = () => {
    form.delete(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
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
            <h2 class="text-lg font-medium text-gray-900">
                {{ t('profile.deleteAccount.heading') }}
            </h2>

            <MutedText class="mt-1">
                {{ t('profile.deleteAccount.description') }}
            </MutedText>
        </header>

        <DangerButton @click="confirmUserDeletion">{{ t('profile.deleteAccount.heading') }}</DangerButton>

        <Modal :show="confirmingUserDeletion" @close="closeModal">
            <div class="p-6">
                <h2
                    class="text-lg font-medium text-gray-900"
                >
                    {{ t('profile.deleteAccount.confirmTitle') }}
                </h2>

                <MutedText class="mt-1">
                    {{ t('profile.deleteAccount.confirmDescription') }}
                </MutedText>

                <div class="mt-6">
                    <InputLabel
                        for="password"
                        :value="t('profile.deleteAccount.passwordPlaceholder')"
                        class="sr-only"
                    />

                    <TextInput
                        id="password"
                        ref="passwordInput"
                        v-model="form.password"
                        type="password"
                        class="mt-1 w-3/4"
                        :placeholder="t('profile.deleteAccount.passwordPlaceholder')"
                        @keyup.enter="deleteUser"
                    />

                    <InputError :message="form.errors.password" class="mt-2" />
                </div>

                <FormActions class="mt-6">
                    <SecondaryButton @click="closeModal">
                        {{ t('common.cancel') }}
                    </SecondaryButton>

                    <DangerButton
                        class="ms-3"
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
