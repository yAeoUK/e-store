import { Head } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import AdminsCreatePage from '@/pages/Admin/Admins/Create.vue';
import { routeMock } from '../../../setup';

beforeEach(() => {
    routeMock.mockClear();
});

describe('Admin Admins create page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(AdminsCreatePage);

        expect(wrapper.findComponent(Head).attributes('title')).toBe(
            'admin.admins.addAdmin',
        );
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
        const passwordInputs = inputs.filter(
            (i) => i.attributes('type') === 'password',
        );

        await nameInput?.setValue('New Admin');
        await passwordInputs[0].setValue('password123');
        await passwordInputs[1].setValue('password123');
        await wrapper.findAll('form')[1].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith('admin.admins.store');
    });
});
