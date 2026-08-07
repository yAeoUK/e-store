<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import type {
    AdminCategoryRef,
    AdminProduct,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import CategorySelectField from '@/components/admin/CategorySelectField.vue';
import DataTable from '@/components/admin/DataTable.vue';
import RowEditDeleteActions from '@/components/admin/RowEditDeleteActions.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { linkClass } from '@/components/classNames';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import FilterSubmitButton from '@/components/FilterSubmitButton.vue';
import FormField from '@/components/FormField.vue';
import IconLabel from '@/components/IconLabel.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { submitFilters, useFilterForm } from '@/composables/useFilterForm';
import { t } from '@/i18n';
import { formatCurrency } from '@/lib/format';

interface Props {
    products: Paginated<AdminProduct>;
    categories: AdminCategoryRef[];
    filters: {
        search?: string | null;
        category_id?: number | null;
        stock_status?: string | null;
    };
}

const props = defineProps<Props>();

const { state: filterState, normalize } = useFilterForm(props.filters, {
    search: '',
    category_id: '' as string | number,
});

function applyFilters(): void {
    submitFilters('admin.products.index', normalize());
}

const columns: DataTableColumn<AdminProduct>[] = [
    { key: 'name', label: t('admin.products.columns.name') },
    {
        key: 'category',
        label: t('admin.products.columns.category'),
    },
    {
        key: 'price',
        label: t('admin.products.columns.price'),
        align: 'end',
        render: (row) => formatCurrency(row.price),
    },
    { key: 'stock', label: t('admin.products.columns.stock'), align: 'end' },
    {
        key: 'status',
        label: t('admin.products.columns.status'),
        render: (row) =>
            row.is_active
                ? t('admin.products.isActive')
                : t('admin.products.isInactive'),
    },
];

const {
    confirmingId: confirmingDeleteId,
    deleting,
    confirmDelete,
    cancel,
    destroy,
} = useDeleteConfirmation((id: number) => route('admin.products.destroy', id));
</script>

<template>
    <AdminPageHeader
        :title="t('admin.products.pageTitle')"
        :heading="t('admin.products.heading')"
    >
        <template #actions>
            <ButtonLink
                variant="primary"
                :href="route('admin.products.create')"
            >
                <IconLabel :icon="Plus">{{
                    t('admin.products.create')
                }}</IconLabel>
            </ButtonLink>
        </template>

        <form
            @submit.prevent="applyFilters"
            class="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
        >
            <FormField
                v-model="filterState.search"
                type="text"
                :label="t('admin.products.searchPlaceholder')"
            />

            <CategorySelectField
                v-model="filterState.category_id"
                :label="t('admin.products.category')"
                :none-label="t('admin.categories.none')"
                :categories="categories"
            />

            <FilterSubmitButton>{{ t('common.confirm') }}</FilterSubmitButton>
        </form>

        <DataTable
            :columns="columns"
            :paginated="products"
            :empty-message="t('admin.products.empty')"
        >
            <template #cell-category="{ row }">
                <Link
                    v-if="row.category"
                    :href="route('admin.categories.edit', row.category.id)"
                    :class="linkClass"
                >
                    {{ row.category.name }}
                </Link>
                <span v-else>{{ t('admin.products.noCategory') }}</span>
            </template>

            <template #actions="{ row }">
                <RowEditDeleteActions
                    :edit-href="route('admin.products.edit', row.id)"
                    @delete="confirmDelete(row.id)"
                />
            </template>
        </DataTable>

        <DeleteConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteConfirmTitle')"
            :message="t('admin.products.deleteConfirmMessage')"
            :processing="deleting"
            @confirm="destroy"
            @cancel="cancel"
        />
    </AdminPageHeader>
</template>
