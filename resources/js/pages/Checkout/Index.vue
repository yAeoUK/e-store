<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import AddressLines from '@/components/AddressLines.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import {
    cardPaddingClass,
    pageHeaderTextClass,
    sectionHeadingClass,
} from '@/components/classNames';
import InputError from '@/components/InputError.vue';
import MutedText from '@/components/MutedText.vue';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';
import PageContainer from '@/components/PageContainer.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import RadioCardOption from '@/components/RadioCardOption.vue';
import { useCartSubtotal } from '@/composables/useCartSubtotal';
import { useFormValidation } from '@/composables/useFormValidation';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { toSummaryItems } from '@/lib/format';
import { required } from '@/lib/validation';
import type { Address } from '@/types/address';
import type { Cart } from '@/types/cart';

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    product: { name: string };
    product_variant: {
        sku: string;
        options?: Record<string, string | number> | null;
    } | null;
}

const props = defineProps<{
    cart: Cart<OrderItem>;
    addresses: Address[];
}>();

const subtotal = useCartSubtotal(() => props.cart.order_items);

const defaultAddress = props.addresses.find((address) => address.is_default);

const summaryItems = computed(() =>
    toSummaryItems(
        props.cart.order_items,
        (item) => item.product.name,
        (item) => item.product_variant?.options,
    ),
);

const form = useForm({
    address_id: defaultAddress?.id ?? props.addresses[0]?.id ?? null,
    payment_method: 'cod',
});

const rules = {
    address_id: [required(t('shop.checkout.shippingAddress'))],
    payment_method: [required(t('shop.checkout.paymentMethod'))],
};

const { errors, attemptSubmit } = useFormValidation(form, rules);

function submit() {
    if (!attemptSubmit()) {
        return;
    }

    form.post(route('checkout.store'));
}
</script>

<template>
    <ShopLayout>
        <Head :title="t('shop.checkout.pageTitle')" />

        <template #header>
            <h2 :class="pageHeaderTextClass">
                {{ t('shop.checkout.heading') }}
            </h2>
        </template>

        <PageContainer>
            <div class="space-y-6">
                <Card :class="cardPaddingClass">
                    <OrderItemsSummary
                        :heading="t('shop.checkout.orderSummary')"
                        :items="summaryItems"
                        :total-label="t('shop.checkout.total')"
                        :total="subtotal"
                    />
                </Card>

                <Card :class="cardPaddingClass">
                    <h3 :class="['mb-4', sectionHeadingClass]">
                        {{ t('shop.checkout.shippingAddress') }}
                    </h3>

                    <template v-if="addresses.length === 0">
                        <MutedText class="mb-4">
                            {{ t('shop.checkout.noAddresses') }}
                        </MutedText>
                        <ButtonLink
                            variant="primary"
                            :href="route('account.addresses.index')"
                        >
                            {{ t('shop.checkout.manageAddresses') }}
                        </ButtonLink>
                    </template>

                    <ul v-else class="space-y-3">
                        <RadioCardOption
                            v-for="address in addresses"
                            :key="address.id"
                            v-model="form.address_id"
                            :value="address.id"
                            align="start"
                        >
                            <span class="font-medium">
                                {{ address.label || address.name }}
                            </span>
                            <AddressLines
                                :address="address"
                                :show-label="false"
                            />
                        </RadioCardOption>
                    </ul>
                    <InputError :message="errors.address_id" />
                </Card>

                <form
                    v-if="addresses.length > 0"
                    @submit.prevent="submit"
                    class="space-y-6"
                >
                    <Card :class="cardPaddingClass">
                        <h3 :class="['mb-4', sectionHeadingClass]">
                            {{ t('shop.checkout.paymentMethod') }}
                        </h3>
                        <ul class="space-y-3">
                            <RadioCardOption
                                v-model="form.payment_method"
                                value="cod"
                            >
                                {{ t('shop.checkout.paymentMethods.cod') }}
                            </RadioCardOption>
                            <RadioCardOption
                                v-model="form.payment_method"
                                value="stripe"
                            >
                                {{ t('shop.checkout.paymentMethods.stripe') }}
                            </RadioCardOption>
                        </ul>
                        <InputError :message="errors.payment_method" />
                    </Card>

                    <div>
                        <PrimaryButton :disabled="form.processing">
                            {{ t('shop.checkout.placeOrder') }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </PageContainer>
    </ShopLayout>
</template>
