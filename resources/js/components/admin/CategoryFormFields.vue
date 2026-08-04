<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import SlugField from '@/components/admin/SlugField.vue';
import { formGridClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import SelectField from '@/components/SelectField.vue';
import TextareaField from '@/components/TextareaField.vue';
import { t } from '@/i18n';

interface CategoryFormValues {
    parent_id: number | '';
    name: string;
    slug: string;
    description: string;
}

defineProps<{
    form: InertiaForm<CategoryFormValues>;
    categories: AdminCategoryRef[];
    errors: Partial<
        Record<'name' | 'slug' | 'parent_id' | 'description', string>
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
            :label="t('admin.categories.name')"
            :error="errors.name"
            required
        />
        <SlugField
            v-model="form.slug"
            :label="t('admin.categories.slug')"
            :source="autoSlug ? form.name : undefined"
            :error="errors.slug"
        />
    </div>

    <SelectField v-model="form.parent_id" :label="t('admin.categories.parent')">
        <option value="">
            {{ t('admin.categories.none') }}
        </option>
        <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
        >
            {{ category.name }}
        </option>
    </SelectField>

    <TextareaField
        v-model="form.description"
        :label="t('admin.categories.description')"
        rows="4"
    />
</template>
