import { describe, expect, it } from 'vitest';
import { useFormValidation } from '@/composables/useFormValidation';
import { required } from '@/lib/validation';

function form(overrides: Record<string, unknown> = {}) {
    return { name: '', email: '', errors: {}, ...overrides };
}

describe('useFormValidation', () => {
    it('does not compute client errors before a submit attempt', () => {
        const { clientErrors, errors } = useFormValidation(form(), {
            name: [required('Name')],
        });

        expect(clientErrors.value).toEqual({});
        expect(errors.value).toEqual({});
    });

    it('attemptSubmit surfaces client errors and returns false when invalid', () => {
        const { attemptSubmit, errors } = useFormValidation(form(), {
            name: [required('Name')],
        });

        expect(attemptSubmit()).toBe(false);
        expect(errors.value.name).toBeDefined();
    });

    it('attemptSubmit returns true once every field passes', () => {
        const { attemptSubmit, errors } = useFormValidation(
            form({ name: 'Jane' }),
            { name: [required('Name')] },
        );

        expect(attemptSubmit()).toBe(true);
        expect(errors.value.name).toBeUndefined();
    });

    it('merges server-side form errors with client errors', () => {
        const { attemptSubmit, errors } = useFormValidation(
            form({ errors: { email: 'Already taken' } }),
            { name: [required('Name')] },
        );

        attemptSubmit();

        expect(errors.value.name).toBeDefined();
        expect(errors.value.email).toBe('Already taken');
    });

    it('fieldErrors lets a server error win over a client error for the same field', () => {
        const theForm = form({ name: '', errors: { name: 'Already taken' } });
        const { attemptSubmit, fieldErrors } = useFormValidation(theForm, {
            name: [required('Name')],
        });

        attemptSubmit();

        expect(fieldErrors.value.name).toBe('Already taken');
    });

    it('reset clears the attempted flag so client errors disappear again', () => {
        const { attemptSubmit, reset, clientErrors } = useFormValidation(
            form(),
            {
                name: [required('Name')],
            },
        );

        attemptSubmit();
        expect(clientErrors.value.name).toBeDefined();

        reset();
        expect(clientErrors.value).toEqual({});
    });
});
