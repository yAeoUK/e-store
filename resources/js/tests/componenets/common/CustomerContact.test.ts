import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CustomerContact from '@/components/CustomerContact.vue';

describe('CustomerContact', () => {
    it('renders the customer name and email when present', () => {
        const wrapper = mount(CustomerContact, {
            props: { user: { name: 'Jane Doe', email: 'jane@example.com' } },
        });

        expect(wrapper.text()).toBe('Jane Doe (jane@example.com)');
    });

    it('falls back to a dash when there is no customer', () => {
        const wrapper = mount(CustomerContact, {
            props: { user: null },
        });

        expect(wrapper.text()).toBe('—');
    });
});
