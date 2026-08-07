import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AddressLines from '@/components/AddressLines.vue';
import OrderShippingAddressCard from '@/components/OrderShippingAddressCard.vue';
import { defaultAddressSnapshot } from '../../utils';

const address = defaultAddressSnapshot();

describe('OrderShippingAddressCard', () => {
    it('builds the heading translation key from the namespace', () => {
        const wrapper = mount(OrderShippingAddressCard, {
            props: { namespace: 'account.orders', address },
        });

        expect(wrapper.text()).toContain(
            'account.orders.detail.shippingAddress',
        );
    });

    it('uses the admin.orders namespace when given', () => {
        const wrapper = mount(OrderShippingAddressCard, {
            props: { namespace: 'admin.orders', address },
        });

        expect(wrapper.text()).toContain('admin.orders.detail.shippingAddress');
    });

    it('passes the address to AddressLines with the country shown', () => {
        const wrapper = mount(OrderShippingAddressCard, {
            props: { namespace: 'account.orders', address },
        });

        const addressLines = wrapper.findComponent(AddressLines);
        expect(addressLines.props('address')).toEqual(address);
        expect(addressLines.props('showCountry')).toBe(true);
    });
});
