import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Addresses from '@/pages/Account/Addresses.vue';
import { routeMock } from '../../setup';

let meta: HTMLMetaElement;

beforeEach(() => {
    routeMock.mockClear();
    meta = document.createElement('meta');
    meta.setAttribute('name', 'csrf-token');
    meta.setAttribute('content', 'test-token');
    document.head.appendChild(meta);
});

afterEach(() => {
    meta.remove();
});

describe('Addresses page', () => {
    it('shows the empty state when there are no addresses', () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        expect(wrapper.text()).toContain('account.addresses.empty');
        expect(wrapper.findAll('li')).toHaveLength(0);
    });

    it('renders one row per address', () => {
        const wrapper = mount(Addresses, {
            props: {
                addresses: [
                    { id: 1, label: 'Home', name: 'Jane Doe', line1: '123 Main St', line2: '', city: 'Springfield', postal_code: '62704', state: 'IL' },
                ],
            },
        });

        const rows = wrapper.findAll('li');

        expect(rows).toHaveLength(1);
        expect(rows[0].text()).toContain('Home');
        expect(rows[0].text()).toContain('123 Main St');
        expect(rows[0].text()).toContain('Springfield');
    });

    it('includes the CSRF token in the per-address delete form', () => {
        const wrapper = mount(Addresses, {
            props: {
                addresses: [{ id: 1, label: 'Home', name: 'Jane Doe', line1: '123 Main St', city: 'Springfield', postal_code: '62704' }],
            },
        });

        const tokenInput = wrapper.find('input[name="_token"]');

        expect((tokenInput.element as HTMLInputElement).value).toBe('test-token');
    });

    it('submits the new address form to the account.addresses.store route', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        const textInputs = wrapper.findAllComponents({ name: 'TextInput' });
        await textInputs[2].get('input').setValue('123 Main St');
        await textInputs[3].get('input').setValue('');
        await textInputs[4].get('input').setValue('Springfield');
        await textInputs[6].get('input').setValue('62704');

        await wrapper.findAll('form')[0].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('account.addresses.store');
    });

    it('toggles the is_default checkbox', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        const checkbox = wrapper.findComponent({ name: 'Checkbox' });

        expect(checkbox.props('checked')).toBe(false);

        await checkbox.get('input').setValue(true);

        expect(wrapper.findComponent({ name: 'Checkbox' }).props('checked')).toBe(true);
    });
});
