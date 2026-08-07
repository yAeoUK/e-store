<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { MailCheck } from '@lucide/vue';
import { computed } from 'vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import { t } from '@/i18n';
import GuestLayout from '@/Layouts/GuestLayout.vue';

const props = defineProps({
    status: {
        type: String,
    },
});

const form = useForm({});

const submit = () => {
    form.post(route('verification.send'));
};

const verificationLinkSent = computed(
    () => props.status === 'verification-link-sent',
);
</script>

<template>
    <GuestLayout :heading="t('auth.verifyEmail.title')" :icon="MailCheck">
        <Head :title="t('auth.verifyEmail.title')" />

        <MutedText class="mb-4">
            {{ t('auth.verifyEmail.description') }}
        </MutedText>

        <SuccessText v-if="verificationLinkSent" class="mb-4">
            {{ t('auth.verifyEmail.linkSent') }}
        </SuccessText>

        <form @submit.prevent="submit" class="space-y-6">
            <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <PrimaryButton :disabled="form.processing">
                    {{ t('auth.verifyEmail.resend') }}
                </PrimaryButton>

                <TextLink
                    :href="route('logout')"
                    method="post"
                    as="button"
                    variant="slate"
                    >{{ t('auth.verifyEmail.logOut') }}</TextLink
                >
            </div>
        </form>
    </GuestLayout>
</template>
