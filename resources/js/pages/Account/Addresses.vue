<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AddressLines from '@/components/AddressLines.vue';
import Card from '@/components/Card.vue';
import {
    accentBadgeTextClass,
    cardPaddingClass,
    listItemCardClass,
    narrowPageWidthClass,
    pageHeaderTextClass,
    rowActionsClass,
    sectionHeadingClass,
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
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { maxLength, required } from '@/lib/validation';
import type { Address } from '@/types/address';
import AddressFormFields from './Partials/AddressFormFields.vue';

defineProps<{
    addresses: Address[];
}>();

const addressRules = {
    label: [maxLength(t('account.addresses.label'), 255)],
    name: [maxLength(t('account.addresses.name'), 255)],
    line1: [
        required(t('account.addresses.line1')),
        maxLength(t('account.addresses.line1'), 255),
    ],
    line2: [maxLength(t('account.addresses.line2'), 255)],
    city: [
        required(t('account.addresses.city')),
        maxLength(t('account.addresses.city'), 255),
    ],
    state: [maxLength(t('account.addresses.state'), 255)],
    postal_code: [
        required(t('account.addresses.postalCode')),
        maxLength(t('account.addresses.postalCode'), 64),
    ],
    country: [
        required(t('account.addresses.country')),
        maxLength(t('account.addresses.country'), 64),
    ],
    phone: [maxLength(t('account.addresses.phone'), 64)],
};

const {
    form,
    clientErrors,
    attemptSubmit,
    resetAttempted,
    editingId: editingAddressId,
    editForm,
    editClientErrors,
    attemptEditSubmit,
    edit,
    closeEdit,
} = useEditableForm(
    () => ({
        label: '',
        name: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
        phone: '',
        is_default: false,
    }),
    addressRules,
    (target, addr: Address) => {
        target.label = addr.label ?? '';
        target.name = addr.name ?? '';
        target.line1 = addr.line1;
        target.line2 = addr.line2 ?? '';
        target.city = addr.city;
        target.state = addr.state ?? '';
        target.postal_code = addr.postal_code;
        target.country = addr.country;
        target.phone = addr.phone ?? '';
        target.is_default = addr.is_default;
    },
);

function submit() {
    if (!attemptSubmit()) {
        return;
    }

    form.post(route('account.addresses.store'), {
        onSuccess: () => {
            resetAttempted();
            form.reset();
        },
    });
}

const {
    confirmingId: confirmingDeleteId,
    deleting,
    confirmDelete,
    destroy,
} = useDeleteConfirmation((id: number) =>
    route('account.addresses.destroy', id),
);

function setDefault(id: number) {
    router.post(
        route('account.addresses.setDefault', id),
        {},
        { preserveScroll: true },
    );
}

function submitEdit() {
    if (editingAddressId.value === null) {
        return;
    }

    if (!attemptEditSubmit()) {
        return;
    }

    editForm.patch(route('account.addresses.update', editingAddressId.value), {
        preserveScroll: true,
        onSuccess: () => closeEdit(),
    });
}
</script>

<template>
    <ShopLayout>
        <Head :title="t('account.addresses.pageTitle')" />

        <template #header>
            <h2 :class="pageHeaderTextClass">
                {{ t('account.addresses.pageTitle') }}
            </h2>
        </template>

        <div class="py-12">
            <div :class="narrowPageWidthClass">
                <div class="space-y-6">
                    <Card :class="cardPaddingClass">
                        <MutedText v-if="addresses.length === 0" class="mb-4">
                            {{ t('account.addresses.empty') }}
                        </MutedText>

                        <ul class="mb-6 space-y-3">
                            <li
                                v-for="addr in addresses"
                                :key="addr.id"
                                :class="listItemCardClass"
                            >
                                <div
                                    class="flex flex-col gap-3 sm:flex-row sm:justify-between"
                                >
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium">
                                                {{ addr.label || addr.name }}
                                            </span>
                                            <span
                                                v-if="addr.is_default"
                                                :class="accentBadgeTextClass"
                                            >
                                                {{
                                                    t(
                                                        'account.addresses.defaultLabel',
                                                    )
                                                }}
                                            </span>
                                        </div>
                                        <AddressLines
                                            :address="addr"
                                            :show-label="false"
                                        />
                                    </div>
                                    <div :class="rowActionsClass">
                                        <SecondaryButton
                                            v-if="!addr.is_default"
                                            type="button"
                                            @click="setDefault(addr.id)"
                                        >
                                            {{
                                                t(
                                                    'account.addresses.setDefault',
                                                )
                                            }}
                                        </SecondaryButton>
                                        <SecondaryButton
                                            type="button"
                                            @click="edit(addr)"
                                        >
                                            {{ t('account.addresses.edit') }}
                                        </SecondaryButton>
                                        <DangerButton
                                            @click="confirmDelete(addr.id)"
                                        >
                                            {{ t('common.delete') }}
                                        </DangerButton>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </Card>

                    <Card :class="cardPaddingClass">
                        <h3 :class="['mb-4', sectionHeadingClass]">
                            {{ t('account.addresses.addHeading') }}
                        </h3>
                        <form @submit.prevent="submit" class="space-y-4">
                            <AddressFormFields
                                :form="form"
                                :errors="{ ...clientErrors, ...form.errors }"
                            />
                            <div>
                                <PrimaryButton :disabled="form.processing">
                                    {{ t('account.addresses.submit') }}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>

        <Modal :show="editingAddressId !== null" @close="closeEdit">
            <div class="p-6">
                <h3 :class="['mb-4', sectionHeadingClass]">
                    {{ t('account.addresses.editHeading') }}
                </h3>
                <form @submit.prevent="submitEdit" class="space-y-4">
                    <AddressFormFields
                        :form="editForm"
                        :errors="{ ...editClientErrors, ...editForm.errors }"
                    />
                    <FormActions>
                        <SecondaryButton type="button" @click="closeEdit">
                            {{ t('common.cancel') }}
                        </SecondaryButton>
                        <PrimaryButton :disabled="editForm.processing">
                            {{ t('account.addresses.saveChanges') }}
                        </PrimaryButton>
                    </FormActions>
                </form>
            </div>
        </Modal>

        <ConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('account.addresses.deleteConfirmTitle')"
            :message="t('account.addresses.deleteConfirmMessage')"
            :confirm-label="t('common.delete')"
            danger
            :processing="deleting"
            @confirm="destroy"
            @cancel="confirmingDeleteId = null"
        />
    </ShopLayout>
</template>
