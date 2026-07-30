<script setup lang="ts">
import type { AdminCategoryRef } from '@/components/admin/admin.ts';
import SlugField from '@/components/admin/SlugField.vue';
import { formGridClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import SelectField from '@/components/SelectField.vue';
import TextareaField from '@/components/TextareaField.vue';
import { t } from '@/i18n';

defineProps<{
    categories: AdminCategoryRef[];
    errors: Partial<
        Record<'name' | 'slug' | 'parent_id' | 'description', string>
    >;
    // Auto-fills the slug from the name while it hasn't been hand-edited.
    // Omit on edit forms so an existing slug never changes just because the
    // name was edited.
    autoSlug?: boolean;
}>();

const name = defineModel<string>('name', { default: '' });
const slug = defineModel<string>('slug', { default: '' });
const parentId = defineModel<number | ''>('parent_id', { default: '' });
const description = defineModel<string>('description', { default: '' });
</script>

<template>
    <div :class="formGridClass">
        <FormField
            v-model="name"
            type="text"
            :label="t('admin.categories.name')"
            :error="errors.name"
        />
        <SlugField
            v-model="slug"
            :label="t('admin.categories.slug')"
            :source="autoSlug ? name : undefined"
            :error="errors.slug"
        />
    </div>

    <SelectField v-model="parentId" :label="t('admin.categories.parent')">
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
        v-model="description"
        :label="t('admin.categories.description')"
        rows="4"
    />
</template>
