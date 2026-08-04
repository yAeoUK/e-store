<script setup lang="ts">
import {
    borderColorClass,
    controlShapeClass,
    interactiveRowClass,
    surfaceBgClass,
} from './classNames';

export interface PaginationLink {
    url?: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<Row> {
    data: Row[];
    links?: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

defineProps<{
    links?: PaginationLink[];
}>();
</script>

<template>
    <nav v-if="links?.length" class="flex flex-wrap items-center gap-2">
        <a
            v-for="link in links"
            :key="link.label"
            :href="link.url ?? ''"
            :class="[
                borderColorClass,
                controlShapeClass,
                link.active
                    ? 'bg-indigo-600 text-white'
                    : [surfaceBgClass, interactiveRowClass],
            ]"
        >
            <span v-html="link.label"></span>
        </a>
    </nav>
</template>
