<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { headingTextClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';

const passwordInput = ref<{ focus: () => void } | null>(null);
const currentPasswordInput = ref<{ focus: () => void } | null>(null);

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value?.focus();
            }

            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value?.focus();
            }
        },
    });
};
</script>

<template>
    <section>
        <header>
            <h2 :class="['text-lg font-medium', headingTextClass]">
                {{ t('profile.password.heading') }}
            </h2>

            <MutedText class="mt-1">
                {{ t('profile.password.description') }}
            </MutedText>
        </header>

        <form @submit.prevent="updatePassword" class="mt-6 space-y-6">
            <FormField
                id="current_password"
                ref="currentPasswordInput"
                v-model="form.current_password"
                type="password"
                :label="t('profile.password.currentPassword')"
                :error="form.errors.current_password"
                autocomplete="current-password"
            />

            <FormField
                id="password"
                ref="passwordInput"
                v-model="form.password"
                type="password"
                :label="t('profile.password.newPassword')"
                :error="form.errors.password"
                autocomplete="new-password"
            />

            <FormField
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                :label="t('profile.password.confirmPassword')"
                :error="form.errors.password_confirmation"
                autocomplete="new-password"
            />

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
