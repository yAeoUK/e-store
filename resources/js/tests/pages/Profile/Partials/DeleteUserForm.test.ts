import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteUserForm from '@/pages/Profile/Partials/DeleteUserForm.vue';
import { getMockForm, routeMock } from '../../../setup';

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
});

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

describe('DeleteUserForm', () => {
    it('does not show the confirmation modal initially', () => {
        const wrapper = mount(DeleteUserForm);

        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
    });

    it('renders the delete-account description', () => {
        const wrapper = mount(DeleteUserForm);

        expect(wrapper.text()).toContain('profile.deleteAccount.description');
    });

    it('opens the confirmation modal when the delete button is clicked', async () => {
        const wrapper = mount(DeleteUserForm);

        await findButton(wrapper, 'profile.deleteAccount.heading')?.trigger(
            'click',
        );

        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            true,
        );
    });

    it('renders the confirmation title, description and password field label in the modal', async () => {
        const wrapper = mount(DeleteUserForm);

        await findButton(wrapper, 'profile.deleteAccount.heading')?.trigger(
            'click',
        );

        expect(wrapper.text()).toContain('profile.deleteAccount.confirmTitle');
        expect(wrapper.text()).toContain(
            'profile.deleteAccount.confirmDescription',
        );
        expect(wrapper.text()).toContain(
            'profile.deleteAccount.passwordPlaceholder',
        );
    });

    it('submits the password to the destroy route and closes the modal on success', async () => {
        const wrapper = mount(DeleteUserForm);

        await findButton(wrapper, 'profile.deleteAccount.heading')?.trigger(
            'click',
        );
        await wrapper.find('input[type="password"]').setValue('secret');

        const modal = wrapper.findComponent({ name: 'Modal' });
        const confirmButton = modal
            .findAll('button')
            .find(
                (button) => button.text() === 'profile.deleteAccount.heading',
            );
        await confirmButton?.trigger('click');

        expect(routeMock).toHaveBeenCalledWith('profile.destroy');
        expect(getMockForm().lastPostUrl).toBe('profile.destroy');
        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
    });

    it('closes the modal and clears the password field when cancelled', async () => {
        const wrapper = mount(DeleteUserForm);

        await findButton(wrapper, 'profile.deleteAccount.heading')?.trigger(
            'click',
        );
        await wrapper.find('input[type="password"]').setValue('secret');

        await findButton(wrapper, 'common.cancel')?.trigger('click');

        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
        expect(
            (wrapper.find('input[type="password"]').element as HTMLInputElement)
                .value,
        ).toBe('');
    });
});
