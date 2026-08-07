<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Lock,
    MessageSquareText,
    RotateCcw,
    Save,
} from '@lucide/vue';
import type { AdminOrderDetail } from '@/components/admin/admin.ts';
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue';
import ButtonLink from '@/components/ButtonLink.vue';
import Card from '@/components/Card.vue';
import { cardPaddingClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import CustomerContact from '@/components/CustomerContact.vue';
import ErrorBanner from '@/components/ErrorBanner.vue';
import FormActions from '@/components/FormActions.vue';
import IconLabel from '@/components/IconLabel.vue';
import OrderNoteCard from '@/components/OrderNoteCard.vue';
import OrderShippingAddressCard from '@/components/OrderShippingAddressCard.vue';
import OrderSummaryCard from '@/components/OrderSummaryCard.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SectionHeading from '@/components/SectionHeading.vue';
import SelectField from '@/components/SelectField.vue';
import TextareaField from '@/components/TextareaField.vue';
import { Badge } from '@/components/ui/badge';
import { useConfirmAction } from '@/composables/useConfirmAction';
import { useServerError } from '@/composables/useServerError';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { t } from '@/i18n';
import { required } from '@/lib/validation';

const props = defineProps<{
    order: AdminOrderDetail;
    allowed_transitions: string[];
}>();

const refundError = useServerError('refund');

const {
    form: statusForm,
    clientErrors: statusErrors,
    submit: submitStatus,
} = useValidatedSubmit(
    { status: props.order.status },
    { status: [required(t('admin.orders.columns.status'))] },
    (form) => form.patch(route('admin.orders.update', props.order.id)),
);

const { form: noteForm, submit: submitNote } = useValidatedSubmit(
    { admin_note: props.order.admin_note ?? '' },
    {},
    (form) => form.patch(route('admin.orders.update', props.order.id)),
);

const {
    confirming: confirmingRefund,
    processing: refunding,
    confirm: confirmRefund,
    cancel: cancelRefund,
    run: refund,
} = useConfirmAction((_value, onFinish) => {
    router.post(
        route('admin.orders.refund', props.order.id),
        {},
        { preserveScroll: true, onFinish },
    );
});
</script>

<template>
    <AdminPageHeader
        :title="`${t('admin.orders.detail.pageTitle')} #${order.id}`"
    >
        <template #actions>
            <ButtonLink :href="route('admin.orders.index')">
                <IconLabel :icon="ArrowLeft">{{
                    t('admin.orders.detail.backToList')
                }}</IconLabel>
            </ButtonLink>
        </template>

        <ErrorBanner v-if="refundError">{{ refundError }}</ErrorBanner>

        <div class="space-y-6">
            <OrderSummaryCard
                namespace="admin.orders"
                :status="order.status"
                :payment-status="order.payment_status"
                :created-at="order.created_at"
                :order-items="order.order_items"
                :total="order.total"
            >
                <div class="mb-4">
                    <CustomerContact :user="order.user" />
                </div>
            </OrderSummaryCard>

            <OrderShippingAddressCard
                v-if="order.shipping_address_snapshot"
                namespace="admin.orders"
                :address="order.shipping_address_snapshot"
            />

            <OrderNoteCard
                v-if="order.customer_note"
                :heading="t('admin.orders.detail.customerNote')"
                :note="order.customer_note"
                :icon="MessageSquareText"
                icon-class="text-indigo-600 dark:text-indigo-400"
                :badge-label="t('admin.orders.detail.customerNoteBadge')"
                accent-class="border-s-4 border-s-indigo-400 dark:border-s-indigo-500"
            />

            <Card :class="cardPaddingClass">
                <SectionHeading
                    :heading="t('admin.orders.detail.updateStatus')"
                    spacing-class="mb-3"
                />
                <form
                    @submit.prevent="submitStatus"
                    class="flex flex-wrap items-end gap-4"
                >
                    <SelectField
                        v-model="statusForm.status"
                        :label="t('admin.orders.columns.status')"
                        :error="statusErrors.status ?? statusForm.errors.status"
                    >
                        <option :value="order.status">
                            {{ t(`admin.orders.statuses.${order.status}`) }}
                        </option>
                        <option
                            v-for="value in allowed_transitions"
                            :key="value"
                            :value="value"
                        >
                            {{ t(`admin.orders.statuses.${value}`) }}
                        </option>
                    </SelectField>
                    <PrimaryButton
                        type="submit"
                        :disabled="
                            statusForm.processing ||
                            allowed_transitions.length === 0
                        "
                    >
                        <IconLabel :icon="Save">{{
                            t('admin.orders.detail.save')
                        }}</IconLabel>
                    </PrimaryButton>
                </form>
            </Card>

            <Card :class="cardPaddingClass">
                <SectionHeading
                    :heading="t('admin.orders.detail.adminNote')"
                    :icon="Lock"
                    spacing-class="mb-3"
                >
                    <Badge variant="secondary">
                        {{ t('admin.orders.detail.adminNoteBadge') }}
                    </Badge>
                </SectionHeading>
                <form @submit.prevent="submitNote">
                    <TextareaField
                        v-model="noteForm.admin_note"
                        :label="t('admin.orders.detail.adminNote')"
                        :error="noteForm.errors.admin_note"
                        rows="4"
                    />
                    <FormActions class="mt-4">
                        <PrimaryButton
                            type="submit"
                            :disabled="noteForm.processing"
                        >
                            <IconLabel :icon="Save">{{
                                t('admin.orders.detail.save')
                            }}</IconLabel>
                        </PrimaryButton>
                    </FormActions>
                </form>
            </Card>

            <Card
                v-if="order.payment_status === 'paid'"
                :class="cardPaddingClass"
            >
                <SectionHeading
                    :heading="t('admin.orders.detail.refund')"
                    spacing-class="mb-3"
                />
                <PrimaryButton @click="confirmRefund()">
                    <IconLabel :icon="RotateCcw">{{
                        t('admin.orders.detail.refund')
                    }}</IconLabel>
                </PrimaryButton>
            </Card>
        </div>

        <ConfirmationDialog
            :show="confirmingRefund !== null"
            :title="t('admin.orders.detail.refundConfirmTitle')"
            :message="t('admin.orders.detail.refundConfirmMessage')"
            :confirm-label="t('admin.orders.detail.refund')"
            :processing="refunding"
            @confirm="refund"
            @cancel="cancelRefund"
        />
    </AdminPageHeader>
</template>
