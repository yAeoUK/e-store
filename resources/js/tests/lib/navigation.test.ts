import { describe, expect, it } from 'vitest';
import { isCurrentPath } from '@/lib/navigation';

describe('isCurrentPath', () => {
    it('matches an exact URL', () => {
        expect(isCurrentPath('/admin/products', '/admin/products')).toBe(true);
    });

    it('matches a sub-route separated by a slash', () => {
        expect(isCurrentPath('/admin/products/5/edit', '/admin/products')).toBe(
            true,
        );
    });

    it('matches a sub-route separated by a query string', () => {
        expect(isCurrentPath('/admin/products?page=2', '/admin/products')).toBe(
            true,
        );
    });

    it('does not match a sibling whose name is prefixed by another', () => {
        expect(isCurrentPath('/admins', '/admin')).toBe(false);
        expect(isCurrentPath('/shoes-kids', '/shoes')).toBe(false);
    });

    it('does not match an unrelated URL', () => {
        expect(isCurrentPath('/account/orders', '/admin/products')).toBe(false);
    });

    it('treats an undefined URL as not matching', () => {
        expect(isCurrentPath(undefined, '/admin/products')).toBe(false);
    });
});
