import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UpdatePasswordForm from '@/pages/Profile/Partials/UpdatePasswordForm.vue';
import { getMockForm, routeMock } from '../../../setup';

function passwordInputs(wrapper: ReturnType<typeof mount>) {
    return wrapper.findAll('input[type="password"]');
}

describe('UpdatePasswordForm', () => {
    it('renders the heading, description and field labels', () => {
        const wrapper = mount(UpdatePasswordForm);

        expect(wrapper.text()).toContain('profile.password.heading');
        expect(wrapper.text()).toContain('profile.password.description');
        expect(wrapper.text()).toContain('profile.password.currentPassword');
        expect(wrapper.text()).toContain('profile.password.newPassword');
        expect(wrapper.text()).toContain('profile.password.confirmPassword');
        expect(wrapper.text()).toContain('common.save');
    });

    it('shows the saved message after a successful submission', async () => {
        const wrapper = mount(UpdatePasswordForm);

        getMockForm().recentlySuccessful = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('common.saved');
    });

    it('binds the current password, new password and confirmation fields', async () => {
        const wrapper = mount(UpdatePasswordForm);
        const inputs = passwordInputs(wrapper);

        await inputs[0].setValue('old-secret');
        await inputs[1].setValue('new-secret');
        await inputs[2].setValue('new-secret');

        expect(getMockForm().current_password).toBe('old-secret');
        expect(getMockForm().password).toBe('new-secret');
        expect(getMockForm().password_confirmation).toBe('new-secret');
    });

    it('submits to the password update route', async () => {
        const wrapper = mount(UpdatePasswordForm);

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('password.update');
        expect(getMockForm().lastPostUrl).toBe('password.update');
    });

    it('resets all fields after a successful submission', async () => {
        const wrapper = mount(UpdatePasswordForm);
        const inputs = passwordInputs(wrapper);

        await inputs[0].setValue('old-secret');
        await inputs[1].setValue('new-secret');
        await inputs[2].setValue('new-secret');

        await wrapper.find('form').trigger('submit');

        expect(getMockForm().current_password).toBe('');
        expect(getMockForm().password).toBe('');
        expect(getMockForm().password_confirmation).toBe('');
    });

    it('resets the new-password fields on a password validation error', async () => {
        const wrapper = mount(UpdatePasswordForm);

        await wrapper.find('form').trigger('submit');

        getMockForm().password = 'new-secret';
        getMockForm().password_confirmation = 'new-secret';
        getMockForm().errors = { password: 'The password is too short.' };

        getMockForm().lastPostOptions?.onError?.();

        expect(getMockForm().password).toBe('');
        expect(getMockForm().password_confirmation).toBe('');
    });

    it('resets the current password field on a current_password validation error', async () => {
        const wrapper = mount(UpdatePasswordForm);

        await wrapper.find('form').trigger('submit');

        getMockForm().current_password = 'wrong-secret';
        getMockForm().errors = {
            current_password: 'The current password is incorrect.',
        };

        getMockForm().lastPostOptions?.onError?.();

        expect(getMockForm().current_password).toBe('');
    });

    it('renders validation errors from the form', async () => {
        const wrapper = mount(UpdatePasswordForm);

        getMockForm().errors = {
            password: 'The password is too short.',
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('The password is too short.');
    });
});
