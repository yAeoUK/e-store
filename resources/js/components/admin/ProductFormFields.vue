<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import SlugField from '@/components/admin/SlugField.vue';
import CheckboxField from '@/components/CheckboxField.vue';
import { formGridClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import SelectField from '@/components/SelectField.vue';
import TextareaField from '@/components/TextareaField.vue';
import { t } from '@/i18n';

defineProps<{
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

const name = defineModel<string>('name', { default: '' });
const slug = defineModel<string>('slug', { default: '' });
const categoryId = defineModel<number | ''>('category_id', { default: '' });
const price = defineModel<number | string>('price', { default: '' });
const stock = defineModel<number>('stock', { default: 0 });
const shortDescription = defineModel<string>('short_description', {
    default: '',
});
const description = defineModel<string>('description', { default: '' });
const isActive = defineModel<boolean>('is_active', { default: true });
</script>

<template>
    <div :class="formGridClass">
        <FormField
            v-model="name"
            type="text"
            :label="t('admin.products.name')"
            :error="errors.name"
        />
        <SlugField
            v-model="slug"
            :label="t('admin.products.slug')"
            :source="autoSlug ? name : undefined"
            :error="errors.slug"
        />
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <SelectField
            v-model="categoryId"
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
            v-model="price"
            type="number"
            min="0"
            step="0.01"
            :label="t('admin.products.price')"
            :error="errors.price"
        />
        <FormField
            v-model="stock"
            type="number"
            min="0"
            :label="t('admin.products.stock')"
            :error="errors.stock"
        />
    </div>

    <FormField
        v-model="shortDescription"
        type="text"
        :label="t('admin.products.shortDescription')"
        :error="errors.short_description"
    />

    <TextareaField
        v-model="description"
        :label="t('admin.products.description')"
        rows="4"
    />

    <CheckboxField
        v-model:checked="isActive"
        :label="t('admin.products.isActive')"
    />
</template>
