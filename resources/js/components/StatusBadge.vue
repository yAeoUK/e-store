<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import type { Variant } from '@/components/ui/badge';
import { t } from '@/i18n';

const props = defineProps<{
    status: string;
    variants: Record<string, Variant>;
    translationKey: string;
}>();

function variant(): Variant {
    return props.variants[props.status] ?? 'outline';
}
</script>

<template>
    <Badge :variant="variant()">
        {{ t(`${translationKey}.${status}`) }}
    </Badge>
</template>
