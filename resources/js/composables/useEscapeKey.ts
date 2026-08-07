import { onMounted, onUnmounted } from 'vue';

export function useEscapeKey(handler: (e: KeyboardEvent) => void) {
    const listener = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handler(e);
        }
    };

    onMounted(() => document.addEventListener('keydown', listener));
    onUnmounted(() => document.removeEventListener('keydown', listener));
}
