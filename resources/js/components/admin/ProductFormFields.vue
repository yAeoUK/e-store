<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import SlugField from '@/components/admin/SlugField.vue';
import CheckboxField from '@/components/CheckboxField.vue';
import { formGrid3Class, formGridClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import SelectField from '@/components/SelectField.vue';
import TextareaField from '@/components/TextareaField.vue';
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

defineProps<{
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
    // Auto-fills the slug from the name while it hasn't been hand-edited.
    // Omit on edit forms so an existing slug never changes just because the
    // name was edited.
    autoSlug?: boolean;
}>();
</script>

<template>
    <div :class="formGridClass">
        <FormField
            v-model="form.name"
            type="text"
            :label="t('admin.products.name')"
            :error="errors.name"
            required
        />
        <SlugField
            v-model="form.slug"
            :label="t('admin.products.slug')"
            :source="autoSlug ? form.name : undefined"
            :error="errors.slug"
        />
    </div>

    <div :class="formGrid3Class">
        <SelectField
            v-model="form.category_id"
            :label="t('admin.products.category')"
        >
            <option value="">
                {{ t('admin.products.noCategory') }}
            </option>
            <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
            >
                {{ category.name }}
            </option>
        </SelectField>
        <FormField
            v-model="form.price"
            type="number"
            min="0"
            step="0.01"
            :label="t('admin.products.price')"
            :error="errors.price"
            required
        />
        <FormField
            v-model="form.stock"
            type="number"
            min="0"
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

    <TextareaField
        v-model="form.description"
        :label="t('admin.products.description')"
        rows="4"
    />

    <CheckboxField
        v-model:checked="form.is_active"
        :label="t('admin.products.isActive')"
    />
</template>
