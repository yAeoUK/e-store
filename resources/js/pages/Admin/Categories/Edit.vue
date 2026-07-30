<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import type {
    AdminCategory,
    AdminCategoryRef,
} from '@/components/admin/admin.ts';
import CategoryFormFields from '@/components/admin/CategoryFormFields.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import { pageTitleClass } from '@/components/classNames';
import FormActions from '@/components/FormActions.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    category: AdminCategory;
    categories: AdminCategoryRef[];
}>();

const form = useForm({
    parent_id: props.category.parent_id ?? ('' as number | ''),
    name: props.category.name,
    slug: props.category.slug,
    description: props.category.description ?? '',
});

function submit(): void {
    form.patch(route('admin.categories.update', props.category.id));
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.categories.edit')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.categories.edit') }}
            </h1>
        </template>

        <Card class="p-6">
            <form @submit.prevent="submit" class="space-y-4">
                <CategoryFormFields
                    v-model:name="form.name"
                    v-model:slug="form.slug"
                    v-model:parent_id="form.parent_id"
                    v-model:description="form.description"
                    :categories="categories"
                    :errors="form.errors"
                />

                <FormActions>
                    <ButtonLink :href="route('admin.categories.index')">
                        {{ t('common.cancel') }}
                    </ButtonLink>
                    <PrimaryButton :disabled="form.processing">
                        {{ t('admin.categories.save') }}
                    </PrimaryButton>
                </FormActions>
            </form>
        </Card>
    </AdminLayout>
</template>
