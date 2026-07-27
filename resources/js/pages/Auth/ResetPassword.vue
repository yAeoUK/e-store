<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';

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

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('password.store'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
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
                :error="form.errors.email"
                required
                autofocus
                autocomplete="username"
            />

            <FormField
                id="password"
                v-model="form.password"
                type="password"
                :label="t('auth.resetPassword.password')"
                :error="form.errors.password"
                required
                autocomplete="new-password"
            />

            <FormField
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                :label="t('auth.resetPassword.confirmPassword')"
                :error="form.errors.password_confirmation"
                required
                autocomplete="new-password"
            />

            <FormActions>
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.resetPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
