<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { Component } from 'vue';
import Card from '@/components/Card.vue';
import { eyebrowTextClass, headingTextClass } from '@/components/classNames';

defineProps<{
    label: string;
    value: string | number;
    icon?: Component;
    href?: string;
}>();
</script>

<template>
    <Card
        :class="
            href
                ? 'transition hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-500/30'
                : ''
        "
    >
        <component
            :is="href ? Link : 'div'"
            :href="href"
            class="flex items-center gap-4 p-4"
        >
            <div
                v-if="icon"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
                <component :is="icon" class="h-5 w-5" />
            </div>
            <div>
                <p :class="eyebrowTextClass">
                    {{ label }}
                </p>
                <p :class="['text-xl font-semibold', headingTextClass]">
                    {{ value }}
                </p>
            </div>
        </component>
    </Card>
</template>
