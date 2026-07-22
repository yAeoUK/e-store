<script setup>
import { computed } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextLink from '@/components/TextLink.vue';
import MutedText from '@/components/MutedText.vue';
import SuccessText from '@/components/SuccessText.vue';
import { Head, useForm } from '@inertiajs/vue3';

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
    <GuestLayout>
        <Head title="Email Verification" />

        <MutedText class="mb-4">
            Thanks for signing up! Before getting started, could you verify your
            email address by clicking on the link we just emailed to you? If you
            didn't receive the email, we will gladly send you another.
        </MutedText>

        <SuccessText v-if="verificationLinkSent" class="mb-4">
            A new verification link has been sent to the email address you
            provided during registration.
        </SuccessText>

        <form @submit.prevent="submit" class="space-y-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <PrimaryButton :disabled="form.processing">
                    Resend Verification Email
                </PrimaryButton>

                <TextLink
                    :href="route('logout')"
                    method="post"
                    as="button"
                    variant="slate"
                    >Log Out</TextLink
                >
            </div>
        </form>
    </GuestLayout>
</template>
