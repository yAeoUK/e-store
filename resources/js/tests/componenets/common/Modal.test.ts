import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from '@/components/Modal.vue';

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
});

afterEach(() => {
    document.body.style.overflow = '';
    vi.useRealTimers();
});

describe('Modal', () => {
    it('renders slot content when shown initially', () => {
        const wrapper = mount(Modal, {
            props: { show: true },
            slots: { default: '<p>Modal content</p>' },
        });

        expect(wrapper.text()).toContain('Modal content');
    });

    it('does not render slot content when hidden initially', () => {
        const wrapper = mount(Modal, {
            props: { show: false },
            slots: { default: '<p>Modal content</p>' },
        });

        expect(wrapper.text()).not.toContain('Modal content');
    });

    it('shows the dialog and locks body scroll when show transitions to true', async () => {
        const wrapper = mount(Modal, {
            props: { show: false },
            slots: { default: '<p>Modal content</p>' },
        });

        await wrapper.setProps({ show: true });

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        expect(document.body.style.overflow).toBe('hidden');
        expect(wrapper.text()).toContain('Modal content');
    });

    it('closes the dialog 200ms after show transitions to false', async () => {
        vi.useFakeTimers();

        const wrapper = mount(Modal, {
            props: { show: true },
            slots: { default: '<p>Modal content</p>' },
        });

        await wrapper.setProps({ show: false });

        expect(document.body.style.overflow).toBe('');
        expect(wrapper.text()).toContain('Modal content');

        vi.advanceTimersByTime(200);
        await Promise.resolve();

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        expect(wrapper.text()).not.toContain('Modal content');
    });

    it('emits close when clicking the backdrop and closeable is true', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, closeable: true },
        });

        await wrapper.find('.bg-gray-500').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('does not emit close when clicking the backdrop and closeable is false', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, closeable: false },
        });

        await wrapper.find('.bg-gray-500').trigger('click');

        expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('emits close on Escape when shown', () => {
        const wrapper = mount(Modal, {
            props: { show: true },
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(wrapper.emitted('close')).toBeTruthy();
        wrapper.unmount();
    });

    it('does not emit close on Escape when hidden', () => {
        const wrapper = mount(Modal, {
            props: { show: false },
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(wrapper.emitted('close')).toBeFalsy();
        wrapper.unmount();
    });

    it.each([
        ['sm', 'sm:max-w-sm'],
        ['md', 'sm:max-w-md'],
        ['lg', 'sm:max-w-lg'],
        ['xl', 'sm:max-w-xl'],
        ['2xl', 'sm:max-w-2xl'],
    ] as const)('maps maxWidth=%s to the %s class', (maxWidth, expectedClass) => {
        const wrapper = mount(Modal, {
            props: { show: true, maxWidth },
        });

        expect(wrapper.find('.rounded-lg').classes()).toContain(expectedClass);
    });

    it('defaults to the 2xl width class when maxWidth is not provided', () => {
        const wrapper = mount(Modal, {
            props: { show: true },
        });

        expect(wrapper.find('.rounded-lg').classes()).toContain('sm:max-w-2xl');
    });
});
