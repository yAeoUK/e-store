<script setup lang="ts">
import Checkbox from '@/components/Checkbox.vue';
import FormField from '@/components/FormField.vue';
import MutedText from '@/components/MutedText.vue';
import { t } from '@/i18n';

defineProps<{
    errors: Partial<
        Record<
            | 'label'
            | 'name'
            | 'line1'
            | 'line2'
            | 'city'
            | 'state'
            | 'postal_code'
            | 'country',
            string
        >
    >;
}>();

const label = defineModel<string>('label', { default: '' });
const name = defineModel<string>('name', { default: '' });
const line1 = defineModel<string>('line1', { default: '' });
const line2 = defineModel<string>('line2', { default: '' });
const city = defineModel<string>('city', { default: '' });
const state = defineModel<string>('state', { default: '' });
const postalCode = defineModel<string>('postal_code', { default: '' });
const country = defineModel<string>('country', { default: '' });
const isDefault = defineModel<boolean>('is_default', { default: false });
</script>

<template>
    <FormField
        v-model="label"
        :label="t('account.addresses.label')"
        :placeholder="t('account.addresses.labelPlaceholder')"
        :error="errors.label"
    />
    <FormField
        v-model="name"
        :label="t('account.addresses.name')"
        :placeholder="t('account.addresses.namePlaceholder')"
        :error="errors.name"
    />
    <FormField
        v-model="line1"
        :label="t('account.addresses.line1')"
        :placeholder="t('account.addresses.line1Placeholder')"
        :error="errors.line1"
        required
    />
    <FormField
        v-model="line2"
        :label="t('account.addresses.line2')"
        :placeholder="t('account.addresses.line2Placeholder')"
        :error="errors.line2"
    />
    <div class="grid gap-2 sm:grid-cols-3">
        <FormField
            v-model="city"
            :label="t('account.addresses.city')"
            :placeholder="t('account.addresses.cityPlaceholder')"
            :error="errors.city"
            required
        />
        <FormField
            v-model="state"
            :label="t('account.addresses.state')"
            :placeholder="t('account.addresses.statePlaceholder')"
            :error="errors.state"
        />
        <FormField
            v-model="postalCode"
            :label="t('account.addresses.postalCode')"
            :placeholder="t('account.addresses.postalCodePlaceholder')"
            :error="errors.postal_code"
            required
        />
    </div>
    <FormField
        v-model="country"
        :label="t('account.addresses.country')"
        :placeholder="t('account.addresses.countryPlaceholder')"
        :error="errors.country"
        required
    />
    <label class="flex items-center">
        <Checkbox v-model:checked="isDefault" />
        <MutedText class="ms-2">{{
            t('account.addresses.setDefault')
        }}</MutedText>
    </label>
</template>
