<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { emailField } from '@/lib/validation';

defineProps({
    status: {
        type: String,
    },
});

const { form, errors, submit } = useValidatedSubmit(
    { email: '' },
    {
        email: emailField(t('auth.forgotPassword.email')),
    },
    (form) => form.post(route('password.email')),
);
</script>

<template>
    <GuestLayout>
        <Head :title="t('auth.forgotPassword.title')" />

        <MutedText class="mb-4">
            {{ t('auth.forgotPassword.description') }}
        </MutedText>

        <SuccessText v-if="status" class="mb-4">
            {{ status }}
        </SuccessText>

        <form @submit.prevent="submit" class="space-y-6">
            <FormField
                id="email"
                v-model="form.email"
                type="email"
                :label="t('auth.forgotPassword.email')"
                :error="errors.email"
                required
                autofocus
                autocomplete="username"
            />

            <FormActions>
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.forgotPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
