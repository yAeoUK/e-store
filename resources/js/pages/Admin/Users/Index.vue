<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type {
    AdminUser,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import DataTable from '@/components/admin/DataTable.vue';
import { filterFormClass, linkClass, pageTitleClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

interface Props {
    users: Paginated<AdminUser>;
    filters: {
        search?: string | null;
    };
}

const props = defineProps<Props>();

const search = ref(props.filters.search ?? '');

function applyFilters(): void {
    router.get(
        route('admin.users.index'),
        { search: search.value || null },
        { preserveState: true, replace: true },
    );
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
        render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
];

const promotingUser = ref<AdminUser | null>(null);
const promoting = ref(false);

function confirmPromote(user: AdminUser): void {
    promotingUser.value = user;
}

function promote(): void {
    if (!promotingUser.value) {
        return;
    }

    promoting.value = true;

    router.post(
        route('admin.admins.promote'),
        { email: promotingUser.value.email },
        {
            preserveScroll: true,
            onFinish: () => {
                promoting.value = false;
                promotingUser.value = null;
            },
        },
    );
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.users.pageTitle')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.users.heading') }}
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
            :rows="users.data"
            :from="users.from"
            :to="users.to"
            :total="users.total"
            :links="users.links"
            :empty-message="t('admin.users.empty')"
        >
            <template #cell-orders_count="{ row }">
                <Link
                    v-if="row.orders_count"
                    :href="route('admin.orders.index', { user_id: row.id })"
                    :class="linkClass"
                >
                    {{ row.orders_count }}
                </Link>
                <span v-else>0</span>
            </template>

            <template #actions="{ row }">
                <SecondaryButton
                    v-if="!row.is_admin"
                    type="button"
                    @click="confirmPromote(row)"
                >
                    {{ t('admin.users.promote') }}
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
            @cancel="promotingUser = null"
        />
    </AdminLayout>
</template>
