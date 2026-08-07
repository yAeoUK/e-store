<script setup lang="ts">
import type {
    AdminCategory,
    AdminCategoryRef,
} from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { categoryValidationRules } from '@/lib/validation';

const props = defineProps<{
    category: AdminCategory;
    categories: AdminCategoryRef[];
}>();

const { form, fieldErrors, submit } = useValidatedSubmit(
    {
        parent_id: props.category.parent_id ?? ('' as number | ''),
        name: props.category.name,
        slug: props.category.slug,
        description: props.category.description ?? '',
    },
    categoryValidationRules({
        name: t('admin.categories.name'),
        slug: t('admin.categories.slug'),
    }),
    (form) => form.patch(route('admin.categories.update', props.category.id)),
);
</script>

<template>
    <AdminResourceForm
        :title="t('admin.categories.edit')"
        :cancel-href="route('admin.categories.index')"
        :save-label="t('admin.categories.save')"
        :processing="form.processing"
        @submit="submit"
    >
        <CategoryFormFields
            :form="form"
            :categories="categories"
            :errors="fieldErrors"
        />
    </AdminResourceForm>
</template>
