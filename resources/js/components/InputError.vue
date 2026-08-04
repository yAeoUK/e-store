<script setup lang="ts">
import { errorTextClass } from './classNames';

defineProps<{
    message?: string;
}>();
</script>

<template>
    <div v-show="message">
        <p class="mt-2 text-sm" :class="errorTextClass">
            {{ message }}
        </p>
    </div>
</template>
