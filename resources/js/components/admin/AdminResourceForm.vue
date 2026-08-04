<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import FormActions from '@/components/FormActions.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { t } from '@/i18n';

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
                    <ButtonLink :href="cancelHref">
                        {{ t('common.cancel') }}
                    </ButtonLink>
                    <PrimaryButton :disabled="processing">
                        {{ saveLabel }}
                    </PrimaryButton>
                </FormActions>
            </form>
        </Card>

        <slot name="after" />
    </AdminPageHeader>
</template>
