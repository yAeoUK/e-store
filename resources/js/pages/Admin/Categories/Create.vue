<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { t } from '@/i18n';
import { maxLength, required } from '@/lib/validation';

defineProps<{
    categories: AdminCategoryRef[];
}>();

const { form, clientErrors, submit } = useAdminResourceForm(
    {
        parent_id: '' as number | '',
        name: '',
        slug: '',
        description: '',
    },
    {
        name: [
            required(t('admin.categories.name')),
            maxLength(t('admin.categories.name'), 255),
        ],
        slug: [maxLength(t('admin.categories.slug'), 255)],
    },
    (form) => form.post(route('admin.categories.store')),
);
</script>

<template>
    <AdminResourceForm
        :title="t('admin.categories.create')"
        :cancel-href="route('admin.categories.index')"
        :save-label="t('admin.categories.save')"
        :processing="form.processing"
        @submit="submit"
    >
        <CategoryFormFields
            :form="form"
            :categories="categories"
            :errors="{ ...clientErrors, ...form.errors }"
            auto-slug
        />
    </AdminResourceForm>
</template>
