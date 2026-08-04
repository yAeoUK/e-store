import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AddressLines from '@/components/AddressLines.vue';

const address = {
    label: 'Home',
    name: 'Jane Doe',
    line1: '123 Main St',
    line2: 'Apt 4',
    city: 'Springfield',
    state: 'IL',
    postal_code: '62704',
    country: 'US',
    phone: null,
};

describe('AddressLines', () => {
    it('renders the label, lines, and city/state/postal by default', () => {
        const wrapper = mount(AddressLines, { props: { address } });

        expect(wrapper.text()).toContain('Home');
        expect(wrapper.text()).toContain('123 Main St');
        expect(wrapper.text()).toContain('Apt 4');
        expect(wrapper.text()).toContain('Springfield');
        expect(wrapper.text()).toContain('62704');
        expect(wrapper.text()).toContain('IL');
    });

    it('falls back to name when label is missing', () => {
        const wrapper = mount(AddressLines, {
            props: { address: { ...address, label: null } },
        });

        expect(wrapper.text()).toContain('Jane Doe');
    });

    it('does not render the country line by default', () => {
        const wrapper = mount(AddressLines, { props: { address } });

        expect(wrapper.text()).not.toContain('US');
    });

    it('renders the country line when showCountry is true', () => {
        const wrapper = mount(AddressLines, {
            props: { address, showCountry: true },
        });

        expect(wrapper.text()).toContain('US');
    });

    it('hides the label/name line when showLabel is false', () => {
        const wrapper = mount(AddressLines, {
            props: { address, showLabel: false },
        });

        expect(wrapper.text()).not.toContain('Home');
        expect(wrapper.text()).not.toContain('Jane Doe');
        expect(wrapper.text()).toContain('123 Main St');
    });
});
