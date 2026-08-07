import { describe, expect, it, vi } from 'vitest';
import type * as I18n from '@/i18n';

// tests/setup.ts globally mocks '@/i18n' with a passthrough `t`/`tp` for
// component tests, so the real implementation must be pulled in via
// importActual to be exercised here.
const { t, tp } = await vi.importActual<typeof I18n>('@/i18n');

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

describe('tp', () => {
    it('interpolates {token} placeholders from params', () => {
        expect(tp('validation.required', { field: 'Name' }, 'en')).toBe(
            'Name is required.',
        );
        expect(
            tp('validation.maxLength', { field: 'Name', max: 255 }, 'en'),
        ).toBe('Name must not exceed 255 characters.');
    });

    it('leaves a placeholder unchanged when no matching param is given', () => {
        expect(tp('validation.required', {}, 'en')).toBe(
            '{field} is required.',
        );
    });

    it('returns the path unchanged when the key does not exist', () => {
        expect(tp('validation.doesNotExist', { field: 'Name' }, 'en')).toBe(
            'validation.doesNotExist',
        );
    });

    it('resolves the Arabic translation with interpolation', () => {
        expect(tp('validation.required', { field: 'الاسم' }, 'ar')).toBe(
            'الاسم مطلوب.',
        );
    });

    it('defaults to the current locale when none is given', () => {
        expect(tp('validation.required', { field: 'Name' })).toBe(
            'Name is required.',
        );
    });
});
