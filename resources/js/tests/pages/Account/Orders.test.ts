import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Orders from '@/pages/Account/Orders.vue';

describe('Orders page', () => {
    it('mounts and renders the placeholder text', () => {
        const wrapper = mount(Orders);

        expect(wrapper.text()).toContain('account.orders.placeholder');
    });

    it('renders the page title via Head', () => {
        const wrapper = mount(Orders);
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('account.orders.pageTitle');
    });
});
