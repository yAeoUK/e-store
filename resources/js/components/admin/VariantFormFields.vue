<script setup lang="ts">
import type { InertiaForm } from '@inertiajs/vue3';
import IsActiveField from '@/components/admin/IsActiveField.vue';
import PriceField from '@/components/admin/PriceField.vue';
import StockField from '@/components/admin/StockField.vue';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';
import { formGrid3Class } from '@/components/classNames';
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
        <PriceField
            v-model="form.price"
            :label="t('admin.products.variantPrice')"
            :error="errors.price"
            :hint="t('admin.products.variantPriceHint')"
        />
        <StockField
            v-model="form.stock"
            :label="t('admin.products.stock')"
            :error="errors.stock"
        />
    </div>

    <div>
        <InputLabel>{{ t('admin.products.options') }}</InputLabel>
        <VariantOptionsEditor :key="optionsResetKey" v-model="form.options" />
    </div>

    <IsActiveField v-model:checked="form.is_active" />
</template>
