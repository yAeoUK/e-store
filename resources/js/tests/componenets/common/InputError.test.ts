import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InputError from '@/components/InputError.vue';

describe('InputError', () => {
    it('renders the message when provided', () => {
        const wrapper = mount(InputError, {
            props: { message: 'This field is required.' },
        });

        expect(wrapper.text()).toContain('This field is required.');
        expect(wrapper.isVisible()).toBe(true);
    });

    it('is hidden when no message is provided', () => {
        const wrapper = mount(InputError, {
            props: {},
        });

        expect(wrapper.isVisible()).toBe(false);
    });
});
