import { describe, expect, it } from 'vitest';
import {
    categoryValidationRules,
    confirmedBy,
    emailField,
    integer,
    isEmail,
    maxLength,
    min,
    nameEmailPasswordRules,
    numeric,
    passwordConfirmationRules,
    productValidationRules,
    required,
    validateFields,
} from '@/lib/validation';

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

        expect(
            rules.every((rule) => rule('jane@example.com', {}) === null),
        ).toBe(true);
    });
});

describe('maxLength', () => {
    it('rejects a value longer than the limit', () => {
        expect(maxLength('Name', 3)('abcd', {})).not.toBeNull();
        expect(maxLength('Name', 3)('abc', {})).toBeNull();
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

describe('min', () => {
    it('rejects values outside the bound', () => {
        expect(min('Price', 0)('-1', {})).not.toBeNull();
        expect(min('Price', 0)('0', {})).toBeNull();
    });
});

describe('confirmedBy', () => {
    it('rejects a mismatched confirmation field', () => {
        const validate = confirmedBy('Confirm Password', 'password');

        expect(validate('secret2', { password: 'secret' })).not.toBeNull();
        expect(validate('secret', { password: 'secret' })).toBeNull();
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

describe('passwordConfirmationRules', () => {
    const labels = {
        password: 'Password',
        passwordConfirmation: 'Confirm Password',
    };

    it('rejects a missing password and mismatched confirmation', () => {
        const rules = passwordConfirmationRules(labels);
        const data = { password: '', password_confirmation: 'mismatch' };

        const errors = validateFields(data, rules);

        expect(Object.keys(errors)).toEqual([
            'password',
            'password_confirmation',
        ]);
    });

    it('accepts a fully valid submission', () => {
        const rules = passwordConfirmationRules(labels);
        const data = { password: 'secret', password_confirmation: 'secret' };

        expect(validateFields(data, rules)).toEqual({});
    });
});

describe('nameEmailPasswordRules', () => {
    const labels = {
        name: 'Name',
        email: 'Email',
        password: 'Password',
        passwordConfirmation: 'Confirm Password',
    };

    it('rejects missing name, malformed email and mismatched confirmation', () => {
        const rules = nameEmailPasswordRules(labels);
        const data = {
            name: '',
            email: 'not-an-email',
            password: 'secret',
            password_confirmation: 'mismatch',
        };

        const errors = validateFields(data, rules);

        expect(Object.keys(errors)).toEqual([
            'name',
            'email',
            'password_confirmation',
        ]);
    });

    it('accepts a fully valid submission', () => {
        const rules = nameEmailPasswordRules(labels);
        const data = {
            name: 'Jane',
            email: 'jane@example.com',
            password: 'secret',
            password_confirmation: 'secret',
        };

        expect(validateFields(data, rules)).toEqual({});
    });
});

describe('categoryValidationRules', () => {
    const labels = { name: 'Name', slug: 'Slug' };

    it('rejects a missing name', () => {
        const rules = categoryValidationRules(labels);
        const errors = validateFields({ name: '', slug: '' }, rules);

        expect(Object.keys(errors)).toEqual(['name']);
    });

    it('accepts a fully valid submission', () => {
        const rules = categoryValidationRules(labels);
        const data = { name: 'Shoes', slug: 'shoes' };

        expect(validateFields(data, rules)).toEqual({});
    });
});

describe('productValidationRules', () => {
    const labels = {
        name: 'Name',
        price: 'Price',
        stock: 'Stock',
        shortDescription: 'Short Description',
        slug: 'Slug',
    };

    it('rejects a missing name, missing price and non-integer stock', () => {
        const rules = productValidationRules(labels);
        const data = {
            name: '',
            price: '',
            stock: '1.5',
            short_description: '',
            slug: '',
        };

        const errors = validateFields(data, rules);

        expect(Object.keys(errors)).toEqual(['name', 'price', 'stock']);
    });

    it('rejects a negative price and negative stock', () => {
        const rules = productValidationRules(labels);
        const data = {
            name: 'Shoes',
            price: '-1',
            stock: '-1',
            short_description: '',
            slug: '',
        };

        const errors = validateFields(data, rules);

        expect(Object.keys(errors)).toEqual(['price', 'stock']);
    });

    it('accepts a fully valid submission', () => {
        const rules = productValidationRules(labels);
        const data = {
            name: 'Shoes',
            price: '19.99',
            stock: '5',
            short_description: 'Comfortable shoes',
            slug: 'shoes',
        };

        expect(validateFields(data, rules)).toEqual({});
    });
});
