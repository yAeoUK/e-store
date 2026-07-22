<script setup>
import { cardSurfaceClass } from './classNames';
</script>

<template>
  <div :class="[cardSurfaceClass, 'bg-white shadow-sm dark:shadow-none']">
    <slot />
  </div>
</template>
