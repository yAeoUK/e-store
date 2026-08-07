<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { Pencil, Plus, Star, Trash2 } from '@lucide/vue';
import AddressLines from '@/components/AddressLines.vue';
import Card from '@/components/Card.vue';
import {
    accentBadgeTextClass,
    cardPaddingClass,
    listItemCardClass,
    narrowPageWidthClass,
    pageHeaderTextClass,
    rowActionsClass,
} from '@/components/classNames';
import DangerButton from '@/components/DangerButton.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import EditFormModal from '@/components/EditFormModal.vue';
import IconLabel from '@/components/IconLabel.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import SectionHeading from '@/components/SectionHeading.vue';
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
    fieldErrors,
    attemptSubmit,
    resetAttempted,
    editingId: editingAddressId,
    editForm,
    editFieldErrors,
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
    cancel,
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
                                            <IconLabel :icon="Star">{{
                                                t(
                                                    'account.addresses.setDefault',
                                                )
                                            }}</IconLabel>
                                        </SecondaryButton>
                                        <SecondaryButton
                                            type="button"
                                            @click="edit(addr)"
                                        >
                                            <IconLabel :icon="Pencil">{{
                                                t('account.addresses.edit')
                                            }}</IconLabel>
                                        </SecondaryButton>
                                        <DangerButton
                                            @click="confirmDelete(addr.id)"
                                        >
                                            <IconLabel :icon="Trash2">{{
                                                t('common.delete')
                                            }}</IconLabel>
                                        </DangerButton>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </Card>

                    <Card :class="cardPaddingClass">
                        <SectionHeading
                            :heading="t('account.addresses.addHeading')"
                            :icon="Plus"
                            icon-class="text-indigo-600 dark:text-indigo-400"
                        />
                        <form @submit.prevent="submit" class="space-y-4">
                            <AddressFormFields
                                :form="form"
                                :errors="fieldErrors"
                            />
                            <div>
                                <PrimaryButton :disabled="form.processing">
                                    <IconLabel :icon="Plus">{{
                                        t('account.addresses.submit')
                                    }}</IconLabel>
                                </PrimaryButton>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>

        <EditFormModal
            :show="editingAddressId !== null"
            :icon="Pencil"
            :title="t('account.addresses.editHeading')"
            :processing="editForm.processing"
            :save-label="t('account.addresses.saveChanges')"
            @close="closeEdit"
            @submit="submitEdit"
        >
            <AddressFormFields :form="editForm" :errors="editFieldErrors" />
        </EditFormModal>

        <DeleteConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('account.addresses.deleteConfirmTitle')"
            :message="t('account.addresses.deleteConfirmMessage')"
            :processing="deleting"
            @confirm="destroy"
            @cancel="cancel"
        />
    </ShopLayout>
</template>
