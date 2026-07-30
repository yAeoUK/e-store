<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { Component } from 'vue';
import {
    cardSurfaceClass,
    interactiveRowClass,
    mutedBodyTextClass,
    mutedBorderClass,
    mutedTextClass,
} from './classNames';

const activeRowClass =
    'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400';

const navLinkShapeClass = 'rounded-lg px-3 py-2 text-sm';

export interface SidebarNavItem {
    key: string | number;
    label: string;
    href: string;
    icon?: Component;
    badge?: string | number;
    active?: boolean;
    children?: SidebarNavItem[];
}

defineProps<{
    items: SidebarNavItem[];
    title?: string;
}>();
</script>

<template>
    <nav :class="[cardSurfaceClass, 'bg-white p-4 shadow-sm dark:shadow-none']">
        <h3
            v-if="title"
            :class="[
                mutedTextClass,
                'mb-3 text-sm font-semibold tracking-wide uppercase',
            ]"
        >
            {{ title }}
        </h3>

        <ul class="space-y-2">
            <li v-for="item in items" :key="item.key">
                <Link
                    :href="item.href"
                    :class="[
                        navLinkShapeClass,
                        'flex items-center justify-between font-medium',
                        item.active ? activeRowClass : interactiveRowClass,
                    ]"
                >
                    <span class="flex items-center gap-2">
                        <component
                            :is="item.icon"
                            v-if="item.icon"
                            class="h-4 w-4"
                        />
                        <span>{{ item.label }}</span>
                    </span>
                    <span
                        v-if="item.badge !== undefined"
                        class="text-xs text-slate-400 dark:text-slate-500"
                        >{{ item.badge }}</span
                    >
                </Link>

                <ul
                    v-if="item.children?.length"
                    :class="[
                        mutedBorderClass,
                        'ms-4 mt-2 space-y-1 border-s ps-3',
                    ]"
                >
                    <li v-for="child in item.children" :key="child.key">
                        <Link
                            :href="child.href"
                            :class="[
                                navLinkShapeClass,
                                'block',
                                child.active
                                    ? activeRowClass
                                    : [
                                          mutedBodyTextClass,
                                          'hover:bg-slate-100 dark:hover:bg-slate-800',
                                      ],
                            ]"
                        >
                            {{ child.label }}
                        </Link>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
