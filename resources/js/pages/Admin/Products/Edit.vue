<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import type {
    AdminCategoryRef,
    AdminProduct,
} from '@/components/admin/admin.ts';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ProductImageManager from '@/components/admin/ProductImageManager.vue';
import ProductVariantManager from '@/components/admin/ProductVariantManager.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import { pageTitleClass } from '@/components/classNames';
import FormActions from '@/components/FormActions.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    product: AdminProduct & {
        short_description?: string | null;
        description?: string | null;
    };
    categories: AdminCategoryRef[];
}>();

const form = useForm({
    category_id: props.product.category?.id ?? ('' as number | ''),
    name: props.product.name,
    slug: props.product.slug,
    price: props.product.price,
    stock: props.product.stock,
    short_description: props.product.short_description ?? '',
    description: props.product.description ?? '',
    is_active: props.product.is_active,
});

function submit(): void {
    form.patch(route('admin.products.update', props.product.id));
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.products.edit')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.products.edit') }}
            </h1>
        </template>

        <Card class="p-6">
            <form @submit.prevent="submit" class="space-y-4">
                <ProductFormFields
                    v-model:name="form.name"
                    v-model:slug="form.slug"
                    v-model:category_id="form.category_id"
                    v-model:price="form.price"
                    v-model:stock="form.stock"
                    v-model:short_description="form.short_description"
                    v-model:description="form.description"
                    v-model:is_active="form.is_active"
                    :categories="categories"
                    :errors="form.errors"
                />

                <FormActions>
                    <ButtonLink :href="route('admin.products.index')">
                        {{ t('common.cancel') }}
                    </ButtonLink>
                    <PrimaryButton :disabled="form.processing">
                        {{ t('admin.products.save') }}
                    </PrimaryButton>
                </FormActions>
            </form>
        </Card>

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
    </AdminLayout>
</template>
