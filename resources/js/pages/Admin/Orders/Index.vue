<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type {
    AdminOrder,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import { filterFormClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import { formatCurrency, formatDate } from '@/lib/format';

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
        render: (row) => formatCurrency(row.total),
    },
    { key: 'status', label: t('admin.orders.columns.status') },
    { key: 'payment', label: t('admin.orders.columns.payment') },
    {
        key: 'created_at',
        label: t('admin.orders.columns.date'),
        render: (row) => formatDate(row.created_at),
    },
];
</script>

<template>
    <AdminPageHeader
        :title="t('admin.orders.pageTitle')"
        :heading="t('admin.orders.heading')"
    >
        <form @submit.prevent="applyFilters" :class="filterFormClass">
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
                <OrderStatusBadge :status="row.status" namespace="admin.orders" />
            </template>

            <template #cell-payment="{ row }">
                <div class="flex flex-col gap-1">
                    <span v-if="row.payment_method" class="text-sm">
                        {{
                            t(
                                `admin.orders.paymentMethods.${row.payment_method}`,
                            )
                        }}
                    </span>
                    <PaymentStatusBadge
                        :status="row.payment_status"
                        namespace="admin.orders"
                    />
                </div>
            </template>
        </DataTable>
    </AdminPageHeader>
</template>
