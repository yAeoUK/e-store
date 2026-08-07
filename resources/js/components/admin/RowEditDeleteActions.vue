<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue';
import ButtonLink from '@/components/ButtonLink.vue';
import DangerButton from '@/components/DangerButton.vue';
import IconLabel from '@/components/IconLabel.vue';
import { t } from '@/i18n';

defineProps<{
    editHref: string;
}>();

const emit = defineEmits<{
    delete: [];
}>();
</script>

<template>
    <div class="flex justify-end gap-2">
        <ButtonLink :href="editHref">
            <IconLabel :icon="Pencil">{{ t('admin.actions.edit') }}</IconLabel>
        </ButtonLink>
        <DangerButton @click="emit('delete')">
            <IconLabel :icon="Trash2">{{
                t('admin.actions.delete')
            }}</IconLabel>
        </DangerButton>
    </div>
</template>
