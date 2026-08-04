<script setup lang="ts">
import type {
    AdminCategoryRef,
    AdminProduct,
} from '@/components/admin/admin.ts';
import AdminResourceForm from '@/components/admin/AdminResourceForm.vue';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ProductImageManager from '@/components/admin/ProductImageManager.vue';
import ProductVariantManager from '@/components/admin/ProductVariantManager.vue';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { t } from '@/i18n';
import { integer, maxLength, min, numeric, required } from '@/lib/validation';

const props = defineProps<{
    product: AdminProduct & {
        short_description?: string | null;
        description?: string | null;
    };
    categories: AdminCategoryRef[];
}>();

const { form, clientErrors, submit } = useAdminResourceForm(
    {
        category_id: props.product.category?.id ?? ('' as number | ''),
        name: props.product.name,
        slug: props.product.slug,
        price: props.product.price,
        stock: props.product.stock,
        short_description: props.product.short_description ?? '',
        description: props.product.description ?? '',
        is_active: props.product.is_active,
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
    (form) => form.patch(route('admin.products.update', props.product.id)),
);
</script>

<template>
    <AdminResourceForm
        :title="t('admin.products.edit')"
        :cancel-href="route('admin.products.index')"
        :save-label="t('admin.products.save')"
        :processing="form.processing"
        @submit="submit"
    >
        <ProductFormFields
            :form="form"
            :categories="categories"
            :errors="{ ...clientErrors, ...form.errors }"
        />

        <template #after>
            <div class="mt-6">
                <ProductImageManager
                    :product-id="product.id"
                    :images="product.images ?? []"
                />
            </div>

            <div class="mt-6">
                <ProductVariantManager
                    :product-id="product.id"
                    :variants="product.variants ?? []"
                />
            </div>
        </template>
    </AdminResourceForm>
</template>
