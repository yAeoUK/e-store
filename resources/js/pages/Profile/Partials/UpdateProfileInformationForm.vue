<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { headingTextClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SuccessText from '@/components/SuccessText.vue';
import TextLink from '@/components/TextLink.vue';
import { t } from '@/i18n';

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

const form = useForm({
    name: user.name,
    email: user.email,
});
</script>

<template>
    <section>
        <header>
            <h2 :class="['text-lg font-medium', headingTextClass]">
                {{ t('profile.information.heading') }}
            </h2>

            <MutedText class="mt-1">
                {{ t('profile.information.description') }}
            </MutedText>
        </header>

        <form
            @submit.prevent="form.patch(route('profile.update'))"
            class="mt-6 space-y-6"
        >
            <FormField
                id="name"
                v-model="form.name"
                type="text"
                :label="t('profile.information.name')"
                :error="form.errors.name"
                required
                autofocus
                autocomplete="name"
            />

            <FormField
                id="email"
                v-model="form.email"
                type="email"
                :label="t('profile.information.email')"
                :error="form.errors.email"
                required
                autocomplete="username"
            />

            <div v-if="mustVerifyEmail && user.email_verified_at === null">
                <p class="mt-2 text-sm text-gray-800 dark:text-slate-300">
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

            <div class="flex items-center gap-4">
                <PrimaryButton :disabled="form.processing">{{
                    t('common.save')
                }}</PrimaryButton>

                <Transition
                    enter-active-class="transition ease-in-out"
                    enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out"
                    leave-to-class="opacity-0"
                >
                    <MutedText v-if="form.recentlySuccessful">
                        {{ t('common.saved') }}
                    </MutedText>
                </Transition>
            </div>
        </form>
    </section>
</template>
