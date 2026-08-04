import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import { Badge } from '@/components/ui/badge';

describe('PaymentStatusBadge', () => {
    it('renders the translated status using the given namespace', () => {
        const wrapper = mount(PaymentStatusBadge, {
            props: { status: 'paid', namespace: 'account.orders' },
        });

        expect(wrapper.text()).toBe('account.orders.paymentStatuses.paid');
    });

    it('uses the admin namespace when given', () => {
        const wrapper = mount(PaymentStatusBadge, {
            props: { status: 'unpaid', namespace: 'admin.orders' },
        });

        expect(wrapper.text()).toBe('admin.orders.paymentStatuses.unpaid');
    });

    it.each([
        ['unpaid', 'outline'],
        ['paid', 'default'],
        ['failed', 'destructive'],
        ['refunded', 'secondary'],
    ] as const)(
        'passes the %s status variant through to Badge',
        (status, variant) => {
            const wrapper = mount(PaymentStatusBadge, {
                props: { status, namespace: 'account.orders' },
            });

            expect(wrapper.findComponent(Badge).props('variant')).toBe(
                variant,
            );
        },
    );

    it('falls back to the outline variant for an unknown status', () => {
        const wrapper = mount(PaymentStatusBadge, {
            props: { status: 'unknown', namespace: 'account.orders' },
        });

        expect(wrapper.findComponent(Badge).props('variant')).toBe(
            'outline',
        );
    });
});
