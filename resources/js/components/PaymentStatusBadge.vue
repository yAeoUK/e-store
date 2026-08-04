<script setup lang="ts">
import { Badge, type BadgeVariants } from '@/components/ui/badge';
import { t } from '@/i18n';

type Variant = NonNullable<BadgeVariants['variant']>;

const paymentStatusVariants: Record<string, Variant> = {
    unpaid: 'outline',
    paid: 'default',
    failed: 'destructive',
    refunded: 'secondary',
};

function paymentStatusVariant(status: string): Variant {
    return paymentStatusVariants[status] ?? 'outline';
}

defineProps<{
    status: string;
    namespace: 'account.orders' | 'admin.orders';
}>();
</script>

<template>
    <Badge :variant="paymentStatusVariant(status)">
        {{ t(`${namespace}.paymentStatuses.${status}`) }}
    </Badge>
</template>
