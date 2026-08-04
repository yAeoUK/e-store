<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import PasswordConfirmationFields from '@/components/PasswordConfirmationFields.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { confirmedBy, emailField, required } from '@/lib/validation';

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const { form, errors, submit } = useValidatedSubmit(
    {
        token: props.token,
        email: props.email,
        password: '',
        password_confirmation: '',
    },
    {
        email: emailField(t('auth.resetPassword.email')),
        password: [required(t('auth.resetPassword.password'))],
        password_confirmation: [
            confirmedBy(t('auth.resetPassword.confirmPassword'), 'password'),
        ],
    },
    (form) =>
        form.post(route('password.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        }),
);
</script>

<template>
    <GuestLayout>
        <Head :title="t('auth.resetPassword.title')" />

        <form @submit.prevent="submit" class="space-y-6">
            <FormField
                id="email"
                v-model="form.email"
                type="email"
                :label="t('auth.resetPassword.email')"
                :error="errors.email"
                required
                autofocus
                autocomplete="username"
            />

            <PasswordConfirmationFields
                v-model:password="form.password"
                v-model:confirmation="form.password_confirmation"
                :password-label="t('auth.resetPassword.password')"
                :confirm-label="t('auth.resetPassword.confirmPassword')"
                :password-error="errors.password"
                :confirm-error="errors.password_confirmation"
            />

            <FormActions>
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.resetPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
