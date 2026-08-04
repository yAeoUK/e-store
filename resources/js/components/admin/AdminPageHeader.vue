<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { pageTitleClass, wrapBetweenClass } from '@/components/classNames';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps<{
    title: string;
    heading?: string;
}>();
</script>

<template>
    <AdminLayout>
        <Head :title="title" />

        <template #header>
            <div v-if="$slots.actions" :class="wrapBetweenClass">
                <h1 :class="pageTitleClass">{{ heading ?? title }}</h1>
                <slot name="actions" />
            </div>
            <h1 v-else :class="pageTitleClass">{{ heading ?? title }}</h1>
        </template>

        <slot />
    </AdminLayout>
</template>
