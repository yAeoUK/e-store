<script setup lang="ts">
import { Funnel } from '@lucide/vue';
import IconLabel from '@/components/IconLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
</script>

<template>
    <PrimaryButton type="submit">
        <IconLabel :icon="Funnel"><slot /></IconLabel>
    </PrimaryButton>
</template>
