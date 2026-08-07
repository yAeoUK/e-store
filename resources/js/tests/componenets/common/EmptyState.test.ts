import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { markRaw } from 'vue';
import EmptyState from '@/components/EmptyState.vue';

const StubIcon = markRaw({
    name: 'StubIcon',
    template: '<svg data-testid="icon" />',
});

describe('EmptyState', () => {
    it('renders the provided icon', () => {
        const wrapper = mount(EmptyState, {
            props: { icon: StubIcon },
        });

        const icon = wrapper.find('[data-testid="icon"]');
        expect(icon.exists()).toBe(true);
        expect(icon.classes()).toEqual(expect.arrayContaining(['h-8', 'w-8']));
    });

    it('renders the default slot content after the icon', () => {
        const wrapper = mount(EmptyState, {
            props: { icon: StubIcon },
            slots: { default: 'No results found' },
        });

        expect(wrapper.text()).toBe('No results found');
        const html = wrapper.html();
        expect(html.indexOf('data-testid="icon"')).toBeLessThan(
            html.indexOf('No results found'),
        );
    });
});
