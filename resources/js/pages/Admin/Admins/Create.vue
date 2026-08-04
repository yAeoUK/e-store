<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import Card from '@/components/Card.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import PasswordConfirmationFields from '@/components/PasswordConfirmationFields.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { t } from '@/i18n';
import { confirmedBy, isEmail, maxLength, required } from '@/lib/validation';

const {
    form: promoteForm,
    clientErrors: promoteClientErrors,
    submit: submitPromote,
} = useAdminResourceForm(
    { email: '' },
    {
        email: [
            required(t('admin.admins.promoteEmailLabel')),
            isEmail(t('admin.admins.promoteEmailLabel')),
        ],
    },
    (form) =>
        form.post(route('admin.admins.promote'), {
            onSuccess: () => form.reset(),
        }),
);

const {
    form: createForm,
    clientErrors: createClientErrors,
    submit: submitCreate,
} = useAdminResourceForm(
    {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    },
    {
        name: [
            required(t('admin.admins.createNameLabel')),
            maxLength(t('admin.admins.createNameLabel'), 255),
        ],
        email: [
            required(t('admin.admins.createEmailLabel')),
            isEmail(t('admin.admins.createEmailLabel')),
            maxLength(t('admin.admins.createEmailLabel'), 255),
        ],
        password: [required(t('admin.admins.createPasswordLabel'))],
        password_confirmation: [
            confirmedBy(
                t('admin.admins.createPasswordConfirmationLabel'),
                'password',
            ),
        ],
    },
    (form) =>
        form.post(route('admin.admins.store'), {
            onSuccess: () => form.reset(),
        }),
);
</script>

<template>
    <AdminPageHeader :title="t('admin.admins.addAdmin')">
        <div class="grid gap-6 md:grid-cols-2">
            <Card class="p-6">
                <FormSectionHeader
                    :heading="t('admin.admins.promoteHeading')"
                    :description="t('admin.admins.promoteDescription')"
                />

                <form @submit.prevent="submitPromote" class="mt-4 space-y-4">
                    <FormField
                        v-model="promoteForm.email"
                        type="email"
                        :label="t('admin.admins.promoteEmailLabel')"
                        :error="promoteClientErrors.email || promoteForm.errors.email"
                        required
                    />

                    <FormActions>
                        <PrimaryButton :disabled="promoteForm.processing">
                            {{ t('admin.admins.promoteSubmit') }}
                        </PrimaryButton>
                    </FormActions>
                </form>
            </Card>

            <Card class="p-6">
                <FormSectionHeader
                    :heading="t('admin.admins.createHeading')"
                    :description="t('admin.admins.createDescription')"
                />

                <form @submit.prevent="submitCreate" class="mt-4 space-y-4">
                    <FormField
                        v-model="createForm.name"
                        type="text"
                        :label="t('admin.admins.createNameLabel')"
                        :error="createClientErrors.name || createForm.errors.name"
                        required
                    />
                    <FormField
                        v-model="createForm.email"
                        type="email"
                        :label="t('admin.admins.createEmailLabel')"
                        :error="createClientErrors.email || createForm.errors.email"
                        required
                    />
                    <PasswordConfirmationFields
                        v-model:password="createForm.password"
                        v-model:confirmation="createForm.password_confirmation"
                        :password-label="t('admin.admins.createPasswordLabel')"
                        :confirm-label="
                            t('admin.admins.createPasswordConfirmationLabel')
                        "
                        :password-error="
                            createClientErrors.password || createForm.errors.password
                        "
                        :confirm-error="
                            createClientErrors.password_confirmation ||
                            createForm.errors.password_confirmation
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
    </AdminPageHeader>
</template>
