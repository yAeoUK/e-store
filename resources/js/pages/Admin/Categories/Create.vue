<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { categoryValidationRules } from '@/lib/validation';

defineProps<{
    categories: AdminCategoryRef[];
}>();

const { form, fieldErrors, submit } = useValidatedSubmit(
    {
        parent_id: '' as number | '',
        name: '',
        slug: '',
        description: '',
    },
    categoryValidationRules({
        name: t('admin.categories.name'),
        slug: t('admin.categories.slug'),
    }),
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
            :errors="fieldErrors"
            auto-slug
        />
    </AdminResourceForm>
</template>
