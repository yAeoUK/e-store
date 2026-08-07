<script setup lang="ts">
import MutedText from '@/components/MutedText.vue';
import SectionHeading from '@/components/SectionHeading.vue';
import TotalRow from '@/components/TotalRow.vue';
import { formatCurrency, formatVariantOptions } from '@/lib/format';
import type { SummaryItem } from '@/lib/format';

defineProps<{
    heading: string;
    items: SummaryItem[];
    totalLabel: string;
    total: number | string;
}>();
</script>

<template>
    <SectionHeading :heading="heading" />
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
    <TotalRow :label="totalLabel" :total="total" />
</template>
