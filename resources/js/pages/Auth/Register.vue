<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import PasswordConfirmationFields from '@/components/PasswordConfirmationFields.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextLink from '@/components/TextLink.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { confirmedBy, isEmail, maxLength, required } from '@/lib/validation';

const { form, errors, submit } = useValidatedSubmit(
    { name: '', email: '', password: '', password_confirmation: '' },
    {
        name: [
            required(t('auth.register.name')),
            maxLength(t('auth.register.name'), 255),
        ],
        email: [
            required(t('auth.register.email')),
            isEmail(t('auth.register.email')),
            maxLength(t('auth.register.email'), 255),
        ],
        password: [required(t('auth.register.password'))],
        password_confirmation: [
            confirmedBy(t('auth.register.confirmPassword'), 'password'),
        ],
    },
    (form) =>
        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        }),
);
</script>

<template>
    <GuestLayout>
        <Head :title="t('auth.register.title')" />

        <form @submit.prevent="submit" class="space-y-6">
            <FormField
                id="name"
                v-model="form.name"
                type="text"
                :label="t('auth.register.name')"
                :error="errors.name"
                required
                autofocus
                autocomplete="name"
            />

            <FormField
                id="email"
                v-model="form.email"
                type="email"
                class="mt-4"
                :label="t('auth.register.email')"
                :error="errors.email"
                required
                autocomplete="username"
            />

            <PasswordConfirmationFields
                v-model:password="form.password"
                v-model:confirmation="form.password_confirmation"
                field-class="mt-4"
                :password-label="t('auth.register.password')"
                :confirm-label="t('auth.register.confirmPassword')"
                :password-error="errors.password"
                :confirm-error="errors.password_confirmation"
            />

            <FormActions class="mt-4">
                <TextLink :href="route('login')">
                    {{ t('auth.register.alreadyRegistered') }}
                </TextLink>

                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.register.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
