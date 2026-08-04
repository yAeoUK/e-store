<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import CheckboxField from '@/components/CheckboxField.vue';
import FormField from '@/components/FormField.vue';
import { t } from '@/i18n';

interface AddressFormValues {
    label: string;
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    is_default: boolean;
}

defineProps<{
    form: InertiaForm<AddressFormValues>;
    errors: Partial<
        Record<
            | 'label'
            | 'name'
            | 'line1'
            | 'line2'
            | 'city'
            | 'state'
            | 'postal_code'
            | 'country'
            | 'phone',
            string
        >
    >;
}>();
</script>

<template>
    <FormField
        v-model="form.label"
        :label="t('account.addresses.label')"
        :placeholder="t('account.addresses.labelPlaceholder')"
        :error="errors.label"
    />
    <FormField
        v-model="form.name"
        :label="t('account.addresses.name')"
        :placeholder="t('account.addresses.namePlaceholder')"
        :error="errors.name"
    />
    <FormField
        v-model="form.line1"
        :label="t('account.addresses.line1')"
        :placeholder="t('account.addresses.line1Placeholder')"
        :error="errors.line1"
        required
    />
    <FormField
        v-model="form.line2"
        :label="t('account.addresses.line2')"
        :placeholder="t('account.addresses.line2Placeholder')"
        :error="errors.line2"
    />
    <div class="grid gap-2 sm:grid-cols-3">
        <FormField
            v-model="form.city"
            :label="t('account.addresses.city')"
            :placeholder="t('account.addresses.cityPlaceholder')"
            :error="errors.city"
            required
        />
        <FormField
            v-model="form.state"
            :label="t('account.addresses.state')"
            :placeholder="t('account.addresses.statePlaceholder')"
            :error="errors.state"
        />
        <FormField
            v-model="form.postal_code"
            :label="t('account.addresses.postalCode')"
            :placeholder="t('account.addresses.postalCodePlaceholder')"
            :error="errors.postal_code"
            required
        />
    </div>
    <FormField
        v-model="form.country"
        :label="t('account.addresses.country')"
        :placeholder="t('account.addresses.countryPlaceholder')"
        :error="errors.country"
        required
    />
    <FormField
        v-model="form.phone"
        :label="t('account.addresses.phone')"
        :placeholder="t('account.addresses.phonePlaceholder')"
        :error="errors.phone"
    />
    <CheckboxField
        v-model:checked="form.is_default"
        :label="t('account.addresses.setDefault')"
    />
</template>
