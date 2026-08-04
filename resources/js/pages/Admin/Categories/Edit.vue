<script setup lang="ts">
import type {
    AdminCategory,
    AdminCategoryRef,
} from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { t } from '@/i18n';
import { maxLength, required } from '@/lib/validation';

const props = defineProps<{
    category: AdminCategory;
    categories: AdminCategoryRef[];
}>();

const { form, clientErrors, submit } = useAdminResourceForm(
    {
        parent_id: props.category.parent_id ?? ('' as number | ''),
        name: props.category.name,
        slug: props.category.slug,
        description: props.category.description ?? '',
    },
    {
        name: [
            required(t('admin.categories.name')),
            maxLength(t('admin.categories.name'), 255),
        ],
        slug: [maxLength(t('admin.categories.slug'), 255)],
    },
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
            :errors="{ ...clientErrors, ...form.errors }"
        />
    </AdminResourceForm>
</template>
