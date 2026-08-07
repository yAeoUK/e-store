<script setup lang="ts">
import { Plus } from '@lucide/vue';
import type {
    AdminCategory,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import LinkOrFallback from '@/components/admin/LinkOrFallback.vue';
import RowEditDeleteActions from '@/components/admin/RowEditDeleteActions.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { filterFormClass } from '@/components/classNames';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import ErrorBanner from '@/components/ErrorBanner.vue';
import FilterSubmitButton from '@/components/FilterSubmitButton.vue';
import FormField from '@/components/FormField.vue';
import IconLabel from '@/components/IconLabel.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { submitFilters, useFilterForm } from '@/composables/useFilterForm';
import { useServerError } from '@/composables/useServerError';
import { t } from '@/i18n';

interface Props {
    categories: Paginated<AdminCategory>;
    filters: {
        search?: string | null;
        parent_id?: number | null;
    };
}

const props = defineProps<Props>();

const deleteBlockedMessage = useServerError('category');

const { state: filterState, normalize } = useFilterForm(props.filters, {
    search: '',
});

function applyFilters(): void {
    submitFilters('admin.categories.index', normalize());
}

const columns: DataTableColumn<AdminCategory>[] = [
    { key: 'name', label: t('admin.categories.columns.name') },
    { key: 'parent', label: t('admin.categories.columns.parent') },
    {
        key: 'products_count',
        label: t('admin.categories.columns.products'),
        align: 'end',
    },
    {
        key: 'children_count',
        label: t('admin.categories.columns.subcategories'),
        align: 'end',
    },
];

const {
    confirmingId: confirmingDeleteId,
    deleting,
    confirmDelete,
    cancel,
    destroy,
} = useDeleteConfirmation((id: number) =>
    route('admin.categories.destroy', id),
);
</script>

<template>
    <AdminPageHeader
        :title="t('admin.categories.pageTitle')"
        :heading="t('admin.categories.heading')"
    >
        <template #actions>
            <ButtonLink
                variant="primary"
                :href="route('admin.categories.create')"
            >
                <IconLabel :icon="Plus">{{
                    t('admin.categories.create')
                }}</IconLabel>
            </ButtonLink>
        </template>

        <ErrorBanner v-if="deleteBlockedMessage">
            {{ deleteBlockedMessage }}
        </ErrorBanner>

        <form @submit.prevent="applyFilters" :class="filterFormClass">
            <FormField
                v-model="filterState.search"
                type="text"
                :label="t('admin.categories.searchPlaceholder')"
            />
            <FilterSubmitButton>{{ t('common.confirm') }}</FilterSubmitButton>
        </form>

        <DataTable
            :columns="columns"
            :paginated="categories"
            :empty-message="t('admin.categories.empty')"
        >
            <template #cell-parent="{ row }">
                <LinkOrFallback
                    :show="!!row.parent"
                    :href="
                        row.parent
                            ? route('admin.categories.edit', row.parent.id)
                            : undefined
                    "
                    :fallback="t('admin.categories.none')"
                >
                    {{ row.parent?.name }}
                </LinkOrFallback>
            </template>

            <template #cell-products_count="{ row }">
                <LinkOrFallback
                    :show="!!row.products_count"
                    :href="
                        route('admin.products.index', { category_id: row.id })
                    "
                    fallback="0"
                >
                    {{ row.products_count }}
                </LinkOrFallback>
            </template>

            <template #cell-children_count="{ row }">
                <LinkOrFallback
                    :show="!!row.children_count"
                    :href="
                        route('admin.categories.index', { parent_id: row.id })
                    "
                    fallback="0"
                >
                    {{ row.children_count }}
                </LinkOrFallback>
            </template>

            <template #actions="{ row }">
                <RowEditDeleteActions
                    :edit-href="route('admin.categories.edit', row.id)"
                    @delete="confirmDelete(row.id)"
                />
            </template>
        </DataTable>

        <DeleteConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.categories.deleteConfirmTitle')"
            :message="t('admin.categories.deleteConfirmMessage')"
            :processing="deleting"
            @confirm="destroy"
            @cancel="cancel"
        />
    </AdminPageHeader>
</template>
