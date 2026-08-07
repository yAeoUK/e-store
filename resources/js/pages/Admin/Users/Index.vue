<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ShieldCheck } from '@lucide/vue';
import type {
    AdminUser,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import LinkOrFallback from '@/components/admin/LinkOrFallback.vue';
import { filterFormClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import FilterSubmitButton from '@/components/FilterSubmitButton.vue';
import FormField from '@/components/FormField.vue';
import IconLabel from '@/components/IconLabel.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { useConfirmAction } from '@/composables/useConfirmAction';
import { submitFilters, useFilterForm } from '@/composables/useFilterForm';
import { t } from '@/i18n';
import { formatDate } from '@/lib/format';

interface Props {
    users: Paginated<AdminUser>;
    filters: {
        search?: string | null;
    };
}

const props = defineProps<Props>();

const { state: filterState, normalize } = useFilterForm(props.filters, {
    search: '',
});

function applyFilters(): void {
    submitFilters('admin.users.index', normalize());
}

const columns: DataTableColumn<AdminUser>[] = [
    { key: 'name', label: t('admin.users.columns.name') },
    { key: 'email', label: t('admin.users.columns.email') },
    {
        key: 'orders_count',
        label: t('admin.users.columns.orders'),
        align: 'end',
    },
    {
        key: 'role',
        label: t('admin.users.columns.role'),
        render: (row) =>
            row.is_admin
                ? t('admin.users.roleAdmin')
                : t('admin.users.roleUser'),
    },
    {
        key: 'created_at',
        label: t('admin.users.columns.joined'),
        render: (row) => formatDate(row.created_at),
    },
];

const {
    confirming: promotingUser,
    processing: promoting,
    confirm: confirmPromote,
    cancel: cancelPromote,
    run: promote,
} = useConfirmAction<AdminUser>((user, onFinish) => {
    router.post(
        route('admin.admins.promote'),
        { email: user.email },
        { preserveScroll: true, onFinish },
    );
});
</script>

<template>
    <AdminPageHeader
        :title="t('admin.users.pageTitle')"
        :heading="t('admin.users.heading')"
    >
        <form @submit.prevent="applyFilters" :class="filterFormClass">
            <FormField
                v-model="filterState.search"
                type="text"
                :label="t('admin.users.searchPlaceholder')"
            />
            <FilterSubmitButton>{{ t('common.confirm') }}</FilterSubmitButton>
        </form>

        <DataTable
            :columns="columns"
            :paginated="users"
            :empty-message="t('admin.users.empty')"
        >
            <template #cell-orders_count="{ row }">
                <LinkOrFallback
                    :show="!!row.orders_count"
                    :href="route('admin.orders.index', { user_id: row.id })"
                    fallback="0"
                >
                    {{ row.orders_count }}
                </LinkOrFallback>
            </template>

            <template #actions="{ row }">
                <SecondaryButton
                    v-if="!row.is_admin"
                    type="button"
                    @click="confirmPromote(row)"
                >
                    <IconLabel :icon="ShieldCheck">{{
                        t('admin.users.promote')
                    }}</IconLabel>
                </SecondaryButton>
            </template>
        </DataTable>

        <ConfirmationDialog
            :show="promotingUser !== null"
            :title="t('admin.users.promoteConfirmTitle')"
            :message="t('admin.users.promoteConfirmMessage')"
            :confirm-label="t('admin.users.promote')"
            :processing="promoting"
            @confirm="promote"
            @cancel="cancelPromote"
        />
    </AdminPageHeader>
</template>
