<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import MutedText from '@/components/MutedText.vue';
import FormActions from '@/components/FormActions.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { t } from '@/i18n';

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
            <div>
                <InputLabel for="password" :value="t('auth.confirmPassword.password')" />
                <TextInput
                    id="password"
                    type="password"
                    class="mt-1"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                    autofocus
                />
                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <FormActions>
                <PrimaryButton
                    class="ms-4"
                    :disabled="form.processing"
                >
                    {{ t('auth.confirmPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
