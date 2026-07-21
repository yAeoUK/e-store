<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
import FormCard from '@/Components/FormCard.vue';
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0 dark:bg-slate-950"
    >
        <div>
            <Link href="/">
                <ApplicationLogo class="h-16 w-16 fill-current text-slate-900 dark:text-slate-100" />
            </Link>
        </div>

        <FormCard>
            <slot />
        </FormCard>
    </div>
</template>
