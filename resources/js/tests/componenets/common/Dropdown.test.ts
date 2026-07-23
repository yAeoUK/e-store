import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Dropdown from '@/components/Dropdown.vue';

function mountDropdown(props = {}) {
    return mount(Dropdown, {
        props,
        slots: {
            content: '<div class="menu-item">Item</div>',
        },
    });
}

describe('Dropdown', () => {
    it('renders the trigger button and the content slot', () => {
        const wrapper = mountDropdown();

        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.find('.menu-item').exists()).toBe(true);
    });

    it('renders a down-arrow trigger icon', () => {
        const wrapper = mountDropdown();

        expect(wrapper.find('button svg').exists()).toBe(true);
    });

    it('is closed by default and opens when the trigger is clicked', async () => {
        const wrapper = mountDropdown();
        const content = wrapper.find('.menu-item').element.closest('[style]') as HTMLElement;

        expect(content.style.display).toBe('none');

        await wrapper.find('button').trigger('click');

        expect(content.style.display).not.toBe('none');
    });

    it('closes when clicking the full-screen overlay', async () => {
        const wrapper = mountDropdown();

        await wrapper.find('button').trigger('click');

        const overlay = wrapper.find('.fixed.inset-0.z-40');
        const content = wrapper.find('.menu-item').element.closest('[style]') as HTMLElement;

        await overlay.trigger('click');

        expect(content.style.display).toBe('none');
    });

    it('closes when clicking anywhere inside the content slot', async () => {
        const wrapper = mountDropdown();

        await wrapper.find('button').trigger('click');

        const content = wrapper.find('.menu-item').element.closest('[style]') as HTMLElement;

        await wrapper.find('.menu-item').trigger('click');

        expect(content.style.display).toBe('none');
    });

    it('closes on Escape when open, and is a no-op when already closed', async () => {
        const wrapper = mountDropdown();
        const content = wrapper.find('.menu-item').element.closest('[style]') as HTMLElement;

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();
        expect(content.style.display).toBe('none');

        await wrapper.find('button').trigger('click');
        expect(content.style.display).not.toBe('none');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();
        expect(content.style.display).toBe('none');

        wrapper.unmount();
    });

    it('defaults to the right alignment classes', () => {
        const wrapper = mountDropdown();

        expect(wrapper.find('.shadow-lg').classes().join(' ')).toContain('ltr:origin-top-right rtl:origin-top-left end-0');
    });

    it('applies the left alignment classes when align is left', () => {
        const wrapper = mountDropdown({ align: 'left' });

        expect(wrapper.find('.shadow-lg').classes().join(' ')).toContain('ltr:origin-top-left rtl:origin-top-right start-0');
    });

    it('falls back to a plain origin class for any other align value', () => {
        const wrapper = mountDropdown({ align: 'center' });

        expect(wrapper.find('.shadow-lg').classes()).toContain('origin-top');
    });

    it('renders the panel at a fixed w-48 width', () => {
        const wrapper = mountDropdown();

        expect(wrapper.find('.shadow-lg').classes()).toContain('w-48');
    });
});
