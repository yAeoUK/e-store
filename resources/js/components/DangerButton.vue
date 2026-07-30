<script setup lang="ts">
import { legacyButtonBaseClass } from './classNames';
</script>

<template>
    <button
        :class="[
            legacyButtonBaseClass,
            'border-transparent bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700',
        ]"
    >
        <slot />
    </button>
</template>
