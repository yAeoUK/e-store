import { Head, router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PrimaryButton from '@/components/PrimaryButton.vue';
import Addresses from '@/pages/Account/Addresses.vue';
import AddressFormFields from '@/pages/Account/Partials/AddressFormFields.vue';
import { getMockForm, routeMock } from '../../setup';

const address = {
    id: 1,
    label: 'Home',
    name: 'Jane Doe',
    line1: '123 Main St',
    line2: null,
    city: 'Springfield',
    state: null,
    postal_code: '62704',
    country: 'US',
    phone: null,
    is_default: false,
};

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.delete).mockClear();
    vi.mocked(router.post).mockClear();
});

describe('Addresses page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });
        const head = wrapper.findComponent(Head);

        expect(head.exists()).toBe(true);
        expect(head.attributes('title')).toBe('account.addresses.pageTitle');
    });

    it('shows the empty state when there are no addresses', () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        expect(wrapper.text()).toContain('account.addresses.empty');
        expect(wrapper.findAll('li')).toHaveLength(0);
    });

    it('renders one row per address', () => {
        const wrapper = mount(Addresses, {
            props: {
                addresses: [
                    {
                        id: 1,
                        label: 'Home',
                        name: 'Jane Doe',
                        line1: '123 Main St',
                        line2: '',
                        city: 'Springfield',
                        postal_code: '62704',
                        state: 'IL',
                        country: 'US',
                        phone: null,
                        is_default: false,
                    },
                ],
            },
        });

        const rows = wrapper.findAll('li');

        expect(rows).toHaveLength(1);
        expect(rows[0].text()).toContain('Home');
        expect(rows[0].text()).toContain('123 Main St');
        expect(rows[0].text()).toContain('Springfield');
    });

    it('opens the delete confirmation dialog when delete is clicked', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(false);

        await findButton(wrapper, 'common.delete')?.trigger('click');

        const openDialog = wrapper.findComponent({
            name: 'ConfirmationDialog',
        });
        expect(openDialog.props('show')).toBe(true);
        expect(openDialog.props('title')).toBe(
            'account.addresses.deleteConfirmTitle',
        );
        expect(openDialog.props('message')).toBe(
            'account.addresses.deleteConfirmMessage',
        );
        expect(openDialog.props('confirmLabel')).toBe('common.delete');
        expect(openDialog.props('danger')).toBe(true);
        expect(openDialog.props('processing')).toBe(false);
    });

    it('deletes the address via the destroy route when confirmed', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'common.delete')?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith(
            'account.addresses.destroy',
            address.id,
        );
        expect(vi.mocked(router.delete)).toHaveBeenCalledWith(
            'account.addresses.destroy',
            expect.objectContaining({ onFinish: expect.any(Function) }),
        );
        expect(
            wrapper
                .findComponent({ name: 'ConfirmationDialog' })
                .props('processing'),
        ).toBe(true);

        const onFinish = vi.mocked(router.delete).mock.calls[0][1]?.onFinish;
        onFinish?.({} as Parameters<NonNullable<typeof onFinish>>[0]);
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        expect(
            wrapper
                .findComponent({ name: 'ConfirmationDialog' })
                .props('processing'),
        ).toBe(false);
    });

    it('does not delete the address when the dialog is cancelled', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'common.delete')?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('cancel');

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        expect(router.delete).not.toHaveBeenCalled();
    });

    it('shows a set-default button for a non-default address and calls the setDefault route when clicked', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        const setDefaultButton = findButton(
            wrapper,
            'account.addresses.setDefault',
        );
        expect(setDefaultButton).toBeDefined();

        await setDefaultButton?.trigger('click');

        expect(routeMock).toHaveBeenCalledWith(
            'account.addresses.setDefault',
            address.id,
        );
        expect(vi.mocked(router.post)).toHaveBeenCalledWith(
            'account.addresses.setDefault',
            {},
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    it('shows a default label and no set-default button for the default address', () => {
        const wrapper = mount(Addresses, {
            props: { addresses: [{ ...address, is_default: true }] },
        });

        expect(wrapper.text()).toContain('account.addresses.defaultLabel');
        expect(
            findButton(wrapper, 'account.addresses.setDefault'),
        ).toBeUndefined();
    });

    it('opens the edit modal pre-filled with the address values', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'account.addresses.edit')?.trigger('click');

        const modal = wrapper.findComponent({ name: 'Modal' });
        expect(modal.props('show')).toBe(true);

        const editFields = modal.findComponent(AddressFormFields);
        expect(editFields.props('label')).toBe(address.label);
        expect(editFields.props('name')).toBe(address.name);
        expect(editFields.props('line1')).toBe(address.line1);
        expect(editFields.props('city')).toBe(address.city);
        expect(editFields.props('postal_code')).toBe(address.postal_code);
        expect(editFields.props('country')).toBe(address.country);
        expect(editFields.props('is_default')).toBe(address.is_default);
        expect(editFields.props('errors')).toEqual({});

        expect(
            modal.findComponent(PrimaryButton).attributes('disabled'),
        ).toBeUndefined();
    });

    it('submits changes to the update route and closes the modal on success', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'account.addresses.edit')?.trigger('click');
        await wrapper
            .findComponent({ name: 'Modal' })
            .find('form')
            .trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(
            'account.addresses.update',
            address.id,
        );
        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
    });

    it('closes the edit modal without submitting when cancelled', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'account.addresses.edit')?.trigger('click');
        await findButton(wrapper, 'common.cancel')?.trigger('click');

        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
        expect(routeMock).not.toHaveBeenCalledWith(
            'account.addresses.update',
            address.id,
        );
    });

    it('submits the new address form to the account.addresses.store route', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        expect(
            wrapper.findComponent(AddressFormFields).props('errors'),
        ).toEqual({});
        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).toBeUndefined();

        const textInputs = wrapper.findAll('input');
        await textInputs[2].setValue('123 Main St');
        await textInputs[3].setValue('');
        await textInputs[4].setValue('Springfield');
        await textInputs[6].setValue('62704');

        await wrapper.findAll('form')[0].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('account.addresses.store');
    });

    it('clears the new address form after a successful submission', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        const textInputs = wrapper.findAll('input');
        await textInputs[2].setValue('123 Main St');
        await textInputs[4].setValue('Springfield');
        await textInputs[6].setValue('62704');

        await wrapper.findAll('form')[0].trigger('submit');
        await wrapper.vm.$nextTick();

        const clearedInputs = wrapper.findAll('input');
        expect((clearedInputs[2].element as HTMLInputElement).value).toBe('');
        expect((clearedInputs[4].element as HTMLInputElement).value).toBe('');
        expect((clearedInputs[6].element as HTMLInputElement).value).toBe('');
    });

    it('passes validation errors through to the new address form fields', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        const errors = {
            line1: 'The line1 field is required.',
            city: 'The city field is required.',
            postal_code: 'The postal code field is required.',
        };
        getMockForm().errors = errors;
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent(AddressFormFields).props('errors'),
        ).toEqual(errors);
        expect(wrapper.text()).toContain('The line1 field is required.');
    });

    it('renders both address Cards and the ShopLayout', () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        expect(wrapper.findAllComponents({ name: 'Card' })).toHaveLength(2);
        expect(wrapper.findComponent({ name: 'ShopLayout' }).exists()).toBe(
            true,
        );
    });

    it('renders the add-address heading and submit button text', () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        expect(wrapper.text()).toContain('account.addresses.addHeading');
        expect(wrapper.text()).toContain('account.addresses.submit');
    });

    it('renders the edit modal heading and save-changes button text', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [address] } });

        await findButton(wrapper, 'account.addresses.edit')?.trigger('click');

        const modal = wrapper.findComponent({ name: 'Modal' });
        expect(modal.text()).toContain('account.addresses.editHeading');
        expect(modal.text()).toContain('account.addresses.saveChanges');
    });

    it('toggles the is_default checkbox', async () => {
        const wrapper = mount(Addresses, { props: { addresses: [] } });

        const checkbox = wrapper.findComponent({ name: 'Checkbox' });

        expect(checkbox.props('checked')).toBe(false);

        await checkbox.get('input').setValue(true);

        expect(
            wrapper.findComponent({ name: 'Checkbox' }).props('checked'),
        ).toBe(true);
    });
});
