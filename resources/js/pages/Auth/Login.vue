<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import Checkbox from '@/components/Checkbox.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <GuestLayout>
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
                :error="form.errors.email"
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
                :error="form.errors.password"
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

                <PrimaryButton class="ms-4" :disabled="form.processing">
                    {{ t('auth.login.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
