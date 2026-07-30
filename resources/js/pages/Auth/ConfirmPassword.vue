<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';

const form = useForm({
    password: '',
});

const submit = () => {
    form.post(route('password.confirm'), {
        onFinish: () => form.reset(),
    });
};
</script>

<template>
    <GuestLayout>
        <Head :title="t('auth.confirmPassword.title')" />

        <MutedText class="mb-4">
            {{ t('auth.confirmPassword.description') }}
        </MutedText>

        <form @submit.prevent="submit" class="space-y-6">
            <FormField
                id="password"
                v-model="form.password"
                type="password"
                :label="t('auth.confirmPassword.password')"
                :error="form.errors.password"
                required
                autocomplete="current-password"
                autofocus
            />

            <FormActions>
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.confirmPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
