<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge.vue';
import type { Variant } from '@/components/ui/badge';
import type { OrdersNamespace } from '@/lib/orderStatus';

const orderStatusVariants = {
    pending: 'outline',
    processing: 'secondary',
    completed: 'default',
    cancelled: 'destructive',
} satisfies Record<string, Variant>;

defineProps<{
    status: string;
    namespace: OrdersNamespace;
}>();
</script>

<template>
    <StatusBadge
        :status="status"
        :variants="orderStatusVariants"
        :translation-key="`${namespace}.statuses`"
    />
</template>
