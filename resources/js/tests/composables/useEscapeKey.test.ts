import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useEscapeKey } from '@/composables/useEscapeKey';

function mountWithHandler(handler: (e: KeyboardEvent) => void) {
    const Host = defineComponent({
        setup() {
            useEscapeKey(handler);
        },
        template: '<div />',
    });

    return mount(Host);
}

describe('useEscapeKey', () => {
    it('invokes the handler when Escape is pressed', () => {
        const handler = vi.fn();
        mountWithHandler(handler);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys', () => {
        const handler = vi.fn();
        mountWithHandler(handler);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(handler).not.toHaveBeenCalled();
    });

    it('stops listening once the component is unmounted', () => {
        const handler = vi.fn();
        const wrapper = mountWithHandler(handler);

        wrapper.unmount();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(handler).not.toHaveBeenCalled();
    });
});
