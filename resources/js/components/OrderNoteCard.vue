<script setup lang="ts">
import type { Component } from 'vue';
import Card from '@/components/Card.vue';
import { cardPaddingClass } from '@/components/classNames';
import SectionHeading from '@/components/SectionHeading.vue';
import { Badge } from '@/components/ui/badge';

withDefaults(
    defineProps<{
        heading: string;
        note: string;
        icon?: Component;
        iconClass?: string;
        badgeLabel?: string;
        accentClass?: string;
    }>(),
    {
        icon: undefined,
        iconClass: undefined,
        badgeLabel: undefined,
        accentClass: undefined,
    },
);
</script>

<template>
    <Card :class="[cardPaddingClass, accentClass]">
        <SectionHeading
            :heading="heading"
            :icon="icon"
            :icon-class="iconClass"
            spacing-class="mb-3"
        >
            <Badge v-if="badgeLabel" variant="outline">{{ badgeLabel }}</Badge>
        </SectionHeading>
        <p>{{ note }}</p>
    </Card>
</template>
