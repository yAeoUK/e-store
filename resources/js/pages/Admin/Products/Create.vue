<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { t } from '@/i18n';
import { integer, maxLength, min, numeric, required } from '@/lib/validation';

defineProps<{
    categories: AdminCategoryRef[];
}>();

const { form, clientErrors, submit } = useAdminResourceForm(
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
    {
        name: [
            required(t('admin.products.name')),
            maxLength(t('admin.products.name'), 255),
        ],
        price: [
            required(t('admin.products.price')),
            numeric(t('admin.products.price')),
            min(t('admin.products.price'), 0),
        ],
        stock: [
            integer(t('admin.products.stock')),
            min(t('admin.products.stock'), 0),
        ],
        short_description: [
            maxLength(t('admin.products.shortDescription'), 500),
        ],
        slug: [maxLength(t('admin.products.slug'), 255)],
    },
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
            :errors="{ ...clientErrors, ...form.errors }"
            auto-slug
        />
    </AdminResourceForm>
</template>
