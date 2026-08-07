<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import type {
    AdminCategoryRef,
    AutoSlugProp,
} from '@/components/admin/admin.ts';
import CategorySelectField from '@/components/admin/CategorySelectField.vue';
import DescriptionField from '@/components/admin/DescriptionField.vue';
import NameSlugFields from '@/components/admin/NameSlugFields.vue';
import { t } from '@/i18n';

interface CategoryFormValues {
    parent_id: number | '';
    name: string;
    slug: string;
    description: string;
}

defineProps<
    {
        form: InertiaForm<CategoryFormValues>;
        categories: AdminCategoryRef[];
        errors: Partial<
            Record<'name' | 'slug' | 'parent_id' | 'description', string>
        >;
    } & AutoSlugProp
>();
</script>

<template>
    <NameSlugFields
        :form="form"
        :name-label="t('admin.categories.name')"
        :slug-label="t('admin.categories.slug')"
        :errors="errors"
        :auto-slug="autoSlug"
    />

    <CategorySelectField
        v-model="form.parent_id"
        :label="t('admin.categories.parent')"
        :none-label="t('admin.categories.none')"
        :categories="categories"
    />

    <DescriptionField
        v-model="form.description"
        :label="t('admin.categories.description')"
    />
</template>
