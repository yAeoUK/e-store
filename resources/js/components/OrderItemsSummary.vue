<script setup lang="ts">
import {
    headingTextClass,
    sectionHeadingClass,
    totalRowClass,
} from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';
import { formatCurrency, formatVariantOptions } from '@/lib/format';

interface SummaryItem {
    id: number;
    name: string;
    variantOptions?: Record<string, string | number> | null;
    quantity: number;
    unitPrice: number | string;
}

defineProps<{
    heading: string;
    items: SummaryItem[];
    totalLabel: string;
    total: number | string;
}>();
</script>

<template>
    <h3 :class="['mb-4', sectionHeadingClass]">{{ heading }}</h3>
    <ul class="mb-4 space-y-2">
        <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center justify-between text-sm"
        >
            <span>
                {{ item.name }}
                <MutedText v-if="item.variantOptions" class="inline">
                    ({{ formatVariantOptions(item.variantOptions) }})
                </MutedText>
                &times; {{ item.quantity }}
            </span>
            <span>
                {{ formatCurrency(Number(item.unitPrice) * item.quantity) }}
            </span>
        </li>
    </ul>
    <div :class="totalRowClass">
        <span :class="['font-semibold', headingTextClass]">
            {{ totalLabel }}
        </span>
        <span :class="['text-lg font-semibold', headingTextClass]">
            {{ formatCurrency(total) }}
        </span>
    </div>
</template>
