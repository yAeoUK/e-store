import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InputLabel from '@/components/InputLabel.vue';

describe('InputLabel', () => {
    it('renders the value prop as label text', () => {
        const wrapper = mount(InputLabel, {
            props: { value: 'Email' },
            slots: { default: 'Fallback' },
        });

        expect(wrapper.text()).toBe('Email');
    });

    it('falls back to the default slot when no value is provided', () => {
        const wrapper = mount(InputLabel, {
            slots: { default: 'Fallback' },
        });

        expect(wrapper.text()).toBe('Fallback');
    });

    it('renders an asterisk marker when required is true', () => {
        const wrapper = mount(InputLabel, {
            props: { value: 'Email', required: true },
        });

        // The marker is CSS ::after content, not a DOM text node (see the
        // component comment - it must not leak into the label's accessible
        // name), so it's asserted via the marker class, not wrapper.text().
        expect(wrapper.text()).toBe('Email');
        expect(wrapper.classes()).toContain("after:content-['*']");
    });

    it('does not render an asterisk marker when required is false', () => {
        const wrapper = mount(InputLabel, {
            props: { value: 'Email', required: false },
        });

        expect(wrapper.text()).toBe('Email');
        expect(wrapper.classes()).not.toContain("after:content-['*']");
    });

    it('does not render an asterisk marker when required is omitted', () => {
        const wrapper = mount(InputLabel, {
            props: { value: 'Email' },
        });

        expect(wrapper.text()).toBe('Email');
        expect(wrapper.classes()).not.toContain("after:content-['*']");
    });
});
