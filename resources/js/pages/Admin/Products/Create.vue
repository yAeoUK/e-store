<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { productValidationRules } from '@/lib/validation';

defineProps<{
    categories: AdminCategoryRef[];
}>();

const { form, fieldErrors, submit } = useValidatedSubmit(
    {
        category_id: '' as number | '',
        name: '',
        slug: '',
        price: '' as number | '',
        stock: 0,
        short_description: '',
        description: '',
        is_active: true,
    },
    productValidationRules({
        name: t('admin.products.name'),
        price: t('admin.products.price'),
        stock: t('admin.products.stock'),
        shortDescription: t('admin.products.shortDescription'),
        slug: t('admin.products.slug'),
    }),
    (form) => form.post(route('admin.products.store')),
);
</script>

<template>
    <AdminResourceForm
        :title="t('admin.products.create')"
        :cancel-href="route('admin.products.index')"
        :save-label="t('admin.products.save')"
        :processing="form.processing"
        @submit="submit"
    >
        <ProductFormFields
            :form="form"
            :categories="categories"
            :errors="fieldErrors"
            auto-slug
        />
    </AdminResourceForm>
</template>
