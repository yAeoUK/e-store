import { describe } from 'vitest';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import { testStatusBadgeWrapperContract } from '../../utils';

describe('PaymentStatusBadge', () => {
    testStatusBadgeWrapperContract(PaymentStatusBadge, {
        statusesKey: 'paymentStatuses',
        status: 'paid',
        variants: {
            unpaid: 'outline',
            paid: 'default',
            failed: 'destructive',
            refunded: 'secondary',
        },
    });
});
