<script setup lang="ts">
import { ref } from 'vue';
import FormField from '@/components/FormField.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import PasswordConfirmationFields from '@/components/PasswordConfirmationFields.vue';
import SaveButton from '@/components/SaveButton.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { required, passwordConfirmationRules } from '@/lib/validation';

const passwordFields = ref<{ focus: () => void } | null>(null);
const currentPasswordInput = ref<{ focus: () => void } | null>(null);

const {
    form,
    errors,
    submit: updatePassword,
} = useValidatedSubmit(
    { current_password: '', password: '', password_confirmation: '' },
    {
        current_password: [required(t('profile.password.currentPassword'))],
        ...passwordConfirmationRules({
            password: t('profile.password.newPassword'),
            passwordConfirmation: t('profile.password.confirmPassword'),
        }),
    },
    (form) =>
        form.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: () => {
                if (form.errors.password) {
                    form.reset('password', 'password_confirmation');
                    passwordFields.value?.focus();
                }

                if (form.errors.current_password) {
                    form.reset('current_password');
                    currentPasswordInput.value?.focus();
                }
            },
        }),
);
</script>

<template>
    <section>
        <FormSectionHeader
            :heading="t('profile.password.heading')"
            :description="t('profile.password.description')"
        />

        <form @submit.prevent="updatePassword" class="mt-6 space-y-6">
            <FormField
                id="current_password"
                ref="currentPasswordInput"
                v-model="form.current_password"
                type="password"
                :label="t('profile.password.currentPassword')"
                :error="errors.current_password"
                required
                autocomplete="current-password"
            />

            <PasswordConfirmationFields
                ref="passwordFields"
                v-model:password="form.password"
                v-model:confirmation="form.password_confirmation"
                :password-label="t('profile.password.newPassword')"
                :confirm-label="t('profile.password.confirmPassword')"
                :password-error="errors.password"
                :confirm-error="errors.password_confirmation"
            />

            <SaveButton
                :processing="form.processing"
                :saved="form.recentlySuccessful"
            />
        </form>
    </section>
</template>
