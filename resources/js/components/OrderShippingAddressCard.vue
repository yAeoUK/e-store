<script setup lang="ts">
import AddressLines from '@/components/AddressLines.vue';
import Card from '@/components/Card.vue';
import { cardPaddingClass } from '@/components/classNames';
import SectionHeading from '@/components/SectionHeading.vue';
import { t } from '@/i18n';
import type { OrdersNamespace } from '@/lib/orderStatus';
import type { AddressSnapshot } from '@/types/address';

defineProps<{
    namespace: OrdersNamespace;
    address: AddressSnapshot;
}>();
</script>

<template>
    <Card :class="cardPaddingClass">
        <SectionHeading
            :heading="t(`${namespace}.detail.shippingAddress`)"
            spacing-class="mb-3"
        />
        <AddressLines :address="address" show-country />
    </Card>
</template>
