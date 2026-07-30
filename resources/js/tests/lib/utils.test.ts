import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
    it('joins truthy class values', () => {
        expect(cn('a', 'b')).toBe('a b');
    });

    it('drops falsy values', () => {
        expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
    });

    it('flattens arrays and objects', () => {
        expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
    });

    it('resolves conflicting tailwind classes in favor of the last one', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('keeps non-conflicting classes alongside a resolved conflict', () => {
        expect(cn('flex p-2', 'p-4')).toBe('flex p-4');
    });
});
