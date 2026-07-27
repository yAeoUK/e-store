<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

const emit = defineEmits(['update:checked']);

const props = defineProps({
    checked: {
        type: [Array, Boolean] as PropType<boolean | unknown[]>,
        required: true,
    },
    value: {
        type: [String, Number, Boolean] as PropType<
            string | number | boolean | null
        >,
        default: null,
    },
});

const proxyChecked = computed({
    get() {
        return props.checked;
    },

    set(val) {
        emit('update:checked', val);
    },
});
</script>

<template>
    <input
        type="checkbox"
        :value="value"
        v-model="proxyChecked"
        class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-slate-600 dark:text-indigo-500"
    />
</template>
