<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
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

function stripArrows(label: string): string {
    return label.replace(/&laquo;|&raquo;/g, '').trim();
}

function isPrevious(label: string): boolean {
    return /previous/i.test(label);
}

function isNext(label: string): boolean {
    return /next/i.test(label);
}
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
            <span v-if="isPrevious(link.label)" class="flex items-center gap-1">
                <ChevronLeft class="h-4 w-4" />{{ stripArrows(link.label) }}
            </span>
            <span
                v-else-if="isNext(link.label)"
                class="flex items-center gap-1"
            >
                {{ stripArrows(link.label) }}<ChevronRight class="h-4 w-4" />
            </span>
            <span v-else v-html="link.label"></span>
        </a>
    </nav>
</template>
