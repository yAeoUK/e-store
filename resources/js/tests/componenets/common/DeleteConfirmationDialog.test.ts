import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

describe('DeleteConfirmationDialog', () => {
    it('forwards show, title, message and processing to the underlying ConfirmationDialog', () => {
        const wrapper = mount(DeleteConfirmationDialog, {
            props: {
                show: true,
                title: 'Delete address',
                message: 'Are you sure?',
                processing: true,
            },
        });

        const dialog = wrapper.findComponent(ConfirmationDialog);
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('title')).toBe('Delete address');
        expect(dialog.props('message')).toBe('Are you sure?');
        expect(dialog.props('processing')).toBe(true);
    });

    it('always sets danger and the confirm label to common.delete on the underlying ConfirmationDialog', () => {
        const wrapper = mount(DeleteConfirmationDialog, {
            props: {
                show: true,
                title: 'Delete address',
                message: '',
                processing: false,
            },
        });

        const dialog = wrapper.findComponent(ConfirmationDialog);
        expect(dialog.props('danger')).toBe(true);
        expect(dialog.props('confirmLabel')).toBe('common.delete');
    });

    it('emits confirm when the underlying ConfirmationDialog emits confirm', async () => {
        const wrapper = mount(DeleteConfirmationDialog, {
            props: {
                show: true,
                title: 'Delete address',
                message: '',
                processing: false,
            },
        });

        await wrapper.findComponent(ConfirmationDialog).vm.$emit('confirm');

        expect(wrapper.emitted('confirm')).toBeTruthy();
    });

    it('emits cancel when the underlying ConfirmationDialog emits cancel', async () => {
        const wrapper = mount(DeleteConfirmationDialog, {
            props: {
                show: true,
                title: 'Delete address',
                message: '',
                processing: false,
            },
        });

        await wrapper.findComponent(ConfirmationDialog).vm.$emit('cancel');

        expect(wrapper.emitted('cancel')).toBeTruthy();
    });
});
