import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useChartColor } from '@/composables/useChartColor';

function mountWithColor(cssVariable: string, fallback: string) {
    const Host = defineComponent({
        setup() {
            const color = useChartColor(cssVariable, fallback);

            return { color };
        },
        template: '<div>{{ color }}</div>',
    });

    return mount(Host);
}

describe('useChartColor', () => {
    const originalGetComputedStyle = globalThis.getComputedStyle;

    afterEach(() => {
        globalThis.getComputedStyle = originalGetComputedStyle;
    });

    it('falls back to the given color when the CSS variable is not set', () => {
        const wrapper = mountWithColor('--color-chart-1', 'rgb(1, 2, 3)');

        expect(wrapper.text()).toBe('rgb(1, 2, 3)');
    });

    it('adopts the CSS custom property value once mounted', async () => {
        globalThis.getComputedStyle = vi.fn().mockReturnValue({
            getPropertyValue: (name: string) =>
                name === '--color-chart-2' ? 'rgb(9, 9, 9)' : '',
        } as unknown as CSSStyleDeclaration);

        const wrapper = mountWithColor('--color-chart-2', 'rgb(1, 2, 3)');
        await flushPromises();

        expect(wrapper.text()).toBe('rgb(9, 9, 9)');
    });

    it('ignores a blank CSS custom property and keeps the fallback', () => {
        globalThis.getComputedStyle = vi.fn().mockReturnValue({
            getPropertyValue: () => '   ',
        } as unknown as CSSStyleDeclaration);

        const wrapper = mountWithColor('--color-chart-1', 'rgb(1, 2, 3)');

        expect(wrapper.text()).toBe('rgb(1, 2, 3)');
    });
});
