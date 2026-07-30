import { describe, expect, it } from 'vitest';
import { slugify } from '@/lib/slug';

describe('slugify', () => {
    it('lowercases and joins words with hyphens', () => {
        expect(slugify('Wireless Mouse')).toBe('wireless-mouse');
    });

    it('collapses consecutive non-alphanumeric characters into a single hyphen', () => {
        expect(slugify('Wireless   Mouse -- Pro!!')).toBe('wireless-mouse-pro');
    });

    it('strips leading and trailing hyphens', () => {
        expect(slugify('  --Wireless Mouse--  ')).toBe('wireless-mouse');
    });

    it('preserves numbers', () => {
        expect(slugify('Model 3000 XL')).toBe('model-3000-xl');
    });

    it('drops accented and non-ASCII characters entirely', () => {
        expect(slugify('Café Déjà Vu')).toBe('caf-d-j-vu');
    });

    it('returns an empty string when there is nothing sluggable', () => {
        expect(slugify('   ')).toBe('');
        expect(slugify('!!!')).toBe('');
    });
});
