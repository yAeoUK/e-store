import { describe, expect, it } from 'vitest';
import {
    formatCurrency,
    formatDate,
    formatVariantOptions,
    toSummaryItems,
} from '@/lib/format';

describe('formatCurrency', () => {
    it('formats a number with a dollar sign and two decimals', () => {
        expect(formatCurrency(9)).toBe('$9.00');
        expect(formatCurrency(9.5)).toBe('$9.50');
    });

    it('formats a numeric string', () => {
        expect(formatCurrency('19.999')).toBe('$20.00');
    });
});

describe('formatVariantOptions', () => {
    it('joins each option as "key: value" pairs separated by commas', () => {
        expect(formatVariantOptions({ Color: 'Red', Size: 'M' })).toBe(
            'Color: Red, Size: M',
        );
    });

    it('returns an empty string for null, undefined, or empty options', () => {
        expect(formatVariantOptions(null)).toBe('');
        expect(formatVariantOptions(undefined)).toBe('');
        expect(formatVariantOptions({})).toBe('');
    });
});

describe('formatDate', () => {
    it('formats an ISO date string using toLocaleDateString', () => {
        const value = '2026-01-02T00:00:00.000Z';

        expect(formatDate(value)).toBe(new Date(value).toLocaleDateString());
    });
});

describe('toSummaryItems', () => {
    it('maps items to summary items using the given accessors', () => {
        const items = [
            {
                id: 1,
                quantity: 2,
                unit_price: '19.99',
                product: { name: 'Widget', options: { color: 'red' } },
            },
            {
                id: 2,
                quantity: 1,
                unit_price: 20,
                product: { name: 'Gadget', options: null },
            },
        ];

        expect(
            toSummaryItems(
                items,
                (item) => item.product.name,
                (item) => item.product.options,
            ),
        ).toEqual([
            {
                id: 1,
                name: 'Widget',
                variantOptions: { color: 'red' },
                quantity: 2,
                unitPrice: '19.99',
            },
            {
                id: 2,
                name: 'Gadget',
                variantOptions: null,
                quantity: 1,
                unitPrice: 20,
            },
        ]);
    });

    it('returns an empty array for an empty list', () => {
        expect(
            toSummaryItems(
                [],
                () => '',
                () => null,
            ),
        ).toEqual([]);
    });
});
