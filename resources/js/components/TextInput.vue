<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);
const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (input.value && input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

function update(e: Event) {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <input
        v-bind="$attrs"
        :value="modelValue"
        @input="update"
        ref="input"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
    />
</template>
