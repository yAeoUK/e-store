import { describe, expect, it, vi } from 'vitest';
import type * as I18n from '@/i18n';

// tests/setup.ts globally mocks '@/i18n' with a passthrough `t` for component
// tests, so the real implementation must be pulled in via importActual to be
// exercised here.
const { t } = await vi.importActual<typeof I18n>('@/i18n');

describe('t', () => {
    it('resolves a top-level key for the given locale', () => {
        expect(t('common.categories', 'en')).toBe('Categories');
        expect(t('common.categories', 'ar')).toBe('الفئات');
    });

    it('resolves a nested key via dot notation', () => {
        expect(t('common.nav.greeting', 'en')).toBe('Hi,');
    });

    it('returns the path unchanged when the key does not exist', () => {
        expect(t('common.doesNotExist', 'en')).toBe('common.doesNotExist');
        expect(t('unknownNamespace.key', 'en')).toBe('unknownNamespace.key');
    });

    it('returns the path unchanged when the resolved value is not a string', () => {
        expect(t('common.nav', 'en')).toBe('common.nav');
    });

    it('defaults to the current locale when none is given', () => {
        expect(t('common.categories')).toBe('Categories');
    });
});
