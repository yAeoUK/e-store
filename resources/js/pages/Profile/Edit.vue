<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Card from '@/components/Card.vue';
import { headingTextClass } from '@/components/classNames';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head :title="t('profile.title')" />

    <ShopLayout>
        <template #header>
            <h2
                :class="[
                    'text-xl leading-tight font-semibold',
                    headingTextClass,
                ]"
            >
                {{ t('profile.title') }}
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <Card class="p-4 sm:p-8">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
                </Card>

                <Card class="p-4 sm:p-8">
                    <UpdatePasswordForm class="max-w-xl" />
                </Card>

                <Card class="p-4 sm:p-8">
                    <DeleteUserForm class="max-w-xl" />
                </Card>
            </div>
        </div>
    </ShopLayout>
</template>
