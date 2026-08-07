import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import Modal from '@/components/Modal.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

describe('ConfirmationDialog', () => {
    it('renders the title and message', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: {
                show: true,
                title: 'Delete address',
                message: 'Are you sure?',
            },
        });

        expect(wrapper.text()).toContain('Delete address');
        expect(wrapper.text()).toContain('Are you sure?');
    });

    it('forwards its show prop to the underlying Modal', () => {
        const shown = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm' },
        });
        expect(shown.findComponent(Modal).props('show')).toBe(true);

        const hidden = mount(ConfirmationDialog, {
            props: { show: false, title: 'Confirm' },
        });
        expect(hidden.findComponent(Modal).props('show')).toBe(false);
    });

    it('defaults the confirm and cancel button labels to common.confirm/cancel', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm' },
        });

        expect(wrapper.findComponent(PrimaryButton).text()).toBe(
            'common.confirm',
        );
        expect(wrapper.findComponent(SecondaryButton).text()).toBe(
            'common.cancel',
        );
    });

    it('renders custom confirm and cancel button labels when provided', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: {
                show: true,
                title: 'Confirm',
                confirmLabel: 'Yes, delete it',
                cancelLabel: 'No, keep it',
            },
        });

        expect(wrapper.findComponent(PrimaryButton).text()).toBe(
            'Yes, delete it',
        );
        expect(wrapper.findComponent(SecondaryButton).text()).toBe(
            'No, keep it',
        );
    });

    it('does not render a message when none is provided', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Delete address' },
        });

        expect(wrapper.findComponent(MutedText).exists()).toBe(false);
    });

    it('renders a PrimaryButton for confirm when danger is false', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm', danger: false },
        });

        expect(wrapper.findComponent(PrimaryButton).exists()).toBe(true);
        expect(wrapper.findComponent(DangerButton).exists()).toBe(false);
    });

    it('renders a DangerButton for confirm when danger is true', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm', danger: true },
        });

        expect(wrapper.findComponent(DangerButton).exists()).toBe(true);
        expect(wrapper.findComponent(PrimaryButton).exists()).toBe(false);
    });

    it('emits confirm when the confirm button is clicked', async () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm' },
        });

        await wrapper.findComponent(PrimaryButton).trigger('click');

        expect(wrapper.emitted('confirm')).toBeTruthy();
    });

    it('emits cancel when the cancel button is clicked', async () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm' },
        });

        await wrapper.findComponent(SecondaryButton).trigger('click');

        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('emits cancel when the underlying modal closes', async () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm' },
        });

        await wrapper.find('.bg-slate-500').trigger('click');

        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('disables the confirm button while processing', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: {
                show: true,
                title: 'Confirm',
                danger: true,
                processing: true,
            },
        });

        expect(
            wrapper.findComponent(DangerButton).attributes('disabled'),
        ).not.toBeUndefined();
    });

    it('leaves the cancel button enabled while processing', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm', processing: true },
        });

        expect(
            wrapper.findComponent(SecondaryButton).attributes('disabled'),
        ).toBeUndefined();
    });
});
