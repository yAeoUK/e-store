import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ButtonLink from '@/components/ButtonLink.vue';
import CancelButton from '@/components/CancelButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

describe('CancelButton', () => {
    it('renders a SecondaryButton with the default label when no href is given', () => {
        const wrapper = mount(CancelButton);

        expect(wrapper.findComponent(SecondaryButton).exists()).toBe(true);
        expect(wrapper.findComponent(ButtonLink).exists()).toBe(false);
        expect(wrapper.text()).toBe('common.cancel');
    });

    it('renders a ButtonLink with the given href when href is provided', () => {
        const wrapper = mount(CancelButton, {
            props: { href: '/admin/products' },
        });

        const link = wrapper.findComponent(ButtonLink);
        expect(link.exists()).toBe(true);
        expect(link.props('href')).toBe('/admin/products');
        expect(wrapper.findComponent(SecondaryButton).exists()).toBe(false);
        expect(wrapper.text()).toBe('common.cancel');
    });

    it('defaults the SecondaryButton type to button', () => {
        const wrapper = mount(CancelButton);

        expect(wrapper.findComponent(SecondaryButton).props('type')).toBe(
            'button',
        );
    });

    it('renders custom slot content instead of the default label', () => {
        const wrapper = mount(CancelButton, {
            slots: { default: 'Discard changes' },
        });

        expect(wrapper.text()).toContain('Discard changes');
        expect(wrapper.text()).not.toContain('common.cancel');
    });

    it('renders custom slot content when href is provided', () => {
        const wrapper = mount(CancelButton, {
            props: { href: '/admin/products' },
            slots: { default: 'Discard changes' },
        });

        expect(wrapper.text()).toContain('Discard changes');
    });
});
