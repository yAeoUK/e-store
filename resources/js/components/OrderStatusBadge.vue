<script setup lang="ts">
import { Badge, type BadgeVariants } from '@/components/ui/badge';
import { t } from '@/i18n';

type Variant = NonNullable<BadgeVariants['variant']>;

const orderStatusVariants: Record<string, Variant> = {
    pending: 'outline',
    processing: 'secondary',
    completed: 'default',
    cancelled: 'destructive',
};

function orderStatusVariant(status: string): Variant {
    return orderStatusVariants[status] ?? 'outline';
}

defineProps<{
    status: string;
    namespace: 'account.orders' | 'admin.orders';
}>();
</script>

<template>
    <Badge :variant="orderStatusVariant(status)">
        {{ t(`${namespace}.statuses.${status}`) }}
    </Badge>
</template>
