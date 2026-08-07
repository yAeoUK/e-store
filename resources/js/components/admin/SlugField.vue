<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    borderColorClass,
    controlShapeClass,
    formFieldBlockClass,
    linkClass,
    mutedBodyTextClass,
} from '@/components/classNames';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import { t } from '@/i18n';

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const model = defineModel<string>({ required: true });

const props = defineProps<{
    label: string;
    // The name/title to auto-generate the slug from. Omit on edit forms so
    // an existing slug never changes just because the name was edited.
    source?: string;
    error?: string;
}>();

const editing = ref(false);

watch(
    () => props.source,
    (value) => {
        if (!editing.value && value !== undefined) {
            model.value = slugify(value);
        }
    },
);
</script>

<template>
    <div>
        <InputLabel>{{ label }}</InputLabel>

        <div
            v-if="!editing"
            :class="[
                borderColorClass,
                controlShapeClass,
                mutedBodyTextClass,
                'mt-1 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900',
            ]"
        >
            <span class="truncate">{{ model }}</span>
            <button
                type="button"
                :class="['shrink-0 text-xs font-medium', linkClass]"
                @click="editing = true"
            >
                {{ t('admin.actions.edit') }}
            </button>
        </div>

        <input
            v-else
            v-model="model"
            type="text"
            :class="formFieldBlockClass"
        />

        <InputError :message="error" />
    </div>
</template>
