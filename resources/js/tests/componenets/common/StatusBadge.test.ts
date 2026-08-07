import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StatusBadge from '@/components/StatusBadge.vue';
import { Badge } from '@/components/ui/badge';

describe('StatusBadge', () => {
    const variants = {
        pending: 'outline',
        paid: 'default',
    } as const;

    it('renders the translated status using the translation key and status', () => {
        const wrapper = mount(StatusBadge, {
            props: {
                status: 'paid',
                variants,
                translationKey: 'admin.orders.paymentStatuses',
            },
        });

        expect(wrapper.text()).toBe('admin.orders.paymentStatuses.paid');
    });

    it('passes the variant matching the status through to Badge', () => {
        const wrapper = mount(StatusBadge, {
            props: { status: 'paid', variants, translationKey: 'orders' },
        });

        expect(wrapper.findComponent(Badge).props('variant')).toBe('default');
    });

    it('falls back to the outline variant for a status missing from the map', () => {
        const wrapper = mount(StatusBadge, {
            props: { status: 'unknown', variants, translationKey: 'orders' },
        });

        expect(wrapper.findComponent(Badge).props('variant')).toBe('outline');
    });
});
