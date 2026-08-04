import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OrderStatusBadge from '@/components/OrderStatusBadge.vue';
import { Badge } from '@/components/ui/badge';

describe('OrderStatusBadge', () => {
    it('renders the translated status using the given namespace', () => {
        const wrapper = mount(OrderStatusBadge, {
            props: { status: 'completed', namespace: 'account.orders' },
        });

        expect(wrapper.text()).toBe('account.orders.statuses.completed');
    });

    it('uses the admin namespace when given', () => {
        const wrapper = mount(OrderStatusBadge, {
            props: { status: 'pending', namespace: 'admin.orders' },
        });

        expect(wrapper.text()).toBe('admin.orders.statuses.pending');
    });

    it.each([
        ['pending', 'outline'],
        ['processing', 'secondary'],
        ['completed', 'default'],
        ['cancelled', 'destructive'],
    ] as const)(
        'passes the %s status variant through to Badge',
        (status, variant) => {
            const wrapper = mount(OrderStatusBadge, {
                props: { status, namespace: 'account.orders' },
            });

            expect(wrapper.findComponent(Badge).props('variant')).toBe(
                variant,
            );
        },
    );

    it('falls back to the outline variant for an unknown status', () => {
        const wrapper = mount(OrderStatusBadge, {
            props: { status: 'unknown', namespace: 'account.orders' },
        });

        expect(wrapper.findComponent(Badge).props('variant')).toBe(
            'outline',
        );
    });
});
