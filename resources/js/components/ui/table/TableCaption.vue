<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { mutedTextClass } from "@/components/classNames"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <caption
    data-slot="table-caption"
    :class="cn(mutedTextClass, 'mt-4 text-sm', props.class)"
  >
    <slot />
  </caption>
</template>
