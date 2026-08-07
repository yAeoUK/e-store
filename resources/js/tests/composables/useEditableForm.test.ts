import { describe, expect, it } from 'vitest';
import { useEditableForm } from '@/composables/useEditableForm';
import { required } from '@/lib/validation';

interface Item {
    id: number;
    name: string;
    options: Record<string, string>;
}

function setUp() {
    return useEditableForm<
        { name: string; options: Record<string, string> },
        Item
    >(
        () => ({ name: '', options: {} }),
        { name: [required('Name')] },
        (form, item) => {
            form.name = item.name;
            form.options = item.options;
        },
    );
}

describe('useEditableForm', () => {
    it('starts with no item being edited', () => {
        const { editingId } = setUp();

        expect(editingId.value).toBeNull();
    });

    it('gives form and editForm independent nested state', () => {
        const { form, editForm } = setUp();

        form.options.color = 'red';

        expect(editForm.options).toEqual({});
    });

    it('blocks submission and surfaces client errors when a required field is empty', () => {
        const { attemptSubmit, errors } = setUp();

        expect(attemptSubmit()).toBe(false);
        expect(errors.value.name).toBeDefined();
    });

    it('fieldErrors lets a server error win over a client error for the same field', () => {
        const { form, fieldErrors, attemptSubmit } = setUp();

        form.errors = { name: 'Already taken' };
        attemptSubmit();

        expect(fieldErrors.value.name).toBe('Already taken');
    });

    it('editFieldErrors lets a server error win over a client error for the same field', () => {
        const { editForm, editFieldErrors, attemptEditSubmit } = setUp();

        editForm.errors = { name: 'Already taken' };
        attemptEditSubmit();

        expect(editFieldErrors.value.name).toBe('Already taken');
    });

    it('edit() records the id, clears stale edit-form errors, and populates the form', () => {
        const { edit, editingId, editForm, editErrors, attemptEditSubmit } =
            setUp();

        attemptEditSubmit();
        expect(editErrors.value.name).toBeDefined();

        edit({ id: 5, name: 'Jane', options: { color: 'red' } });

        expect(editingId.value).toBe(5);
        expect(editForm.name).toBe('Jane');
        expect(editForm.options).toEqual({ color: 'red' });
        expect(editErrors.value.name).toBeUndefined();
    });

    it('closeEdit() clears the editing id and resets the edit form', () => {
        const { edit, closeEdit, editingId, editForm, attemptEditSubmit } =
            setUp();

        edit({ id: 5, name: 'Jane', options: { color: 'red' } });
        attemptEditSubmit();
        editForm.name = 'changed';

        closeEdit();

        expect(editingId.value).toBeNull();
        expect(editForm.name).toBe('');
        expect(editForm.errors).toEqual({});
    });
});
