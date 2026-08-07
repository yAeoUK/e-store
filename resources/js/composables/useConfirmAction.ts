import { ref } from 'vue';

export function useConfirmAction<T = true>(
    action: (value: T, onFinish: () => void) => void,
) {
    const confirming = ref<T | null>(null);
    const processing = ref(false);

    function confirm(value: T = true as T): void {
        confirming.value = value;
    }

    function cancel(): void {
        confirming.value = null;
    }

    function run(): void {
        if (confirming.value === null) {
            return;
        }

        processing.value = true;

        action(confirming.value, () => {
            processing.value = false;
            confirming.value = null;
        });
    }

    return { confirming, processing, confirm, cancel, run };
}
