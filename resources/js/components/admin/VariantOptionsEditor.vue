<script setup lang="ts">
import { ref } from 'vue';
import FormField from '@/components/FormField.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';

// Not reactive to changes in the model after mount by design - the parent
// resets this component fresh (via a :key swap) whenever the editing target
// changes, rather than this component watching the model back into `rows`,
// which would fight its own writes on every keystroke.
const model = defineModel<Record<string, string>>({ default: () => ({}) });

interface Row {
    key: string;
    value: string;
}

function toRows(source: Record<string, string> | null | undefined): Row[] {
    return Object.entries(source ?? {}).map(([key, value]) => ({ key, value }));
}

const rows = ref<Row[]>(toRows(model.value));

function sync(): void {
    const result: Record<string, string> = {};

    for (const row of rows.value) {
        if (row.key.trim() !== '') {
            result[row.key.trim()] = row.value;
        }
    }

    model.value = result;
}

function addRow(): void {
    rows.value.push({ key: '', value: '' });
}

function removeRow(index: number): void {
    rows.value.splice(index, 1);
    sync();
}
</script>

<template>
    <div class="space-y-2">
        <div
            v-for="(row, index) in rows"
            :key="index"
            class="flex items-end gap-2"
        >
            <FormField
                v-model="row.key"
                type="text"
                :label="t('admin.products.optionKey')"
                @update:model-value="sync"
            />
            <FormField
                v-model="row.value"
                type="text"
                :label="t('admin.products.optionValue')"
                @update:model-value="sync"
            />
            <SecondaryButton type="button" @click="removeRow(index)">
                {{ t('admin.products.removeOption') }}
            </SecondaryButton>
        </div>

        <SecondaryButton type="button" @click="addRow">
            {{ t('admin.products.addOption') }}
        </SecondaryButton>
    </div>
</template>
