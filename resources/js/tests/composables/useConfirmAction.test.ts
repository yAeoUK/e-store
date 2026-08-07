import { describe, expect, it, vi } from 'vitest';
import { useConfirmAction } from '@/composables/useConfirmAction';

describe('useConfirmAction', () => {
    it('starts with nothing pending', () => {
        const { confirming, processing } = useConfirmAction(vi.fn());

        expect(confirming.value).toBeNull();
        expect(processing.value).toBe(false);
    });

    it('confirm defaults to true, cancel clears it', () => {
        const { confirming, confirm, cancel } = useConfirmAction(vi.fn());

        confirm();
        expect(confirming.value).toBe(true);

        cancel();
        expect(confirming.value).toBeNull();
    });

    it('confirm records a custom value', () => {
        const { confirming, confirm } = useConfirmAction<number>(vi.fn());

        confirm(9);

        expect(confirming.value).toBe(9);
    });

    it('run is a no-op when nothing is confirmed', () => {
        const action = vi.fn();
        const { run } = useConfirmAction(action);

        run();

        expect(action).not.toHaveBeenCalled();
    });

    it('run invokes the action with the confirmed value and sets processing', () => {
        const action = vi.fn();
        const { confirming, processing, confirm, run } =
            useConfirmAction<number>(action);

        confirm(3);
        run();

        expect(action).toHaveBeenCalledWith(3, expect.any(Function));
        expect(processing.value).toBe(true);
        expect(confirming.value).toBe(3);
    });

    it('resets processing and confirming once the action finishes', () => {
        const action = vi.fn((_value: number, onFinish: () => void) =>
            onFinish(),
        );
        const { confirming, processing, confirm, run } =
            useConfirmAction<number>(action);

        confirm(3);
        run();

        expect(processing.value).toBe(false);
        expect(confirming.value).toBeNull();
    });
});
