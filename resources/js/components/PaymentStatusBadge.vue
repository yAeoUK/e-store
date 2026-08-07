<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge.vue';
import type { Variant } from '@/components/ui/badge';
import type { OrdersNamespace } from '@/lib/orderStatus';

const paymentStatusVariants: Record<string, Variant> = {
    unpaid: 'outline',
    paid: 'default',
    failed: 'destructive',
    refunded: 'secondary',
};

defineProps<{
    status: string;
    namespace: OrdersNamespace;
}>();
</script>

<template>
    <StatusBadge
        :status="status"
        :variants="paymentStatusVariants"
        :translation-key="`${namespace}.paymentStatuses`"
    />
</template>
