<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';
import CheckboxField from '@/components/CheckboxField.vue';
import { formGrid3Class, hintTextClass } from '@/components/classNames';
import FormField from '@/components/FormField.vue';
import InputLabel from '@/components/InputLabel.vue';
import { t } from '@/i18n';

interface VariantFormValues {
    sku: string;
    options: Record<string, string>;
    price: number | string;
    stock: number;
    is_active: boolean;
}

defineProps<{
    form: InertiaForm<VariantFormValues>;
    errors: Partial<Record<'sku' | 'price' | 'stock', string>>;
    // Forces VariantOptionsEditor to remount with the model's freshly-reset
    // value, since it deliberately doesn't watch its model after mount (see
    // that component for why). Omit when the model only ever changes
    // through a full remount of this component instead (e.g. an edit modal
    // keyed by the variant being edited).
    optionsResetKey?: number;
}>();
</script>

<template>
    <div :class="formGrid3Class">
        <FormField
            v-model="form.sku"
            type="text"
            :label="t('admin.products.sku')"
            :error="errors.sku"
            required
        />
        <div>
            <FormField
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                :label="t('admin.products.variantPrice')"
                :error="errors.price"
            />
            <p :class="hintTextClass">
                {{ t('admin.products.variantPriceHint') }}
            </p>
        </div>
        <FormField
            v-model="form.stock"
            type="number"
            min="0"
            :label="t('admin.products.stock')"
            :error="errors.stock"
        />
    </div>

    <div>
        <InputLabel>{{ t('admin.products.options') }}</InputLabel>
        <VariantOptionsEditor :key="optionsResetKey" v-model="form.options" />
    </div>

    <CheckboxField
        v-model:checked="form.is_active"
        :label="t('admin.products.isActive')"
    />
</template>
