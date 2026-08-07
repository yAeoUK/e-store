<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import type {
    AdminCategoryRef,
    AutoSlugProp,
} from '@/components/admin/admin.ts';
import CategorySelectField from '@/components/admin/CategorySelectField.vue';
import DescriptionField from '@/components/admin/DescriptionField.vue';
import IsActiveField from '@/components/admin/IsActiveField.vue';
import NameSlugFields from '@/components/admin/NameSlugFields.vue';
import PriceField from '@/components/admin/PriceField.vue';
import StockField from '@/components/admin/StockField.vue';
import { formGrid3Class } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import { t } from '@/i18n';

interface ProductFormValues {
    category_id: number | '';
    name: string;
    slug: string;
    price: number | string;
    stock: number;
    short_description: string;
    description: string;
    is_active: boolean;
}

defineProps<
    {
        form: InertiaForm<ProductFormValues>;
        categories: AdminCategoryRef[];
        errors: Partial<
            Record<
                | 'name'
                | 'slug'
                | 'category_id'
                | 'price'
                | 'stock'
                | 'short_description'
                | 'description',
                string
            >
        >;
    } & AutoSlugProp
>();
</script>

<template>
    <NameSlugFields
        :form="form"
        :name-label="t('admin.products.name')"
        :slug-label="t('admin.products.slug')"
        :errors="errors"
        :auto-slug="autoSlug"
    />

    <div :class="formGrid3Class">
        <CategorySelectField
            v-model="form.category_id"
            :label="t('admin.products.category')"
            :none-label="t('admin.products.noCategory')"
            :categories="categories"
        />
        <PriceField
            v-model="form.price"
            :label="t('admin.products.price')"
            :error="errors.price"
            required
        />
        <StockField
            v-model="form.stock"
            :label="t('admin.products.stock')"
            :error="errors.stock"
        />
    </div>

    <FormField
        v-model="form.short_description"
        type="text"
        :label="t('admin.products.shortDescription')"
        :error="errors.short_description"
    />

    <DescriptionField
        v-model="form.description"
        :label="t('admin.products.description')"
    />

    <IsActiveField v-model:checked="form.is_active" />
</template>
