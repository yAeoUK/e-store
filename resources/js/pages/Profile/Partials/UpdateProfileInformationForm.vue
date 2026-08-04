<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { bodyTextClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import SaveButton from '@/components/SaveButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { isEmail, maxLength, required } from '@/lib/validation';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

// Non-null: this page is only reachable behind the `auth` middleware.
const user = usePage().props.auth.user!;

const { form, errors, submit } = useValidatedSubmit(
    { name: user.name, email: user.email },
    {
        name: [
            required(t('profile.information.name')),
            maxLength(t('profile.information.name'), 255),
        ],
        email: [
            required(t('profile.information.email')),
            isEmail(t('profile.information.email')),
            maxLength(t('profile.information.email'), 255),
        ],
    },
    (form) => form.patch(route('profile.update')),
);
</script>

<template>
    <section>
        <FormSectionHeader
            :heading="t('profile.information.heading')"
            :description="t('profile.information.description')"
        />

        <form @submit.prevent="submit" class="mt-6 space-y-6">
            <FormField
                id="name"
                v-model="form.name"
                type="text"
                :label="t('profile.information.name')"
                :error="errors.name"
                required
                autofocus
                autocomplete="name"
            />

            <FormField
                id="email"
                v-model="form.email"
                type="email"
                :label="t('profile.information.email')"
                :error="errors.email"
                required
                autocomplete="username"
            />

            <div v-if="mustVerifyEmail && user.email_verified_at === null">
                <p :class="['mt-2 text-sm', bodyTextClass]">
                    {{ t('profile.information.unverified') }}
                    <TextLink
                        :href="route('verification.send')"
                        method="post"
                        as="button"
                    >
                        {{ t('profile.information.resendLink') }}
                    </TextLink>
                </p>

                <SuccessText
                    v-show="status === 'verification-link-sent'"
                    class="mt-2"
                >
                    {{ t('profile.information.verificationSent') }}
                </SuccessText>
            </div>

            <SaveButton
                :processing="form.processing"
                :saved="form.recentlySuccessful"
            />
        </form>
    </section>
</template>
