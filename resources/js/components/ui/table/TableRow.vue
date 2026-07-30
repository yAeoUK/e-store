<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { interactiveRowClass, mutedBorderClass } from "@/components/classNames"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn(interactiveRowClass, 'data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800 border-b', mutedBorderClass, 'transition-colors', props.class)"
  >
    <slot />
  </tr>
</template>
