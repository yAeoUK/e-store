<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
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
import { t } from '@/i18n';

defineProps<{
    admins: Paginated<AdminAdmin>;
}>();

const page = usePage();
// Non-null: this page is only reachable behind the `auth` + `admin` middleware.
const currentUserId = page.props.auth.user!.id;
const revokeBlockedMessage = computed(() => page.props.errors?.admin ?? null);

const columns: DataTableColumn<AdminAdmin>[] = [
    { key: 'name', label: t('admin.admins.columns.name') },
    { key: 'email', label: t('admin.admins.columns.email') },
    {
        key: 'created_at',
        label: t('admin.admins.columns.joined'),
        render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
];

const revokingAdmin = ref<AdminAdmin | null>(null);
const revoking = ref(false);

function confirmRevoke(admin: AdminAdmin): void {
    revokingAdmin.value = admin;
}

function revoke(): void {
    if (!revokingAdmin.value) {
        return;
    }

    revoking.value = true;

    router.delete(route('admin.admins.revoke', revokingAdmin.value.id), {
        preserveScroll: true,
        onFinish: () => {
            revoking.value = false;
            revokingAdmin.value = null;
        },
    });
}
</script>

<template>
    <AdminPageHeader
        :title="t('admin.admins.pageTitle')"
        :heading="t('admin.admins.heading')"
    >
        <template #actions>
            <ButtonLink variant="primary" :href="route('admin.admins.create')">
                {{ t('admin.admins.addAdmin') }}
            </ButtonLink>
        </template>

        <ErrorBanner v-if="revokeBlockedMessage">
            {{ revokeBlockedMessage }}
        </ErrorBanner>

        <DataTable
            :columns="columns"
            :rows="admins.data"
            :from="admins.from"
            :to="admins.to"
            :total="admins.total"
            :links="admins.links"
            :empty-message="t('admin.admins.empty')"
        >
            <template #actions="{ row }">
                <DangerButton
                    v-if="row.id !== currentUserId"
                    @click="confirmRevoke(row)"
                >
                    {{ t('admin.admins.revoke') }}
                </DangerButton>
            </template>
        </DataTable>

        <ConfirmationDialog
            :show="revokingAdmin !== null"
            :title="t('admin.admins.revokeConfirmTitle')"
            :message="t('admin.admins.revokeConfirmMessage')"
            :confirm-label="t('admin.admins.revoke')"
            danger
            :processing="revoking"
            @confirm="revoke"
            @cancel="revokingAdmin = null"
        />
    </AdminPageHeader>
</template>
