import { describe, expect, it, vi } from 'vitest';
import { useAdminResourceForm } from '@/composables/useAdminResourceForm';
import { required } from '@/lib/validation';
import { getMockForm } from '../setup';

function setUp(onSubmit = vi.fn()) {
    const result = useAdminResourceForm(
        { name: '', email: '' },
        { name: [required('Name')] },
        onSubmit,
    );

    return { ...result, onSubmit };
}

describe('useAdminResourceForm', () => {
    it('creates the form from the given initial values', () => {
        const { form } = setUp();

        expect(form.name).toBe('');
        expect(form.email).toBe('');
        expect(form.processing).toBe(false);
    });

    it('blocks submit and surfaces client errors when a required field is empty', () => {
        const { submit, clientErrors, onSubmit } = setUp();

        submit();

        expect(clientErrors.value.name).toBeDefined();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with the form once every field passes', () => {
        const { form, submit, clientErrors, onSubmit } = setUp();

        form.name = 'Jane';
        submit();

        expect(clientErrors.value.name).toBeUndefined();
        expect(onSubmit).toHaveBeenCalledWith(form);
    });

    it('lets the onSubmit callback post/patch the form to a route', () => {
        const { form, submit } = setUp((f) => f.post('/widgets'));

        form.name = 'Jane';
        submit();

        expect(getMockForm().lastPostUrl).toBe('/widgets');
    });
});
