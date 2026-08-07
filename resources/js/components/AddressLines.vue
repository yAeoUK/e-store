<script setup lang="ts">
import MutedText from '@/components/MutedText.vue';
import type { AddressSnapshot } from '@/types/address';

withDefaults(
    defineProps<{
        address: AddressSnapshot;
        showLabel?: boolean;
        showCountry?: boolean;
        boldLabel?: boolean;
    }>(),
    {
        showLabel: true,
        showCountry: false,
        boldLabel: false,
    },
);
</script>

<template>
    <span v-if="boldLabel" class="font-medium">
        {{ address.label || address.name }}
    </span>
    <MutedText v-else-if="showLabel">
        {{ address.label || address.name }}
    </MutedText>
    <MutedText>{{ address.line1 }} {{ address.line2 }}</MutedText>
    <MutedText>
        {{ address.city }} {{ address.postal_code }} {{ address.state }}
    </MutedText>
    <MutedText v-if="showCountry">{{ address.country }}</MutedText>
</template>
