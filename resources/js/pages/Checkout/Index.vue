<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { ArrowRight, CreditCard, MapPin } from '@lucide/vue';
import { computed } from 'vue';
import AddressLines from '@/components/AddressLines.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import { cardPaddingClass, pageHeaderTextClass } from '@/components/classNames';
import IconLabel from '@/components/IconLabel.vue';
import InputError from '@/components/InputError.vue';
import MutedText from '@/components/MutedText.vue';
import OrderItemsSummary from '@/components/OrderItemsSummary.vue';
import PageContainer from '@/components/PageContainer.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import RadioCardOption from '@/components/RadioCardOption.vue';
import SectionHeading from '@/components/SectionHeading.vue';
import TextareaField from '@/components/TextareaField.vue';
import { useCartSubtotal } from '@/composables/useCartSubtotal';
import { useFormValidation } from '@/composables/useFormValidation';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import { toSummaryItems } from '@/lib/format';
import { required } from '@/lib/validation';
import type { Address } from '@/types/address';
import type { Cart, CartOrderItem } from '@/types/cart';

const props = defineProps<{
    cart: Cart<CartOrderItem>;
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
    customer_note: '',
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
                    <SectionHeading
                        :heading="t('shop.checkout.shippingAddress')"
                        :icon="MapPin"
                        icon-class="text-indigo-600 dark:text-indigo-400"
                    />

                    <template v-if="addresses.length === 0">
                        <MutedText class="mb-4">
                            {{ t('shop.checkout.noAddresses') }}
                        </MutedText>
                        <ButtonLink
                            variant="primary"
                            :href="route('account.addresses.index')"
                        >
                            <IconLabel :icon="ArrowRight" trailing>{{
                                t('shop.checkout.manageAddresses')
                            }}</IconLabel>
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
                            <AddressLines :address="address" bold-label />
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
                        <SectionHeading
                            :heading="t('shop.checkout.paymentMethod')"
                            :icon="CreditCard"
                            icon-class="text-indigo-600 dark:text-indigo-400"
                        />
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

                    <Card :class="cardPaddingClass">
                        <TextareaField
                            v-model="form.customer_note"
                            :label="t('shop.checkout.note')"
                            :error="form.errors.customer_note"
                            rows="3"
                        />
                    </Card>

                    <div>
                        <PrimaryButton :disabled="form.processing">
                            <IconLabel :icon="CreditCard">{{
                                t('shop.checkout.placeOrder')
                            }}</IconLabel>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </PageContainer>
    </ShopLayout>
</template>
