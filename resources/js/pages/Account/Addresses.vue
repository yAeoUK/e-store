<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Card from '@/components/Card.vue';
import {
    accentBadgeTextClass,
    headingTextClass,
    rowActionsClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import FormActions from '@/components/FormActions.vue';
import Modal from '@/components/Modal.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import AddressFormFields from './Partials/AddressFormFields.vue';

interface Address {
    id: number;
    label: string | null;
    name: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postal_code: string;
    country: string;
    phone: string | null;
    is_default: boolean;
}

defineProps<{
    addresses: Address[];
}>();

const form = useForm({
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
});

function submit() {
    form.post(route('account.addresses.store'), {
        onSuccess: () => form.reset(),
    });
}

const confirmingDeleteId = ref<number | null>(null);
const deleting = ref(false);

function confirmDelete(id: number) {
    confirmingDeleteId.value = id;
}

function destroy() {
    if (confirmingDeleteId.value === null) {
        return;
    }

    deleting.value = true;

    router.delete(
        route('account.addresses.destroy', confirmingDeleteId.value),
        {
            preserveScroll: true,
            onFinish: () => {
                deleting.value = false;
                confirmingDeleteId.value = null;
            },
        },
    );
}

function setDefault(id: number) {
    router.post(
        route('account.addresses.setDefault', id),
        {},
        { preserveScroll: true },
    );
}

const editingAddressId = ref<number | null>(null);

const editForm = useForm({
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
});

function edit(addr: Address) {
    editingAddressId.value = addr.id;
    editForm.clearErrors();
    editForm.label = addr.label ?? '';
    editForm.name = addr.name ?? '';
    editForm.line1 = addr.line1;
    editForm.line2 = addr.line2 ?? '';
    editForm.city = addr.city;
    editForm.state = addr.state ?? '';
    editForm.postal_code = addr.postal_code;
    editForm.country = addr.country;
    editForm.phone = addr.phone ?? '';
    editForm.is_default = addr.is_default;
}

function closeEdit() {
    editingAddressId.value = null;
    editForm.clearErrors();
    editForm.reset();
}

function submitEdit() {
    if (editingAddressId.value === null) {
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
            <h2
                :class="[
                    'text-xl leading-tight font-semibold',
                    headingTextClass,
                ]"
            >
                {{ t('account.addresses.pageTitle') }}
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div class="space-y-6">
                    <Card class="overflow-hidden p-6">
                        <MutedText v-if="addresses.length === 0" class="mb-4">
                            {{ t('account.addresses.empty') }}
                        </MutedText>

                        <ul class="mb-6 space-y-3">
                            <li
                                v-for="addr in addresses"
                                :key="addr.id"
                                class="rounded border border-slate-200 p-4 dark:border-slate-800"
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
                                        <MutedText>
                                            {{ addr.line1 }} {{ addr.line2 }}
                                        </MutedText>
                                        <MutedText>
                                            {{ addr.city }}
                                            {{ addr.postal_code }}
                                            {{ addr.state }}
                                        </MutedText>
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

                    <Card class="overflow-hidden p-6">
                        <h3 class="mb-4 text-lg font-semibold">
                            {{ t('account.addresses.addHeading') }}
                        </h3>
                        <form @submit.prevent="submit" class="space-y-4">
                            <AddressFormFields
                                v-model:label="form.label"
                                v-model:name="form.name"
                                v-model:line1="form.line1"
                                v-model:line2="form.line2"
                                v-model:city="form.city"
                                v-model:state="form.state"
                                v-model:postal_code="form.postal_code"
                                v-model:country="form.country"
                                v-model:is_default="form.is_default"
                                :errors="form.errors"
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
                <h3 class="mb-4 text-lg font-semibold">
                    {{ t('account.addresses.editHeading') }}
                </h3>
                <form @submit.prevent="submitEdit" class="space-y-4">
                    <AddressFormFields
                        v-model:label="editForm.label"
                        v-model:name="editForm.name"
                        v-model:line1="editForm.line1"
                        v-model:line2="editForm.line2"
                        v-model:city="editForm.city"
                        v-model:state="editForm.state"
                        v-model:postal_code="editForm.postal_code"
                        v-model:country="editForm.country"
                        v-model:is_default="editForm.is_default"
                        :errors="editForm.errors"
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
