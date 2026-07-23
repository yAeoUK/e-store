import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
});

describe('ConfirmationDialog', () => {
    it('renders the title and message', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Delete address', message: 'Are you sure?' },
        });

        expect(wrapper.text()).toContain('Delete address');
        expect(wrapper.text()).toContain('Are you sure?');
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

        await wrapper.find('.bg-gray-500').trigger('click');

        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('disables the confirm button while processing', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm', danger: true, processing: true },
        });

        expect(wrapper.findComponent(DangerButton).attributes('disabled')).not.toBeUndefined();
    });

    it('leaves the cancel button enabled while processing', () => {
        const wrapper = mount(ConfirmationDialog, {
            props: { show: true, title: 'Confirm', processing: true },
        });

        expect(wrapper.findComponent(SecondaryButton).attributes('disabled')).toBeUndefined();
    });
});
