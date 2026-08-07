import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AddressLines from '@/components/AddressLines.vue';
import { defaultAddressSnapshot } from '../../utils';

const address = defaultAddressSnapshot({ line2: 'Apt 4', state: 'IL' });

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

    it('renders the label as bold text when boldLabel is true', () => {
        const wrapper = mount(AddressLines, {
            props: { address, boldLabel: true },
        });

        const bold = wrapper.find('span.font-medium');
        expect(bold.exists()).toBe(true);
        expect(bold.text()).toContain('Home');
    });
});
