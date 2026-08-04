<script setup lang="ts">
import { headingTextClass } from './classNames';
import MutedText from './MutedText.vue';

const dialogTitleClass = `text-lg font-medium ${headingTextClass}`;

defineProps({
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <header>
        <h2 :class="dialogTitleClass">
            {{ heading }}
        </h2>

        <MutedText v-if="description" class="mt-1">
            {{ description }}
        </MutedText>
    </header>
</template>
