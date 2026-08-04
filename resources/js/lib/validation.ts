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
    return (value) => (isBlank(value) ? tp('validation.required', { field }) : null);
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

export function minLength(field: string, limit: number): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return String(value).length >= limit
            ? null
            : tp('validation.minLength', { field, min: limit });
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

export function max(field: string, limit: number): Validator {
    return (value) => {
        if (isBlank(value)) {
            return null;
        }

        return Number(value) <= limit
            ? null
            : tp('validation.max', { field, max: limit });
    };
}

export function confirmedBy(field: string, otherField: string): Validator {
    return (value, data) =>
        value === data[otherField] ? null : tp('validation.confirmed', { field });
}

export function filesRequired(field: string): Validator {
    return (value) =>
        Array.isArray(value) && value.length > 0
            ? null
            : tp('validation.filesRequired', { field });
}

export function fileType(
    field: string,
    allowedMimes: string[],
    humanTypes: string,
): Validator {
    return (value) => {
        const files = value as File[] | undefined;

        if (!files || files.length === 0) {
            return null;
        }

        return files.every((file) => allowedMimes.includes(file.type))
            ? null
            : tp('validation.fileType', { field, types: humanTypes });
    };
}

export function fileMaxSize(
    field: string,
    maxBytes: number,
    humanSize: string,
): Validator {
    return (value) => {
        const files = value as File[] | undefined;

        if (!files || files.length === 0) {
            return null;
        }

        return files.every((file) => file.size <= maxBytes)
            ? null
            : tp('validation.fileSize', { field, max: humanSize });
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
