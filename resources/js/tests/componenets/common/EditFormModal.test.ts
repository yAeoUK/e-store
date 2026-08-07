import { Pencil } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CancelButton from '@/components/CancelButton.vue';
import EditFormModal from '@/components/EditFormModal.vue';
import Modal from '@/components/Modal.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { testEmitsSubmitOnFormSubmit } from '../../utils';

describe('EditFormModal', () => {
    it('forwards its show prop to the underlying Modal', () => {
        const shown = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        });
        expect(shown.findComponent(Modal).props('show')).toBe(true);

        const hidden = mount(EditFormModal, {
            props: {
                show: false,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        });
        expect(hidden.findComponent(Modal).props('show')).toBe(false);
    });

    it('renders the title without an icon when none is provided', () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        });

        expect(wrapper.text()).toContain('Edit address');
        expect(wrapper.find('h3').classes()).toContain('mb-4');
        expect(wrapper.find('.mb-4.flex').exists()).toBe(false);
    });

    it('renders the icon next to the title when provided', () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
                icon: Pencil,
            },
        });

        expect(wrapper.text()).toContain('Edit address');
        expect(wrapper.find('.mb-4.flex svg').exists()).toBe(true);
    });

    it('renders the slot content inside the form', () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
            slots: { default: '<input data-testid="field" />' },
        });

        expect(wrapper.find('form [data-testid="field"]').exists()).toBe(true);
    });

    it('renders the save label on the primary button', () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save changes',
            },
        });

        expect(wrapper.findComponent(PrimaryButton).text()).toBe(
            'Save changes',
        );
    });

    it('disables the primary button while processing', () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: true,
                saveLabel: 'Save',
            },
        });

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });

    testEmitsSubmitOnFormSubmit(() =>
        mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        }),
    );

    it('emits close when the cancel button is clicked', async () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        });

        await wrapper.findComponent(CancelButton).trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close when the underlying modal closes', async () => {
        const wrapper = mount(EditFormModal, {
            props: {
                show: true,
                title: 'Edit address',
                processing: false,
                saveLabel: 'Save',
            },
        });

        await wrapper.find('.bg-slate-500').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });
});
