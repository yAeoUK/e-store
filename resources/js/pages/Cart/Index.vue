<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import {
    borderColorClass,
    cardPaddingClass,
    controlShapeClass,
    headingTextClass,
    mutedTextClass,
    pageHeaderTextClass,
    rowActionsClass,
    stackedRowCardClass,
    totalRowClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import InputError from '@/components/InputError.vue';
import LabelText from '@/components/LabelText.vue';
import MutedText from '@/components/MutedText.vue';
import PageContainer from '@/components/PageContainer.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { useCartSubtotal } from '@/composables/useCartSubtotal';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { formatCurrency, formatVariantOptions } from '@/lib/format';
import { integer, min, required, validateFields } from '@/lib/validation';
import type { Cart } from '@/types/cart';

const quantityBoxClass = `w-20 ${controlShapeClass} ${borderColorClass} text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100`;

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    product: {
        id: number;
        name: string;
        slug: string;
        images?: { url: string; alt_text?: string | null }[];
    };
    product_variant: {
        id: number;
        sku: string;
        options?: Record<string, string | number> | null;
    } | null;
}

const props = defineProps<{ cart: Cart<OrderItem> }>();

const subtotal = useCartSubtotal(() => props.cart.order_items);

function updateQuantity(item: OrderItem, quantity: number) {
    if (quantity < 1) {
        return;
    }

    updatingQuantity.value = true;

    router.patch(
        route('cart.items.update', item.id),
        { quantity },
        {
            preserveScroll: true,
            onFinish: () => {
                updatingQuantity.value = false;
                editingItem.value = null;
            },
        },
    );
}

const editingItem = ref<OrderItem | null>(null);
const editQuantity = ref<number | string>(1);
const updatingQuantity = ref(false);

const quantityRules = {
    quantity: [
        required(t('shop.cart.quantity')),
        integer(t('shop.cart.quantity')),
        min(t('shop.cart.quantity'), 1),
    ],
};

const quantityAttempted = ref(false);
const quantityClientErrors = computed(() =>
    quantityAttempted.value
        ? validateFields({ quantity: editQuantity.value }, quantityRules)
        : {},
);

function openQuantityDialog(item: OrderItem) {
    editingItem.value = item;
    editQuantity.value = item.quantity;
    quantityAttempted.value = false;
}

function closeQuantityDialog() {
    editingItem.value = null;
    quantityAttempted.value = false;
}

function decrementEditQuantity() {
    if (Number(editQuantity.value) > 1) {
        editQuantity.value = Number(editQuantity.value) - 1;
    }
}

function incrementEditQuantity() {
    editQuantity.value = Number(editQuantity.value) + 1;
}

function saveQuantity() {
    quantityAttempted.value = true;

    if (Object.keys(quantityClientErrors.value).length > 0) {
        return;
    }

    if (!editingItem.value) {
        return;
    }

    updateQuantity(editingItem.value, Number(editQuantity.value));
}

const {
    confirmingId: confirmingRemoveId,
    deleting: removing,
    confirmDelete: confirmRemove,
    cancel: cancelRemove,
    destroy: remove,
} = useDeleteConfirmation((id: number) => route('cart.items.destroy', id));

const {
    confirmingId: confirmingClear,
    deleting: clearing,
    confirmDelete: confirmClear,
    cancel: cancelClear,
    destroy: clearCart,
} = useDeleteConfirmation<true>(() => route('cart.clear'));
</script>

<template>
    <ShopLayout>
        <Head :title="t('shop.cart.pageTitle')" />

        <template #header>
            <h2 :class="pageHeaderTextClass">
                {{ t('shop.cart.heading') }}
            </h2>
        </template>

        <PageContainer>
            <Card :class="cardPaddingClass">
                <MutedText v-if="cart.order_items.length === 0">
                    {{ t('shop.cart.empty') }}
                </MutedText>

                <template v-else>
                    <ul class="mb-6 space-y-3">
                        <li
                            v-for="item in cart.order_items"
                            :key="item.id"
                            :class="stackedRowCardClass"
                        >
                            <div>
                                <p class="font-medium">
                                    {{ item.product.name }}
                                </p>
                                <MutedText v-if="item.product_variant">
                                    {{
                                        formatVariantOptions(
                                            item.product_variant.options,
                                        )
                                    }}
                                </MutedText>
                                <MutedText>
                                    {{ formatCurrency(item.unit_price) }}
                                </MutedText>
                            </div>
                            <div :class="rowActionsClass">
                                <div class="flex items-center gap-2">
                                    <span :class="quantityBoxClass">
                                        {{ item.quantity }}
                                    </span>
                                    <SecondaryButton
                                        @click="openQuantityDialog(item)"
                                    >
                                        {{ t('shop.cart.editQuantity') }}
                                    </SecondaryButton>
                                </div>
                                <DangerButton @click="confirmRemove(item.id)">
                                    {{ t('shop.cart.remove') }}
                                </DangerButton>
                            </div>
                        </li>
                    </ul>

                    <div :class="totalRowClass">
                        <span :class="['font-semibold', headingTextClass]">
                            {{ t('shop.cart.subtotal') }}
                        </span>
                        <span
                            :class="['text-lg font-semibold', headingTextClass]"
                        >
                            {{ formatCurrency(subtotal) }}
                        </span>
                    </div>

                    <div class="mt-6 flex items-center justify-between">
                        <DangerButton @click="confirmClear(true)">
                            {{ t('shop.cart.clearCart') }}
                        </DangerButton>
                        <ButtonLink
                            variant="primary"
                            :href="route('checkout.index')"
                        >
                            {{ t('shop.cart.proceedToCheckout') }}
                        </ButtonLink>
                    </div>
                </template>

                <p v-if="cart.order_items.length === 0" class="mt-4">
                    <ButtonLink :href="route('home')" :class="mutedTextClass">
                        {{ t('shop.cart.continueShopping') }}
                    </ButtonLink>
                </p>
            </Card>
        </PageContainer>

        <ConfirmationDialog
            :show="editingItem !== null"
            :title="t('shop.cart.editQuantityTitle')"
            :confirm-label="t('common.save')"
            :processing="updatingQuantity"
            @confirm="saveQuantity"
            @cancel="closeQuantityDialog"
        >
            <div class="mt-4">
                <LabelText>{{ t('shop.cart.quantity') }}</LabelText>
                <div class="mt-1 flex items-center gap-2">
                    <SecondaryButton
                        :aria-label="t('shop.cart.decreaseQuantity')"
                        @click="decrementEditQuantity"
                    >
                        −
                    </SecondaryButton>
                    <input
                        v-model.number="editQuantity"
                        type="number"
                        min="1"
                        :class="quantityBoxClass"
                    />
                    <SecondaryButton
                        :aria-label="t('shop.cart.increaseQuantity')"
                        @click="incrementEditQuantity"
                    >
                        +
                    </SecondaryButton>
                </div>
                <InputError :message="quantityClientErrors.quantity" />
            </div>
        </ConfirmationDialog>

        <ConfirmationDialog
            :show="confirmingRemoveId !== null"
            :title="t('shop.cart.removeConfirmTitle')"
            :message="t('shop.cart.removeConfirmMessage')"
            :confirm-label="t('shop.cart.remove')"
            danger
            :processing="removing"
            @confirm="remove"
            @cancel="cancelRemove"
        />

        <ConfirmationDialog
            :show="confirmingClear !== null"
            :title="t('shop.cart.clearConfirmTitle')"
            :message="t('shop.cart.clearConfirmMessage')"
            :confirm-label="t('shop.cart.clearCart')"
            danger
            :processing="clearing"
            @confirm="clearCart"
            @cancel="cancelClear"
        />
    </ShopLayout>
</template>
