<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import Card from '@/components/Card.vue';
import { pageTitleClass } from '@/components/classNames';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const promoteForm = useForm({
    email: '',
});

function submitPromote(): void {
    promoteForm.post(route('admin.admins.promote'), {
        onSuccess: () => promoteForm.reset(),
    });
}

const createForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

function submitCreate(): void {
    createForm.post(route('admin.admins.store'), {
        onSuccess: () => createForm.reset(),
    });
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.admins.addAdmin')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.admins.addAdmin') }}
            </h1>
        </template>

        <div class="grid gap-6 md:grid-cols-2">
            <Card class="p-6">
                <h2 class="mb-1 text-lg font-semibold">
                    {{ t('admin.admins.promoteHeading') }}
                </h2>
                <MutedText class="mb-4">
                    {{ t('admin.admins.promoteDescription') }}
                </MutedText>

                <form @submit.prevent="submitPromote" class="space-y-4">
                    <FormField
                        v-model="promoteForm.email"
                        type="email"
                        :label="t('admin.admins.promoteEmailLabel')"
                        :error="promoteForm.errors.email"
                    />

                    <FormActions>
                        <PrimaryButton :disabled="promoteForm.processing">
                            {{ t('admin.admins.promoteSubmit') }}
                        </PrimaryButton>
                    </FormActions>
                </form>
            </Card>

            <Card class="p-6">
                <h2 class="mb-1 text-lg font-semibold">
                    {{ t('admin.admins.createHeading') }}
                </h2>
                <MutedText class="mb-4">
                    {{ t('admin.admins.createDescription') }}
                </MutedText>

                <form @submit.prevent="submitCreate" class="space-y-4">
                    <FormField
                        v-model="createForm.name"
                        type="text"
                        :label="t('admin.admins.createNameLabel')"
                        :error="createForm.errors.name"
                    />
                    <FormField
                        v-model="createForm.email"
                        type="email"
                        :label="t('admin.admins.createEmailLabel')"
                        :error="createForm.errors.email"
                    />
                    <FormField
                        v-model="createForm.password"
                        type="password"
                        :label="t('admin.admins.createPasswordLabel')"
                        :error="createForm.errors.password"
                    />
                    <FormField
                        v-model="createForm.password_confirmation"
                        type="password"
                        :label="
                            t('admin.admins.createPasswordConfirmationLabel')
                        "
                    />

                    <FormActions>
                        <PrimaryButton :disabled="createForm.processing">
                            {{ t('admin.admins.createSubmit') }}
                        </PrimaryButton>
                    </FormActions>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
