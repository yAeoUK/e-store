import { describe, expect, it, vi } from 'vitest';
import { useValidatedSubmit } from '@/composables/useValidatedSubmit';
import { required } from '@/lib/validation';
import { getMockForm } from '../setup';

function setUp(onSubmit: (form: any) => void = vi.fn()) {
    const result = useValidatedSubmit(
        { name: '', email: '' },
        { name: [required('Name')] },
        onSubmit,
    );

    return { ...result, onSubmit };
}

describe('useValidatedSubmit', () => {
    it('creates the form from the given initial values', () => {
        const { form } = setUp();

        expect(form.name).toBe('');
        expect(form.email).toBe('');
        expect(form.processing).toBe(false);
    });

    it('blocks submit and surfaces client errors when a required field is empty', () => {
        const { submit, errors, onSubmit } = setUp();

        submit();

        expect(errors.value.name).toBeDefined();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with the form once every field passes', () => {
        const { form, submit, errors, onSubmit } = setUp();

        form.name = 'Jane';
        submit();

        expect(errors.value.name).toBeUndefined();
        expect(onSubmit).toHaveBeenCalledWith(form);
    });

    it('lets the onSubmit callback post the form to a route', () => {
        const { form, submit } = setUp((f) => f.post('/widgets'));

        form.name = 'Jane';
        submit();

        expect(getMockForm().lastPostUrl).toBe('/widgets');
    });

    it('merges server-side form errors with client errors', () => {
        const { form, errors, submit } = setUp();

        form.name = 'Jane';
        form.errors = { email: 'Already taken' };
        submit();

        expect(errors.value.name).toBeUndefined();
        expect(errors.value.email).toBe('Already taken');
    });

    it('reset clears client errors from a failed submit attempt', () => {
        const { submit, reset, errors } = setUp();

        submit();
        expect(errors.value.name).toBeDefined();

        reset();
        expect(errors.value.name).toBeUndefined();
    });
});
