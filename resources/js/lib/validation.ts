import { tp } from '@/i18n';

export type Validator = (
    value: unknown,
    data: Record<string, unknown>,
) => string | null;

function isBlank(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
    );
}

export function required(field: string): Validator {
    return (value) =>
        isBlank(value) ? tp('validation.required', { field }) : null;
}

export function isEmail(field: string): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
            ? null
            : tp('validation.email', { field });
    };
}

export function emailField(field: string): Validator[] {
    return [required(field), isEmail(field)];
}

export function maxLength(field: string, limit: number): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return String(value).length <= limit
            ? null
            : tp('validation.maxLength', { field, max: limit });
    };
}

export function numeric(field: string): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return Number.isNaN(Number(value))
            ? tp('validation.numeric', { field })
            : null;
    };
}

export function integer(field: string): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return Number.isInteger(Number(value))
            ? null
            : tp('validation.integer', { field });
    };
}

export function min(field: string, limit: number): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return Number(value) >= limit
            ? null
            : tp('validation.min', { field, min: limit });
    };
}

export function confirmedBy(field: string, otherField: string): Validator {
    return (value, data) =>
        value === data[otherField]
            ? null
            : tp('validation.confirmed', { field });
}

// The password/password_confirmation pair repeated by registration, admin
// creation, password reset and password change forms.
export function passwordConfirmationRules(labels: {
    password: string;
    passwordConfirmation: string;
}): Record<'password' | 'password_confirmation', Validator[]> {
    return {
        password: [required(labels.password)],
        password_confirmation: [
            confirmedBy(labels.passwordConfirmation, 'password'),
        ],
    };
}

// Mirrors the backend's SharedRules::nameEmailPasswordRules() - the client
// side of the name/email/password/password_confirmation shape shared by
// registration and admin creation.
export function nameEmailPasswordRules(labels: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}): Record<
    'name' | 'email' | 'password' | 'password_confirmation',
    Validator[]
> {
    return {
        name: [required(labels.name), maxLength(labels.name, 255)],
        email: [
            required(labels.email),
            isEmail(labels.email),
            maxLength(labels.email, 255),
        ],
        ...passwordConfirmationRules(labels),
    };
}

// Mirrors the backend's SharedRules::nameAndSlugRules() - the client side of
// the required-name/optional-slug shape shared by category create and edit.
export function categoryValidationRules(labels: {
    name: string;
    slug: string;
}): Record<'name' | 'slug', Validator[]> {
    return {
        name: [required(labels.name), maxLength(labels.name, 255)],
        slug: [maxLength(labels.slug, 255)],
    };
}

// The client side of the name/price/stock/short_description/slug shape
// shared by product create and edit.
export function productValidationRules(labels: {
    name: string;
    price: string;
    stock: string;
    shortDescription: string;
    slug: string;
}): Record<
    'name' | 'price' | 'stock' | 'short_description' | 'slug',
    Validator[]
> {
    return {
        name: [required(labels.name), maxLength(labels.name, 255)],
        price: [
            required(labels.price),
            numeric(labels.price),
            min(labels.price, 0),
        ],
        stock: [integer(labels.stock), min(labels.stock, 0)],
        short_description: [maxLength(labels.shortDescription, 500)],
        slug: [maxLength(labels.slug, 255)],
    };
}

// Bound on `object` (not `Record<string, unknown>`) so callers can pass an
// Inertia `useForm()` result directly - `InertiaForm<T>` is an intersection
// type with methods, and TS won't treat it as assignable to an indexed
// `Record<string, unknown>` constraint without callers casting it themselves.
export function validateFields<T extends object>(
    data: T,
    rules: Partial<Record<keyof T, Validator[]>>,
): Partial<Record<keyof T, string>> {
    const errors: Partial<Record<keyof T, string>> = {};
    const values = data as Record<string, unknown>;

    for (const field of Object.keys(rules) as (keyof T)[]) {
        for (const validate of rules[field] ?? []) {
            const message = validate(values[field as string], values);

            if (message) {
                errors[field] = message;
                break;
            }
        }
    }

    return errors;
}
