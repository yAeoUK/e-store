<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { PackageX } from '@lucide/vue';
import Card from '@/components/Card.vue';
import {
    cardPaddingClass,
    narrowPageWidthClass,
    pageHeaderTextClass,
    stackedRowCardClass,
} from '@/components/classNames';
import EmptyState from '@/components/EmptyState.vue';
import MutedText from '@/components/MutedText.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import Pagination from '@/components/Pagination.vue';
import type { Paginated } from '@/components/Pagination.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { formatCurrency, formatDate } from '@/lib/format';

interface OrderRow {
    id: number;
    status: string;
    total: number | string;
    created_at: string;
}

defineProps<{
    orders: Paginated<OrderRow>;
}>();
</script>

<template>
    <ShopLayout>
        <Head :title="t('account.orders.pageTitle')" />

        <template #header>
            <h2 :class="pageHeaderTextClass">
                {{ t('account.orders.pageTitle') }}
            </h2>
        </template>

        <div class="py-12">
            <div :class="narrowPageWidthClass">
                <Card :class="cardPaddingClass">
                    <EmptyState
                        v-if="orders.data.length === 0"
                        :icon="PackageX"
                        class="text-center"
                    >
                        <MutedText>
                            {{ t('account.orders.empty') }}
                        </MutedText>
                    </EmptyState>

                    <template v-else>
                        <ul class="mb-6 space-y-3">
                            <li v-for="order in orders.data" :key="order.id">
                                <Link
                                    :href="
                                        route('account.orders.show', order.id)
                                    "
                                    :class="[
                                        stackedRowCardClass,
                                        'hover:bg-slate-50 dark:hover:bg-slate-800',
                                    ]"
                                >
                                    <div>
                                        <span class="font-medium">
                                            {{ t('account.orders.columns.id') }}
                                            #{{ order.id }}
                                        </span>
                                        <MutedText>
                                            {{ formatDate(order.created_at) }}
                                        </MutedText>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <span>{{
                                            formatCurrency(order.total)
                                        }}</span>
                                        <OrderStatusBadge
                                            :status="order.status"
                                            namespace="account.orders"
                                        />
                                    </div>
                                </Link>
                            </li>
                        </ul>

                        <Pagination :links="orders.links" />
                    </template>
                </Card>
            </div>
        </div>
    </ShopLayout>
</template>
