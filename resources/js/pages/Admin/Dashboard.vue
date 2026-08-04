<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    AlertTriangle,
    DollarSign,
    FolderTree,
    Package,
    ShoppingCart,
    Users,
    XCircle,
} from '@lucide/vue';
import type {
    DashboardStats,
    RevenueByDayPoint,
    TopCategoryStat,
} from '@/components/admin/admin.ts';
import CategoryChart from '@/components/admin/CategoryChart.vue';
import ChartCard from '@/components/admin/ChartCard.vue';
import RevenueChart from '@/components/admin/RevenueChart.vue';
import StatCard from '@/components/admin/StatCard.vue';
import { pageTitleClass } from '@/components/classNames';
import { t } from '@/i18n';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { formatCurrency } from '@/lib/format';

defineProps<{
    stats: DashboardStats;
    revenueByDay: RevenueByDayPoint[];
    topCategories: TopCategoryStat[];
}>();
</script>

<template>
    <AdminLayout>
        <Head :title="t('admin.dashboard.pageTitle')" />

        <template #header>
            <h1 :class="pageTitleClass">
                {{ t('admin.dashboard.pageTitle') }}
            </h1>
        </template>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                :icon="Package"
                :label="t('admin.dashboard.totalProducts')"
                :value="stats.total_products"
                :href="route('admin.products.index')"
            />
            <StatCard
                :icon="FolderTree"
                :label="t('admin.dashboard.totalCategories')"
                :value="stats.total_categories"
                :href="route('admin.categories.index')"
            />
            <StatCard
                :icon="Users"
                :label="t('admin.dashboard.totalUsers')"
                :value="stats.total_users"
                :href="route('admin.users.index')"
            />
            <StatCard
                :icon="ShoppingCart"
                :label="t('admin.dashboard.totalOrders')"
                :value="stats.total_orders"
                :href="route('admin.orders.index')"
            />
            <StatCard
                :icon="AlertTriangle"
                :label="t('admin.dashboard.lowStock')"
                :value="stats.low_stock_products"
                :href="route('admin.products.index', { stock_status: 'low' })"
            />
            <StatCard
                :icon="XCircle"
                :label="t('admin.dashboard.outOfStock')"
                :value="stats.out_of_stock_products"
                :href="route('admin.products.index', { stock_status: 'out' })"
            />
            <StatCard
                :icon="DollarSign"
                :label="t('admin.dashboard.totalRevenue')"
                :value="formatCurrency(stats.total_revenue)"
                :href="route('admin.orders.index')"
            />
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
            <ChartCard :title="t('admin.dashboard.revenueChartTitle')">
                <RevenueChart :data="revenueByDay" />
            </ChartCard>
            <ChartCard :title="t('admin.dashboard.categoryChartTitle')">
                <CategoryChart :data="topCategories" />
            </ChartCard>
        </div>
    </AdminLayout>
</template>
