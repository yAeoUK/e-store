<script setup lang="ts">
import { headingTextClass, mutedBorderClass } from '@/components/classNames';
import { formatCurrency } from '@/lib/format';

const totalRowClass = `flex items-center justify-between border-t ${mutedBorderClass} pt-4`;

defineProps<{
    label: string;
    total: number | string;
}>();
</script>

<template>
    <div :class="totalRowClass">
        <span :class="['font-semibold', headingTextClass]">
            {{ label }}
        </span>
        <span :class="['text-lg font-semibold', headingTextClass]">
            {{ formatCurrency(total) }}
        </span>
    </div>
</template>
