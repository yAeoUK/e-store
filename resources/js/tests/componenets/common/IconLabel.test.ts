import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { markRaw } from 'vue';
import IconLabel from '@/components/IconLabel.vue';

const StubIcon = markRaw({
    name: 'StubIcon',
    template: '<svg data-testid="icon" />',
});

describe('IconLabel', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(IconLabel, {
            slots: { default: 'Save' },
        });

        expect(wrapper.text()).toBe('Save');
    });

    it('does not render an icon when none is provided', () => {
        const wrapper = mount(IconLabel, {
            slots: { default: 'Save' },
        });

        expect(wrapper.findComponent(StubIcon).exists()).toBe(false);
        expect(wrapper.find('[data-testid="icon"]').exists()).toBe(false);
    });

    it('renders the icon before the slot content by default', () => {
        const wrapper = mount(IconLabel, {
            props: { icon: StubIcon },
            slots: { default: 'Save' },
        });

        const html = wrapper.html();
        expect(html.indexOf('data-testid="icon"')).toBeLessThan(
            html.indexOf('Save'),
        );
        expect(wrapper.find('[data-testid="icon"]').classes()).toEqual(
            expect.arrayContaining(['h-4', 'w-4']),
        );
    });

    it('renders the icon after the slot content when trailing is true', () => {
        const wrapper = mount(IconLabel, {
            props: { icon: StubIcon, trailing: true },
            slots: { default: 'Save' },
        });

        const html = wrapper.html();
        expect(html.indexOf('Save')).toBeLessThan(
            html.indexOf('data-testid="icon"'),
        );
    });
});
