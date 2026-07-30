<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import type { AdminProductVariant } from '@/components/admin/admin.ts';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';
import Card from '@/components/Card.vue';
import CheckboxField from '@/components/CheckboxField.vue';
import {
    mutedBorderClass,
    mutedTextClass,
    rowActionsClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import InputLabel from '@/components/InputLabel.vue';
import Modal from '@/components/Modal.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';

const props = defineProps<{
    productId: number;
    variants: AdminProductVariant[];
}>();

const priceHintClass = [mutedTextClass, 'mt-1 text-xs'];

function optionsSummary(options: Record<string, string> | null): string {
    if (!options || Object.keys(options).length === 0) {
        return '—';
    }

    return Object.entries(options)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

// Bumped after every successful add-variant submission to force
// VariantOptionsEditor to remount with the form's freshly-reset value,
// since it deliberately doesn't watch its model after mount (see that
// component for why).
const addFormResetKey = ref(0);

const form = useForm({
    sku: '',
    options: {} as Record<string, string>,
    price: '' as number | string,
    stock: 0,
    is_active: true,
});

function submit(): void {
    form.post(route('admin.products.variants.store', props.productId), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            addFormResetKey.value++;
        },
    });
}

const editingVariantId = ref<number | null>(null);

const editForm = useForm({
    sku: '',
    options: {} as Record<string, string>,
    price: '' as number | string,
    stock: 0,
    is_active: true,
});

function edit(variant: AdminProductVariant): void {
    editingVariantId.value = variant.id;
    editForm.clearErrors();
    editForm.sku = variant.sku;
    editForm.options = variant.options ?? {};
    editForm.price = variant.price ?? '';
    editForm.stock = variant.stock;
    editForm.is_active = variant.is_active;
}

function closeEdit(): void {
    editingVariantId.value = null;
    editForm.clearErrors();
    editForm.reset();
}

function submitEdit(): void {
    if (editingVariantId.value === null) {
        return;
    }

    editForm.patch(
        route('admin.products.variants.update', [
            props.productId,
            editingVariantId.value,
        ]),
        {
            preserveScroll: true,
            onSuccess: () => closeEdit(),
        },
    );
}

const confirmingDeleteId = ref<number | null>(null);
const deleting = ref(false);

function confirmDelete(id: number): void {
    confirmingDeleteId.value = id;
}

function destroy(): void {
    if (confirmingDeleteId.value === null) {
        return;
    }

    deleting.value = true;

    router.delete(
        route('admin.products.variants.destroy', [
            props.productId,
            confirmingDeleteId.value,
        ]),
        {
            preserveScroll: true,
            onFinish: () => {
                deleting.value = false;
                confirmingDeleteId.value = null;
            },
        },
    );
}
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-lg font-semibold">
            {{ t('admin.products.variants') }}
        </h2>

        <Card class="overflow-hidden p-6">
            <MutedText v-if="variants.length === 0" class="mb-4">
                {{ t('admin.products.empty') }}
            </MutedText>

            <ul class="space-y-3">
                <li
                    v-for="variant in variants"
                    :key="variant.id"
                    :class="[
                        mutedBorderClass,
                        'flex flex-col gap-3 rounded border p-4 sm:flex-row sm:items-center sm:justify-between',
                    ]"
                >
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium">{{ variant.sku }}</span>
                            <span
                                v-if="!variant.is_active"
                                class="text-xs font-medium text-slate-500 dark:text-slate-400"
                            >
                                {{ t('admin.products.isInactive') }}
                            </span>
                        </div>
                        <MutedText>{{
                            optionsSummary(variant.options)
                        }}</MutedText>
                        <MutedText>
                            {{
                                variant.price !== null
                                    ? `$${Number(variant.price).toFixed(2)}`
                                    : '—'
                            }}
                            &middot; {{ t('admin.products.stock') }}:
                            {{ variant.stock }}
                        </MutedText>
                    </div>
                    <div :class="rowActionsClass">
                        <SecondaryButton type="button" @click="edit(variant)">
                            {{ t('admin.actions.edit') }}
                        </SecondaryButton>
                        <DangerButton @click="confirmDelete(variant.id)">
                            {{ t('admin.actions.delete') }}
                        </DangerButton>
                    </div>
                </li>
            </ul>
        </Card>

        <Card class="overflow-hidden p-6">
            <h3 class="mb-4 text-base font-semibold">
                {{ t('admin.products.addVariant') }}
            </h3>
            <form @submit.prevent="submit" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-3">
                    <FormField
                        v-model="form.sku"
                        type="text"
                        :label="t('admin.products.sku')"
                        :error="form.errors.sku"
                    />
                    <div>
                        <FormField
                            v-model="form.price"
                            type="number"
                            min="0"
                            step="0.01"
                            :label="t('admin.products.variantPrice')"
                            :error="form.errors.price"
                        />
                        <p :class="priceHintClass">
                            {{ t('admin.products.variantPriceHint') }}
                        </p>
                    </div>
                    <FormField
                        v-model="form.stock"
                        type="number"
                        min="0"
                        :label="t('admin.products.stock')"
                        :error="form.errors.stock"
                    />
                </div>

                <div>
                    <InputLabel>{{ t('admin.products.options') }}</InputLabel>
                    <VariantOptionsEditor
                        :key="addFormResetKey"
                        v-model="form.options"
                    />
                </div>

                <CheckboxField
                    v-model:checked="form.is_active"
                    :label="t('admin.products.isActive')"
                />

                <FormActions>
                    <PrimaryButton :disabled="form.processing">
                        {{ t('admin.products.addVariant') }}
                    </PrimaryButton>
                </FormActions>
            </form>
        </Card>

        <Modal :show="editingVariantId !== null" @close="closeEdit">
            <div class="p-6">
                <h3 class="mb-4 text-lg font-semibold">
                    {{ t('admin.products.editVariant') }}
                </h3>
                <form @submit.prevent="submitEdit" class="space-y-4">
                    <FormField
                        v-model="editForm.sku"
                        type="text"
                        :label="t('admin.products.sku')"
                        :error="editForm.errors.sku"
                    />
                    <div>
                        <FormField
                            v-model="editForm.price"
                            type="number"
                            min="0"
                            step="0.01"
                            :label="t('admin.products.variantPrice')"
                            :error="editForm.errors.price"
                        />
                        <p :class="priceHintClass">
                            {{ t('admin.products.variantPriceHint') }}
                        </p>
                    </div>
                    <FormField
                        v-model="editForm.stock"
                        type="number"
                        min="0"
                        :label="t('admin.products.stock')"
                        :error="editForm.errors.stock"
                    />
                    <div>
                        <InputLabel>{{
                            t('admin.products.options')
                        }}</InputLabel>
                        <VariantOptionsEditor v-model="editForm.options" />
                    </div>
                    <CheckboxField
                        v-model:checked="editForm.is_active"
                        :label="t('admin.products.isActive')"
                    />

                    <FormActions>
                        <SecondaryButton type="button" @click="closeEdit">
                            {{ t('common.cancel') }}
                        </SecondaryButton>
                        <PrimaryButton :disabled="editForm.processing">
                            {{ t('admin.products.save') }}
                        </PrimaryButton>
                    </FormActions>
                </form>
            </div>
        </Modal>

        <ConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteVariantConfirmTitle')"
            :message="t('admin.products.deleteVariantConfirmMessage')"
            :confirm-label="t('common.delete')"
            danger
            :processing="deleting"
            @confirm="destroy"
            @cancel="confirmingDeleteId = null"
        />
    </div>
</template>
