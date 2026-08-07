<script setup lang="ts">
import { X } from '@lucide/vue';
import ButtonLink from '@/components/ButtonLink.vue';
import IconLabel from '@/components/IconLabel.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';

defineProps<{
    href?: string;
}>();
</script>

<template>
    <ButtonLink v-if="href" :href="href">
        <IconLabel :icon="X"
            ><slot>{{ t('common.cancel') }}</slot></IconLabel
        >
    </ButtonLink>
    <SecondaryButton v-else type="button">
        <IconLabel :icon="X"
            ><slot>{{ t('common.cancel') }}</slot></IconLabel
        >
    </SecondaryButton>
</template>
