<script setup lang="ts" generic="T extends string | number">
import { listItemCardClass } from './classNames';

defineProps<{
    modelValue: T;
    value: T;
    align?: 'start' | 'center';
}>();

defineEmits<{ 'update:modelValue': [value: T] }>();
</script>

<template>
    <li :class="listItemCardClass">
        <label
            :class="[
                'flex gap-3',
                align === 'start' ? 'items-start' : 'items-center',
            ]"
        >
            <input
                type="radio"
                :value="value"
                :checked="modelValue === value"
                :class="align === 'start' ? 'mt-1' : undefined"
                @change="$emit('update:modelValue', value)"
            />
            <span><slot /></span>
        </label>
    </li>
</template>
