<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import MutedText from '@/components/MutedText.vue';
import SuccessText from '@/components/SuccessText.vue';
import FormActions from '@/components/FormActions.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { t } from '@/i18n';

defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};
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
            <div>
                <InputLabel for="email" :value="t('auth.forgotPassword.email')" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                />

                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <FormActions>
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.forgotPassword.submit') }}
                </PrimaryButton>
            </FormActions>
        </form>
    </GuestLayout>
</template>
