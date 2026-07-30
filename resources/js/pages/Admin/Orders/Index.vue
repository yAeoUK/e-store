<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type {
    AdminOrder,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import DataTable from '@/components/admin/DataTable.vue';
import { filterFormClass, pageTitleClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { Badge } from '@/components/ui/badge';
import type { BadgeVariants } from '@/components/ui/badge';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

interface Props {
    orders: Paginated<AdminOrder>;
    filters: {
        search?: string | null;
        user_id?: number | null;
    };
}

const props = defineProps<Props>();

const search = ref(props.filters.search ?? '');

function applyFilters(): void {
    router.get(
        route('admin.orders.index'),
        {
            search: search.value || null,
            user_id: props.filters.user_id ?? null,
        },
        { preserveState: true, replace: true },
    );
}

const columns: DataTableColumn<AdminOrder>[] = [
    { key: 'id', label: t('admin.orders.columns.id') },
    {
        key: 'customer',
        label: t('admin.orders.columns.customer'),
    },
    {
        key: 'total',
        label: t('admin.orders.columns.total'),
        align: 'end',
        render: (row) => `$${Number(row.total).toFixed(2)}`,
    },
    { key: 'status', label: t('admin.orders.columns.status') },
    {
        key: 'created_at',
        label: t('admin.orders.columns.date'),
        render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
];

const statusVariants: Record<string, NonNullable<BadgeVariants['variant']>> = {
    pending: 'outline',
    processing: 'secondary',
    completed: 'default',
    cancelled: 'destructive',
};

function statusVariant(status: string): NonNullable<BadgeVariants['variant']> {
    return statusVariants[status] ?? 'outline';
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.orders.pageTitle')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.orders.heading') }}
            </h1>
        </template>

        <form
            @submit.prevent="applyFilters"
            :class="filterFormClass"
        >
            <FormField
                v-model="search"
                type="text"
                :label="t('admin.users.searchPlaceholder')"
            />
            <PrimaryButton type="submit">{{
                t('common.confirm')
            }}</PrimaryButton>
        </form>

        <DataTable
            :columns="columns"
            :rows="orders.data"
            :from="orders.from"
            :to="orders.to"
            :total="orders.total"
            :links="orders.links"
            :empty-message="t('admin.orders.empty')"
        >
            <template #cell-customer="{ row }">
                <span v-if="row.user"
                    >{{ row.user.name }} ({{ row.user.email }})</span
                >
                <span v-else>—</span>
            </template>

            <template #cell-status="{ row }">
                <Badge :variant="statusVariant(row.status)">
                    {{ t(`admin.orders.statuses.${row.status}`) }}
                </Badge>
            </template>
        </DataTable>
    </AdminLayout>
</template>
