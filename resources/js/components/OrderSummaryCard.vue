<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import { cardPaddingClass } from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import { t } from '@/i18n';
import { formatDate, toSummaryItems } from '@/lib/format';
import type { OrdersNamespace } from '@/lib/orderStatus';
import type { OrderItem } from '@/types/order';

const props = defineProps<{
    namespace: OrdersNamespace;
    status: string;
    paymentStatus: string;
    createdAt: string;
    orderItems: OrderItem[];
    total: number | string;
}>();

const summaryItems = computed(() =>
    toSummaryItems(
        props.orderItems,
        (item) => item.product_snapshot?.name ?? '',
        (item) => item.product_snapshot?.variant?.options,
    ),
);
</script>

<template>
    <Card :class="cardPaddingClass">
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <OrderStatusBadge :status="status" :namespace="namespace" />
                <PaymentStatusBadge
                    :status="paymentStatus"
                    :namespace="namespace"
                />
            </div>
            <MutedText>
                {{ t(`${namespace}.detail.placedOn`) }}
                {{ formatDate(createdAt) }}
            </MutedText>
        </div>

        <slot />

        <OrderItemsSummary
            :heading="t(`${namespace}.detail.items`)"
            :items="summaryItems"
            :total-label="t(`${namespace}.detail.total`)"
            :total="total"
        />
    </Card>
</template>
