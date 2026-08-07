<script setup lang="ts">
import { Pencil, Plus, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import type { AdminProductVariant } from '@/components/admin/admin.ts';
import AdminListCard from '@/components/admin/AdminListCard.vue';
import AdminSection from '@/components/admin/AdminSection.vue';
import VariantFormFields from '@/components/admin/VariantFormFields.vue';
import Card from '@/components/Card.vue';
import {
    cardPaddingClass,
    mutedTextClass,
    rowActionsClass,
    stackedRowCardClass,
} from '@/components/classNames';
import DangerButton from '@/components/DangerButton.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import EditFormModal from '@/components/EditFormModal.vue';
import FormActions from '@/components/FormActions.vue';
import IconLabel from '@/components/IconLabel.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import SectionHeading from '@/components/SectionHeading.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { useEditableForm } from '@/composables/useEditableForm';
import { t } from '@/i18n';
import { formatCurrency, formatVariantOptions } from '@/lib/format';
import { integer, maxLength, min, numeric, required } from '@/lib/validation';

const props = defineProps<{
    productId: number;
    variants: AdminProductVariant[];
}>();

function optionsSummary(options: Record<string, string> | null): string {
    return formatVariantOptions(options) || '—';
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
    cancel,
    destroy,
} = useDeleteConfirmation((id: number) =>
    route('admin.products.variants.destroy', [props.productId, id]),
);
</script>

<template>
    <AdminSection :title="t('admin.products.variants')">
        <AdminListCard
            :empty="variants.length === 0"
            :empty-message="t('admin.products.empty')"
        >
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
                            <IconLabel :icon="Pencil">{{
                                t('admin.actions.edit')
                            }}</IconLabel>
                        </SecondaryButton>
                        <DangerButton @click="confirmDelete(variant.id)">
                            <IconLabel :icon="Trash2">{{
                                t('admin.actions.delete')
                            }}</IconLabel>
                        </DangerButton>
                    </div>
                </li>
            </ul>
        </AdminListCard>

        <Card :class="cardPaddingClass">
            <SectionHeading :heading="t('admin.products.addVariant')" />
            <form @submit.prevent="submit" class="space-y-4">
                <VariantFormFields
                    :form="form"
                    :errors="errors"
                    :options-reset-key="addFormResetKey"
                />

                <FormActions>
                    <PrimaryButton :disabled="form.processing">
                        <IconLabel :icon="Plus">{{
                            t('admin.products.addVariant')
                        }}</IconLabel>
                    </PrimaryButton>
                </FormActions>
            </form>
        </Card>

        <EditFormModal
            :show="editingVariantId !== null"
            :title="t('admin.products.editVariant')"
            :processing="editForm.processing"
            :save-label="t('admin.products.save')"
            @close="closeEdit"
            @submit="submitEdit"
        >
            <VariantFormFields :form="editForm" :errors="editErrors" />
        </EditFormModal>

        <DeleteConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteVariantConfirmTitle')"
            :message="t('admin.products.deleteVariantConfirmMessage')"
            :processing="deleting"
            @confirm="destroy"
            @cancel="cancel"
        />
    </AdminSection>
</template>
