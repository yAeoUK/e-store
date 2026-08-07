<script setup lang="ts">
import { Save } from '@lucide/vue';
import { t } from '@/i18n';
import IconLabel from './IconLabel.vue';
import MutedText from './MutedText.vue';
import PrimaryButton from './PrimaryButton.vue';

defineProps({
    processing: {
        type: Boolean,
        default: false,
    },
    saved: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="flex items-center gap-4">
        <PrimaryButton :disabled="processing">
            <IconLabel :icon="Save"
                ><slot>{{ t('common.save') }}</slot></IconLabel
            >
        </PrimaryButton>

        <Transition
            enter-active-class="transition ease-in-out"
            enter-from-class="opacity-0"
            leave-active-class="transition ease-in-out"
            leave-to-class="opacity-0"
        >
            <MutedText v-if="saved">
                {{ t('common.saved') }}
            </MutedText>
        </Transition>
    </div>
</template>
