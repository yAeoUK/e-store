<script setup lang="ts">
import { computed, useId } from 'vue';
import { formFieldClass } from './classNames';
import InputError from './InputError.vue';
import InputLabel from './InputLabel.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
    // Falls back to an auto-generated id when omitted - needed for forms
    // that can be rendered more than once at a time (e.g. an add form and
    // an edit modal on the same page), where a hardcoded id would collide.
    id?: string;
    label: string;
    error?: string;
    labelClass?: string;
    selectClass?: string;
    required?: boolean;
}>();

const model = defineModel<string | number>({ default: '' });

const generatedId = useId();
const id = computed(() => props.id ?? generatedId);
</script>

<template>
    <div>
        <InputLabel
            :for="id"
            :value="label"
            :class="labelClass"
            :required="required"
        />
        <select
            :id="id"
            v-model="model"
            v-bind="$attrs"
            :required="required"
            :class="[formFieldClass, selectClass]"
        >
            <slot />
        </select>
        <InputError :message="error" />
    </div>
</template>
