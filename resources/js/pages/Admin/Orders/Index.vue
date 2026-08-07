<script setup lang="ts">
import { Eye } from '@lucide/vue';
import type {
    AdminOrder,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import {
    filterFormClass,
    formGridClass,
    formGrid3Class,
} from '@/components/classNames';
import CustomerContact from '@/components/CustomerContact.vue';
import FilterSubmitButton from '@/components/FilterSubmitButton.vue';
import FormField from '@/components/FormField.vue';
import IconLabel from '@/components/IconLabel.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import SelectField from '@/components/SelectField.vue';
import { submitFilters, useFilterForm } from '@/composables/useFilterForm';
import { t } from '@/i18n';
import { formatCurrency, formatDate } from '@/lib/format';

const ORDER_STATUS_VALUES = [
    'pending',
    'processing',
    'completed',
    'cancelled',
] as const;

interface Props {
    orders: Paginated<AdminOrder>;
    filters: {
        search?: string | null;
        user_id?: number | null;
        status?: string | null;
        date_from?: string | null;
        date_to?: string | null;
    };
}

const props = defineProps<Props>();

const { state: filterState, normalize } = useFilterForm(props.filters, {
    search: '',
    status: '',
    date_from: '',
    date_to: '',
});

function applyFilters(): void {
    submitFilters('admin.orders.index', {
        ...normalize(),
        user_id: props.filters.user_id ?? null,
    });
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
            <div :class="formGrid3Class">
                <FormField
                    v-model="filterState.search"
                    type="text"
                    :label="t('admin.orders.searchPlaceholder')"
                />
                <SelectField
                    v-model="filterState.status"
                    :label="t('admin.orders.statusFilter')"
                >
                    <option value="">
                        {{ t('admin.orders.allStatuses') }}
                    </option>
                    <option
                        v-for="value in ORDER_STATUS_VALUES"
                        :key="value"
                        :value="value"
                    >
                        {{ t(`admin.orders.statuses.${value}`) }}
                    </option>
                </SelectField>
                <div :class="formGridClass">
                    <FormField
                        v-model="filterState.date_from"
                        type="date"
                        :label="t('admin.orders.dateFrom')"
                    />
                    <FormField
                        v-model="filterState.date_to"
                        type="date"
                        :label="t('admin.orders.dateTo')"
                    />
                </div>
            </div>
            <FilterSubmitButton>{{ t('common.confirm') }}</FilterSubmitButton>
        </form>

        <DataTable
            :columns="columns"
            :paginated="orders"
            :empty-message="t('admin.orders.empty')"
        >
            <template #cell-customer="{ row }">
                <CustomerContact :user="row.user ?? null" />
            </template>

            <template #cell-status="{ row }">
                <OrderStatusBadge
                    :status="row.status"
                    namespace="admin.orders"
                />
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

            <template #actions="{ row }">
                <ButtonLink :href="route('admin.orders.show', row.id)">
                    <IconLabel :icon="Eye">{{
                        t('admin.actions.view')
                    }}</IconLabel>
                </ButtonLink>
            </template>
        </DataTable>
    </AdminPageHeader>
</template>
