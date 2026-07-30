import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ErrorBanner from '@/components/ErrorBanner.vue';

describe('ErrorBanner', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(ErrorBanner, {
            slots: { default: 'Something went wrong.' },
        });

        expect(wrapper.text()).toBe('Something went wrong.');
    });

    it('renders as a paragraph with the red error styling', () => {
        const wrapper = mount(ErrorBanner, {
            slots: { default: 'Error' },
        });

        expect(wrapper.element.tagName).toBe('P');
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining([
                'border-red-200',
                'bg-red-50',
                'text-red-600',
            ]),
        );
    });
});
