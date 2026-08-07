<script setup lang="ts">
import Card from '@/components/Card.vue';
import { cardPaddingClass } from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';

defineProps<{
    empty: boolean;
    emptyMessage: string;
}>();
</script>

<template>
    <Card :class="cardPaddingClass">
        <MutedText v-if="empty" class="mb-4">{{ emptyMessage }}</MutedText>
        <slot />
    </Card>
</template>
