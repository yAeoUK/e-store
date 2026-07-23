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
});
