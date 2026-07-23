import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Orders from '@/pages/Account/Orders.vue';

describe('Orders page', () => {
    it('mounts and renders the placeholder text', () => {
        const wrapper = mount(Orders);

        expect(wrapper.text()).toContain('account.orders.placeholder');
    });
});
