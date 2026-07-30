<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { mutedBorderClass } from "@/components/classNames"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tfoot
    data-slot="table-footer"
    :class="cn('bg-slate-100/50 dark:bg-slate-800/50 border-t', mutedBorderClass, 'font-medium [&>tr]:last:border-b-0', props.class)"
  >
    <slot />
  </tfoot>
</template>
