<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextLink from '@/components/TextLink.vue';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
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
                :error="form.errors.name"
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
                :error="form.errors.email"
                required
                autocomplete="username"
            />

            <FormField
                id="password"
                v-model="form.password"
                type="password"
                class="mt-4"
                :label="t('auth.register.password')"
                :error="form.errors.password"
                required
                autocomplete="new-password"
            />

            <FormField
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                class="mt-4"
                :label="t('auth.register.confirmPassword')"
                :error="form.errors.password_confirmation"
                required
                autocomplete="new-password"
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
