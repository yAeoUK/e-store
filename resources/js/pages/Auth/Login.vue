<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { LogIn } from '@lucide/vue';
import Checkbox from '@/components/Checkbox.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { emailField, required } from '@/lib/validation';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const { form, errors, submit } = useValidatedSubmit(
    { email: '', password: '', remember: false },
    {
        email: emailField(t('auth.login.email')),
        password: [required(t('auth.login.password'))],
    },
    (form) =>
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        }),
);
</script>

<template>
    <GuestLayout :heading="t('auth.login.title')" :icon="LogIn">
        <Head :title="t('auth.login.title')" />

        <SuccessText v-if="status" class="mb-4">
            {{ status }}
        </SuccessText>

        <form @submit.prevent="submit" class="space-y-6">
            <FormField
                id="email"
                v-model="form.email"
                type="email"
                :label="t('auth.login.email')"
                :error="errors.email"
                required
                autofocus
                autocomplete="username"
            />

            <FormField
                id="password"
                v-model="form.password"
                type="password"
                class="mt-4"
                :label="t('auth.login.password')"
                :error="errors.password"
                required
                autocomplete="current-password"
            />

            <div class="mt-4 block">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <MutedText class="ms-2">{{
                        t('auth.login.rememberMe')
                    }}</MutedText>
                </label>
            </div>

            <FormActions class="mt-4">
                <TextLink
                    v-if="canResetPassword"
                    :href="route('password.request')"
                >
                    {{ t('auth.login.forgotPassword') }}
                </TextLink>

                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.login.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
