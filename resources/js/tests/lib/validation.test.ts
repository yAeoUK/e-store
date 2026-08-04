import { describe, expect, it } from 'vitest';
import {
    confirmedBy,
    emailField,
    fileMaxSize,
    filesRequired,
    fileType,
    integer,
    isEmail,
    max,
    maxLength,
    min,
    minLength,
    numeric,
    required,
    validateFields,
} from '@/lib/validation';

function file(type: string, size: number): File {
    return new File([new Uint8Array(size)], 'file', { type });
}

describe('required', () => {
    it('rejects null, undefined, empty and whitespace-only strings', () => {
        const validate = required('Name');

        expect(validate(null, {})).not.toBeNull();
        expect(validate(undefined, {})).not.toBeNull();
        expect(validate('', {})).not.toBeNull();
        expect(validate('   ', {})).not.toBeNull();
    });

    it('accepts 0 and false as present values', () => {
        const validate = required('Stock');

        expect(validate(0, {})).toBeNull();
        expect(validate(false, {})).toBeNull();
    });

    it('accepts a non-empty value', () => {
        expect(required('Name')('Jane', {})).toBeNull();
    });
});

describe('isEmail', () => {
    it('rejects a malformed email', () => {
        expect(isEmail('Email')('not-an-email', {})).not.toBeNull();
    });

    it('accepts a well-formed email', () => {
        expect(isEmail('Email')('jane@example.com', {})).toBeNull();
    });

    it('does not flag an empty value (pair with required separately)', () => {
        expect(isEmail('Email')('', {})).toBeNull();
    });
});

describe('emailField', () => {
    it('rejects an empty value', () => {
        const [requiredRule, emailRule] = emailField('Email');

        expect(requiredRule('', {})).not.toBeNull();
        expect(emailRule('', {})).toBeNull();
    });

    it('rejects a malformed email', () => {
        const rules = emailField('Email');

        expect(rules.every((rule) => rule('not-an-email', {}) === null)).toBe(
            false,
        );
    });

    it('accepts a well-formed email', () => {
        const rules = emailField('Email');

        expect(rules.every((rule) => rule('jane@example.com', {}) === null)).toBe(
            true,
        );
    });
});

describe('maxLength / minLength', () => {
    it('rejects a value longer than the limit', () => {
        expect(maxLength('Name', 3)('abcd', {})).not.toBeNull();
        expect(maxLength('Name', 3)('abc', {})).toBeNull();
    });

    it('rejects a value shorter than the limit', () => {
        expect(minLength('Password', 8)('short', {})).not.toBeNull();
        expect(minLength('Password', 8)('longenough', {})).toBeNull();
    });
});

describe('numeric / integer', () => {
    it('rejects a non-numeric string', () => {
        expect(numeric('Price')('abc', {})).not.toBeNull();
        expect(numeric('Price')('12.5', {})).toBeNull();
    });

    it('rejects a non-integer number', () => {
        expect(integer('Stock')('12.5', {})).not.toBeNull();
        expect(integer('Stock')('12', {})).toBeNull();
        expect(integer('Stock')(0, {})).toBeNull();
    });
});

describe('min / max', () => {
    it('rejects values outside the bound', () => {
        expect(min('Price', 0)('-1', {})).not.toBeNull();
        expect(min('Price', 0)('0', {})).toBeNull();
        expect(max('Price', 100)('101', {})).not.toBeNull();
        expect(max('Price', 100)('100', {})).toBeNull();
    });
});

describe('confirmedBy', () => {
    it('rejects a mismatched confirmation field', () => {
        const validate = confirmedBy('Confirm Password', 'password');

        expect(validate('secret2', { password: 'secret' })).not.toBeNull();
        expect(validate('secret', { password: 'secret' })).toBeNull();
    });
});

describe('filesRequired / fileType / fileMaxSize', () => {
    it('rejects an empty file list', () => {
        expect(filesRequired('Images')([], {})).not.toBeNull();
        expect(filesRequired('Images')([file('image/png', 10)], {})).toBeNull();
    });

    it('rejects a disallowed mime type', () => {
        const validate = fileType(
            'Images',
            ['image/jpeg', 'image/png', 'image/webp'],
            'JPEG, PNG, WEBP',
        );

        expect(validate([file('image/gif', 10)], {})).not.toBeNull();
        expect(validate([file('image/png', 10)], {})).toBeNull();
    });

    it('rejects an oversized file', () => {
        const validate = fileMaxSize('Images', 100, '100 bytes');

        expect(validate([file('image/png', 101)], {})).not.toBeNull();
        expect(validate([file('image/png', 100)], {})).toBeNull();
    });
});

describe('validateFields', () => {
    it('collects the first failing rule per field and skips passing fields', () => {
        const errors = validateFields(
            { name: '', email: 'not-an-email', stock: 5 },
            {
                name: [required('Name')],
                email: [required('Email'), isEmail('Email')],
                stock: [integer('Stock')],
            },
        );

        expect(Object.keys(errors)).toEqual(['name', 'email']);
        expect(errors.stock).toBeUndefined();
    });

    it('returns an empty object when every field passes', () => {
        const errors = validateFields(
            { name: 'Jane' },
            { name: [required('Name')] },
        );

        expect(errors).toEqual({});
    });
});
