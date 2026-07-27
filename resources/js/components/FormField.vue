<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue';
import { formFieldClass } from './classNames';
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
    inputClass?: string;
}>();

const model = defineModel<string | number>({ default: '' });

const generatedId = useId();
const id = computed(() => props.id ?? generatedId);

const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (input.value && input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

function update(e: Event) {
    const target = e.target as HTMLInputElement;

    if (target.type === 'number' && target.value !== '') {
        model.value = target.valueAsNumber;
    } else {
        model.value = target.value;
    }
}

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <div>
        <InputLabel :for="id" :value="label" :class="labelClass" />
        <input
            :id="id"
            ref="input"
            v-bind="$attrs"
            :value="model"
            @input="update"
            :class="[
                formFieldClass,
                'mt-1 block placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:placeholder:text-slate-500',
                inputClass,
            ]"
        />
        <div v-show="error">
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ error }}
            </p>
        </div>
    </div>
</template>
