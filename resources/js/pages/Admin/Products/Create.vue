<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import ProductFormFields from '@/components/admin/ProductFormFields.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import { pageTitleClass } from '@/components/classNames';
import FormActions from '@/components/FormActions.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps<{
    categories: AdminCategoryRef[];
}>();

const form = useForm({
    category_id: '' as number | '',
    name: '',
    slug: '',
    price: '' as number | '',
    stock: 0,
    short_description: '',
    description: '',
    is_active: true,
});

function submit(): void {
    form.post(route('admin.products.store'));
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.products.create')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.products.create') }}
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
                    auto-slug
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
    </AdminLayout>
</template>
