<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import CancelButton from '@/components/CancelButton.vue';
import Card from '@/components/Card.vue';
import FormActions from '@/components/FormActions.vue';
import SaveButton from '@/components/SaveButton.vue';

defineProps<{
    title: string;
    cancelHref: string;
    saveLabel: string;
    processing: boolean;
}>();

defineEmits<{
    submit: [];
}>();
</script>

<template>
    <AdminPageHeader :title="title">
        <Card class="p-6">
            <form @submit.prevent="$emit('submit')" class="space-y-4">
                <slot />

                <FormActions>
                    <CancelButton :href="cancelHref" />
                    <SaveButton :processing="processing">{{
                        saveLabel
                    }}</SaveButton>
                </FormActions>
            </form>
        </Card>

        <slot name="after" />
    </AdminPageHeader>
</template>
