import { describe } from 'vitest';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import { testStatusBadgeWrapperContract } from '../../utils';

describe('OrderStatusBadge', () => {
    testStatusBadgeWrapperContract(OrderStatusBadge, {
        statusesKey: 'statuses',
        status: 'pending',
        variants: {
            pending: 'outline',
            processing: 'secondary',
            completed: 'default',
            cancelled: 'destructive',
        },
    });
});
