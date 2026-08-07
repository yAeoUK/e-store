<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import type { AutoSlugProp } from '@/components/admin/admin.ts';
import SlugField from '@/components/admin/SlugField.vue';
import { formGridClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';

defineProps<
    {
        form: InertiaForm<{ name: string; slug: string }>;
        nameLabel: string;
        slugLabel: string;
        errors: Partial<Record<'name' | 'slug', string>>;
    } & AutoSlugProp
>();
</script>

<template>
    <div :class="formGridClass">
        <FormField
            v-model="form.name"
            type="text"
            :label="nameLabel"
            :error="errors.name"
            required
        />
        <SlugField
            v-model="form.slug"
            :label="slugLabel"
            :source="autoSlug ? form.name : undefined"
            :error="errors.slug"
        />
    </div>
</template>
