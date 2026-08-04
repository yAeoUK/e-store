<script setup lang="ts">
import { ref } from 'vue';
import type { AdminProductVariant } from '@/components/admin/admin.ts';
import AdminSection from '@/components/admin/AdminSection.vue';
import VariantFormFields from '@/components/admin/VariantFormFields.vue';
import Card from '@/components/Card.vue';
import {
    cardPaddingClass,
    mutedTextClass,
    rowActionsClass,
    sectionHeadingClass,
    stackedRowCardClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import Modal from '@/components/Modal.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { useEditableForm } from '@/composables/useEditableForm';
import { t } from '@/i18n';
import { formatCurrency } from '@/lib/format';
import { integer, maxLength, min, numeric, required } from '@/lib/validation';

const props = defineProps<{
    productId: number;
    variants: AdminProductVariant[];
}>();

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

const rules = {
    sku: [
        required(t('admin.products.sku')),
        maxLength(t('admin.products.sku'), 255),
    ],
    price: [
        numeric(t('admin.products.variantPrice')),
        min(t('admin.products.variantPrice'), 0),
    ],
    stock: [
        integer(t('admin.products.stock')),
        min(t('admin.products.stock'), 0),
    ],
};

const {
    form,
    errors,
    attemptSubmit,
    resetAttempted,
    editingId: editingVariantId,
    editForm,
    editErrors,
    attemptEditSubmit,
    edit,
    closeEdit,
} = useEditableForm(
    () => ({
        sku: '',
        options: {} as Record<string, string>,
        price: '' as number | string,
        stock: 0,
        is_active: true,
    }),
    rules,
    (target, variant: AdminProductVariant) => {
        target.sku = variant.sku;
        target.options = variant.options ?? {};
        target.price = variant.price ?? '';
        target.stock = variant.stock;
        target.is_active = variant.is_active;
    },
);

function submit(): void {
    if (!attemptSubmit()) {
        return;
    }

    form.post(route('admin.products.variants.store', props.productId), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            addFormResetKey.value++;
            resetAttempted();
        },
    });
}

function submitEdit(): void {
    if (!attemptEditSubmit()) {
        return;
    }

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

const {
    confirmingId: confirmingDeleteId,
    deleting,
    confirmDelete,
    destroy,
} = useDeleteConfirmation((id: number) =>
    route('admin.products.variants.destroy', [props.productId, id]),
);
</script>

<template>
    <AdminSection :title="t('admin.products.variants')">
        <Card :class="cardPaddingClass">
            <MutedText v-if="variants.length === 0" class="mb-4">
                {{ t('admin.products.empty') }}
            </MutedText>

            <ul class="space-y-3">
                <li
                    v-for="variant in variants"
                    :key="variant.id"
                    :class="stackedRowCardClass"
                >
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium">{{ variant.sku }}</span>
                            <span
                                v-if="!variant.is_active"
                                :class="['text-xs font-medium', mutedTextClass]"
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
                                    ? formatCurrency(variant.price)
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

        <Card :class="cardPaddingClass">
            <h3 :class="['mb-4', sectionHeadingClass]">
                {{ t('admin.products.addVariant') }}
            </h3>
            <form @submit.prevent="submit" class="space-y-4">
                <VariantFormFields
                    :form="form"
                    :errors="errors"
                    :options-reset-key="addFormResetKey"
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
                <h3 :class="['mb-4', sectionHeadingClass]">
                    {{ t('admin.products.editVariant') }}
                </h3>
                <form @submit.prevent="submitEdit" class="space-y-4">
                    <VariantFormFields :form="editForm" :errors="editErrors" />

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
    </AdminSection>
</template>
