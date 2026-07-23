<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { formFieldClass } from './classNames';

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

    if (target.type === 'number' && target.value !== '') {
        emit('update:modelValue', target.valueAsNumber);
    } else {
        emit('update:modelValue', target.value);
    }
}

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <input
        v-bind="$attrs"
        :value="modelValue"
        @input="update"
        ref="input"
        :class="[formFieldClass, 'block placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:placeholder:text-slate-500']"
    />
</template>
