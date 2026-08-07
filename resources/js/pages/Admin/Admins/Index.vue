<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { Plus, Trash2 } from '@lucide/vue';
import type {
    AdminAdmin,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import DataTable from '@/components/admin/DataTable.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import ErrorBanner from '@/components/ErrorBanner.vue';
import IconLabel from '@/components/IconLabel.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { useServerError } from '@/composables/useServerError';
import { t } from '@/i18n';
import { formatDate } from '@/lib/format';

defineProps<{
    admins: Paginated<AdminAdmin>;
}>();

const page = usePage();
// Non-null: this page is only reachable behind the `auth` + `admin` middleware.
const currentUserId = page.props.auth.user!.id;
const revokeBlockedMessage = useServerError('admin');

const columns: DataTableColumn<AdminAdmin>[] = [
    { key: 'name', label: t('admin.admins.columns.name') },
    { key: 'email', label: t('admin.admins.columns.email') },
    {
        key: 'created_at',
        label: t('admin.admins.columns.joined'),
        render: (row) => formatDate(row.created_at),
    },
];

const {
    confirmingId: revokingAdminId,
    deleting: revoking,
    confirmDelete: confirmRevoke,
    cancel: cancelRevoke,
    destroy: revoke,
} = useDeleteConfirmation((id: number) => route('admin.admins.revoke', id));
</script>

<template>
    <AdminPageHeader
        :title="t('admin.admins.pageTitle')"
        :heading="t('admin.admins.heading')"
    >
        <template #actions>
            <ButtonLink variant="primary" :href="route('admin.admins.create')">
                <IconLabel :icon="Plus">{{
                    t('admin.admins.addAdmin')
                }}</IconLabel>
            </ButtonLink>
        </template>

        <ErrorBanner v-if="revokeBlockedMessage">
            {{ revokeBlockedMessage }}
        </ErrorBanner>

        <DataTable
            :columns="columns"
            :paginated="admins"
            :empty-message="t('admin.admins.empty')"
        >
            <template #actions="{ row }">
                <DangerButton
                    v-if="row.id !== currentUserId"
                    @click="confirmRevoke(row.id)"
                >
                    <IconLabel :icon="Trash2">{{
                        t('admin.admins.revoke')
                    }}</IconLabel>
                </DangerButton>
            </template>
        </DataTable>

        <ConfirmationDialog
            :show="revokingAdminId !== null"
            :title="t('admin.admins.revokeConfirmTitle')"
            :message="t('admin.admins.revokeConfirmMessage')"
            :confirm-label="t('admin.admins.revoke')"
            danger
            :processing="revoking"
            @confirm="revoke"
            @cancel="cancelRevoke"
        />
    </AdminPageHeader>
</template>
