<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import type {
    AdminCategory,
    DataTableColumn,
    Paginated,
} from '@/components/admin/admin.ts';
import DataTable from '@/components/admin/DataTable.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import {
    filterFormClass,
    linkClass,
    pageTitleClass,
    wrapBetweenClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import ErrorBanner from '@/components/ErrorBanner.vue';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';

interface Props {
    categories: Paginated<AdminCategory>;
    filters: {
        search?: string | null;
        parent_id?: number | null;
    };
}

const props = defineProps<Props>();

const page = usePage();
const deleteBlockedMessage = computed(
    () => page.props.errors?.category ?? null,
);

const search = ref(props.filters.search ?? '');

function applyFilters(): void {
    router.get(
        route('admin.categories.index'),
        { search: search.value || null },
        { preserveState: true, replace: true },
    );
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

const confirmingDeleteId = ref<number | null>(null);
const deleting = ref(false);

function confirmDelete(id: number): void {
    confirmingDeleteId.value = id;
}

function destroy(): void {
    if (confirmingDeleteId.value === null) {
        return;
    }

    deleting.value = true;

    router.delete(route('admin.categories.destroy', confirmingDeleteId.value), {
        preserveScroll: true,
        onFinish: () => {
            deleting.value = false;
            confirmingDeleteId.value = null;
        },
    });
}
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.categories.pageTitle')" />

        <template #header>
            <div :class="wrapBetweenClass">
                <h1 :class="pageTitleClass">
                    {{ t('admin.categories.heading') }}
                </h1>
                <ButtonLink
                    variant="primary"
                    :href="route('admin.categories.create')"
                >
                    {{ t('admin.categories.create') }}
                </ButtonLink>
            </div>
        </template>

        <ErrorBanner v-if="deleteBlockedMessage">
            {{ deleteBlockedMessage }}
        </ErrorBanner>

        <form
            @submit.prevent="applyFilters"
            :class="filterFormClass"
        >
            <FormField
                v-model="search"
                type="text"
                :label="t('admin.categories.searchPlaceholder')"
            />
            <PrimaryButton type="submit">{{
                t('common.confirm')
            }}</PrimaryButton>
        </form>

        <DataTable
            :columns="columns"
            :rows="categories.data"
            :from="categories.from"
            :to="categories.to"
            :total="categories.total"
            :links="categories.links"
            :empty-message="t('admin.categories.empty')"
        >
            <template #cell-parent="{ row }">
                <Link
                    v-if="row.parent"
                    :href="route('admin.categories.edit', row.parent.id)"
                    :class="linkClass"
                >
                    {{ row.parent.name }}
                </Link>
                <span v-else>{{ t('admin.categories.none') }}</span>
            </template>

            <template #cell-products_count="{ row }">
                <Link
                    v-if="row.products_count"
                    :href="
                        route('admin.products.index', { category_id: row.id })
                    "
                    :class="linkClass"
                >
                    {{ row.products_count }}
                </Link>
                <span v-else>0</span>
            </template>

            <template #cell-children_count="{ row }">
                <Link
                    v-if="row.children_count"
                    :href="
                        route('admin.categories.index', { parent_id: row.id })
                    "
                    :class="linkClass"
                >
                    {{ row.children_count }}
                </Link>
                <span v-else>0</span>
            </template>

            <template #actions="{ row }">
                <div class="flex justify-end gap-2">
                    <ButtonLink :href="route('admin.categories.edit', row.id)">
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
            :title="t('admin.categories.deleteConfirmTitle')"
            :message="t('admin.categories.deleteConfirmMessage')"
            :confirm-label="t('common.delete')"
            danger
            :processing="deleting"
            @confirm="destroy"
            @cancel="confirmingDeleteId = null"
        />
    </AdminLayout>
</template>
