<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import AddressLines from '@/components/AddressLines.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import {
    cardPaddingClass,
    pageHeaderTextClass,
    sectionHeadingClass,
} from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import PageContainer from '@/components/PageContainer.vue';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { formatDate, toSummaryItems } from '@/lib/format';
import type { AddressSnapshot } from '@/types/address';

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    product_snapshot: {
        name: string;
        slug: string;
        image_url?: string | null;
        category?: { name: string; slug: string } | null;
        variant?: {
            sku: string;
            options?: Record<string, string | number> | null;
        } | null;
    } | null;
}

interface Order {
    id: number;
    status: string;
    total: number | string;
    payment_method: string | null;
    payment_status: string;
    created_at: string;
    shipping_address_snapshot: AddressSnapshot | null;
    order_items: OrderItem[];
}

const props = defineProps<{ order: Order }>();

const summaryItems = computed(() =>
    toSummaryItems(
        props.order.order_items,
        (item) => item.product_snapshot?.name ?? '',
        (item) => item.product_snapshot?.variant?.options,
    ),
);
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
                    {{ t('account.orders.detail.backToOrders') }}
                </ButtonLink>
            </div>

            <div class="space-y-6">
                <Card :class="cardPaddingClass">
                    <div class="mb-4 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <OrderStatusBadge
                                :status="order.status"
                                namespace="account.orders"
                            />
                            <PaymentStatusBadge
                                :status="order.payment_status"
                                namespace="account.orders"
                            />
                        </div>
                        <MutedText>
                            {{ t('account.orders.detail.placedOn') }}
                            {{ formatDate(order.created_at) }}
                        </MutedText>
                    </div>

                    <OrderItemsSummary
                        :heading="t('account.orders.detail.items')"
                        :items="summaryItems"
                        :total-label="t('account.orders.detail.total')"
                        :total="order.total"
                    />
                </Card>

                <Card
                    v-if="order.shipping_address_snapshot"
                    :class="cardPaddingClass"
                >
                    <h3 :class="['mb-3', sectionHeadingClass]">
                        {{ t('account.orders.detail.shippingAddress') }}
                    </h3>
                    <AddressLines
                        :address="order.shipping_address_snapshot"
                        show-country
                    />
                </Card>
            </div>
        </PageContainer>
    </ShopLayout>
</template>
