<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type {
    AdminCategoryRef,
    AdminProduct,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { linkClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SelectField from '@/components/SelectField.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
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

const search = ref(props.filters.search ?? '');
const categoryId = ref(props.filters.category_id ?? '');

function applyFilters(): void {
    router.get(
        route('admin.products.index'),
        {
            search: search.value || null,
            category_id: categoryId.value || null,
        },
        { preserveState: true, replace: true },
    );
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
    destroy,
} = useDeleteConfirmation((id: number) => route('admin.products.destroy', id));
</script>

<template>
    <AdminPageHeader
        :title="t('admin.products.pageTitle')"
        :heading="t('admin.products.heading')"
    >
        <template #actions>
            <ButtonLink variant="primary" :href="route('admin.products.create')">
                {{ t('admin.products.create') }}
            </ButtonLink>
        </template>

        <form
            @submit.prevent="applyFilters"
            class="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
        >
            <FormField
                v-model="search"
                type="text"
                :label="t('admin.products.searchPlaceholder')"
            />

            <SelectField
                v-model="categoryId"
                :label="t('admin.products.category')"
            >
                <option value="">{{ t('admin.categories.none') }}</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </SelectField>

            <PrimaryButton type="submit">{{
                t('common.confirm')
            }}</PrimaryButton>
        </form>

        <DataTable
            :columns="columns"
            :rows="products.data"
            :from="products.from"
            :to="products.to"
            :total="products.total"
            :links="products.links"
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
                <div class="flex justify-end gap-2">
                    <ButtonLink :href="route('admin.products.edit', row.id)">
                        {{ t('admin.actions.edit') }}
                    </ButtonLink>
                    <DangerButton @click="confirmDelete(row.id)">
                        {{ t('admin.actions.delete') }}
                    </DangerButton>
                </div>
            </template>
        </DataTable>

        <ConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteConfirmTitle')"
            :message="t('admin.products.deleteConfirmMessage')"
            :confirm-label="t('common.delete')"
            danger
            :processing="deleting"
            @confirm="destroy"
            @cancel="confirmingDeleteId = null"
        />
    </AdminPageHeader>
</template>
