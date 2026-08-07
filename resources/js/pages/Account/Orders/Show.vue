<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ArrowLeft } from '@lucide/vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { pageHeaderTextClass } from '@/components/classNames';
import IconLabel from '@/components/IconLabel.vue';
import OrderNoteCard from '@/components/OrderNoteCard.vue';
import OrderShippingAddressCard from '@/components/OrderShippingAddressCard.vue';
import OrderSummaryCard from '@/components/OrderSummaryCard.vue';
import PageContainer from '@/components/PageContainer.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import type { OrderDetail } from '@/types/order';

defineProps<{ order: OrderDetail }>();
</script>

<template>
    <ShopLayout>
        <Head :title="t('account.orders.detail.pageTitle')" />

        <template #header>
            <h2 :class="pageHeaderTextClass">
                {{ t('account.orders.detail.pageTitle') }} #{{ order.id }}
            </h2>
        </template>

        <PageContainer>
            <div class="mb-4">
                <ButtonLink :href="route('account.orders')">
                    <IconLabel :icon="ArrowLeft">{{
                        t('account.orders.detail.backToOrders')
                    }}</IconLabel>
                </ButtonLink>
            </div>

            <div class="space-y-6">
                <OrderSummaryCard
                    namespace="account.orders"
                    :status="order.status"
                    :payment-status="order.payment_status"
                    :created-at="order.created_at"
                    :order-items="order.order_items"
                    :total="order.total"
                />

                <OrderShippingAddressCard
                    v-if="order.shipping_address_snapshot"
                    namespace="account.orders"
                    :address="order.shipping_address_snapshot"
                />

                <OrderNoteCard
                    v-if="order.customer_note"
                    :heading="t('account.orders.detail.note')"
                    :note="order.customer_note"
                />
            </div>
        </PageContainer>
    </ShopLayout>
</template>
