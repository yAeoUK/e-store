<script setup lang="ts">
import { t } from '@/i18n';
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
            <slot>{{ t('common.save') }}</slot>
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
