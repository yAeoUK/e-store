import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import AdminsCreatePage from '@/pages/Admin/Admins/Create.vue';
import { getMockForm, routeMock } from '../../../setup';
import { expectRendersPageTitle } from '../../../utils';

describe('Admin Admins create page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(AdminsCreatePage);

        expectRendersPageTitle(wrapper, 'admin.admins.addAdmin');
    });

    it('renders the promote-admin card copy', () => {
        const wrapper = mount(AdminsCreatePage);
        const text = wrapper.text();

        expect(text).toContain('admin.admins.promoteHeading');
        expect(text).toContain('admin.admins.promoteDescription');
        expect(text).toContain('admin.admins.promoteEmailLabel');
        expect(text).toContain('admin.admins.promoteSubmit');
    });

    it('renders the create-admin card copy', () => {
        const wrapper = mount(AdminsCreatePage);
        const text = wrapper.text();

        expect(text).toContain('admin.admins.createHeading');
        expect(text).toContain('admin.admins.createDescription');
        expect(text).toContain('admin.admins.createNameLabel');
        expect(text).toContain('admin.admins.createEmailLabel');
        expect(text).toContain('admin.admins.createPasswordLabel');
        expect(text).toContain('admin.admins.createPasswordConfirmationLabel');
        expect(text).toContain('admin.admins.createSubmit');
    });

    it('renders both cards inside the admin layout', () => {
        const wrapper = mount(AdminsCreatePage);

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findAllComponents({ name: 'Card' })).toHaveLength(2);
    });

    it('submits the promote form to admin.admins.promote', async () => {
        const wrapper = mount(AdminsCreatePage);

        await wrapper.find('input[type="email"]').setValue('user@example.com');
        await wrapper.findAll('form')[0].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.admins.promote');
    });

    it('submits the create-admin form to admin.admins.store', async () => {
        const wrapper = mount(AdminsCreatePage);

        const inputs = wrapper.findAll('input');
        const nameInput = inputs.find((i) => i.attributes('type') === 'text');
        const emailInputs = inputs.filter(
            (i) => i.attributes('type') === 'email',
        );
        const passwordInputs = inputs.filter(
            (i) => i.attributes('type') === 'password',
        );

        await nameInput?.setValue('New Admin');
        await emailInputs[emailInputs.length - 1].setValue(
            'new-admin@example.com',
        );
        await passwordInputs[0].setValue('password123');
        await passwordInputs[1].setValue('password123');
        await wrapper.findAll('form')[1].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.admins.store');
    });

    it('blocks the promote-admin submit when the email is empty', async () => {
        const wrapper = mount(AdminsCreatePage);

        await wrapper.findAll('form')[0].trigger('submit');

        expect(getMockForm(0).lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('blocks the promote-admin submit when the email format is invalid', async () => {
        const wrapper = mount(AdminsCreatePage);

        await wrapper.find('input[type="email"]').setValue('not-an-email');
        await wrapper.findAll('form')[0].trigger('submit');

        expect(getMockForm(0).lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.email');
    });

    it('blocks the create-admin submit when a required field is empty', async () => {
        const wrapper = mount(AdminsCreatePage);

        await wrapper.findAll('form')[1].trigger('submit');

        expect(getMockForm(1).lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.required');
    });

    it('renders a FormField for each input with the right labels and required flags', () => {
        const wrapper = mount(AdminsCreatePage);
        const fields = wrapper.findAllComponents(FormField);

        expect(fields).toHaveLength(5);
        expect(fields[0].props('label')).toBe('admin.admins.promoteEmailLabel');
        expect(fields[1].props('label')).toBe('admin.admins.createNameLabel');
        expect(fields[2].props('label')).toBe('admin.admins.createEmailLabel');
        expect(fields[3].props('label')).toBe(
            'admin.admins.createPasswordLabel',
        );
        expect(fields[4].props('label')).toBe(
            'admin.admins.createPasswordConfirmationLabel',
        );
        fields.forEach((field) => expect(field.props('required')).toBe(true));
    });

    it('passes validation errors through to each field', async () => {
        const wrapper = mount(AdminsCreatePage);

        getMockForm(0).errors = { email: 'Promote email error.' };
        getMockForm(1).errors = {
            name: 'Name error.',
            email: 'Email error.',
            password: 'Password error.',
            password_confirmation: 'Confirmation error.',
        };
        await wrapper.vm.$nextTick();

        const fields = wrapper.findAllComponents(FormField);
        expect(fields[0].props('error')).toBe('Promote email error.');
        expect(fields[1].props('error')).toBe('Name error.');
        expect(fields[2].props('error')).toBe('Email error.');
        expect(fields[3].props('error')).toBe('Password error.');
        expect(fields[4].props('error')).toBe('Confirmation error.');
    });

    it('blocks the create-admin submit when the passwords do not match', async () => {
        const wrapper = mount(AdminsCreatePage);

        const inputs = wrapper.findAll('input');
        const nameInput = inputs.find((i) => i.attributes('type') === 'text');
        const emailInputs = inputs.filter(
            (i) => i.attributes('type') === 'email',
        );
        const passwordInputs = inputs.filter(
            (i) => i.attributes('type') === 'password',
        );

        await nameInput?.setValue('New Admin');
        await emailInputs[emailInputs.length - 1].setValue(
            'new-admin@example.com',
        );
        await passwordInputs[0].setValue('password123');
        await passwordInputs[1].setValue('different123');
        await wrapper.findAll('form')[1].trigger('submit');

        expect(getMockForm(1).lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.confirmed');
    });
});
