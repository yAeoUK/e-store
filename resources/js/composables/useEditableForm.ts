import { useForm } from '@inertiajs/vue3';
import type { InertiaForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Validator } from '@/lib/validation';

// Bundles the create-form / edit-form pair every "list with an add card and
// an edit modal" manager repeats: two useForm() instances, their
// useFormValidation() wiring, and the edit()/closeEdit() bookkeeping around
// the editing-id ref. `createInitialValues` is called once per form so the
// two never share nested objects (e.g. an `options` map) by reference.
export function useEditableForm<
    TForm extends Record<string, unknown>,
    TItem extends { id: number },
>(
    createInitialValues: () => TForm,
    rules: Partial<Record<keyof TForm, Validator[]>>,
    populate: (form: InertiaForm<TForm>, item: TItem) => void,
) {
    // `useForm`'s generic constraint can't be verified against an
    // unresolved generic `TForm`, only against a concrete object literal
    // type, so the argument is passed through as `any` and the result
    // cast back to `InertiaForm<TForm>`.
    const form = useForm(createInitialValues() as any) as InertiaForm<TForm>;
    const {
        errors,
        clientErrors,
        fieldErrors,
        attemptSubmit,
        reset: resetAttempted,
    } = useFormValidation(form, rules);

    const editingId = ref<number | null>(null);
    const editForm = useForm(
        createInitialValues() as any,
    ) as InertiaForm<TForm>;
    const {
        errors: editErrors,
        clientErrors: editClientErrors,
        fieldErrors: editFieldErrors,
        attemptSubmit: attemptEditSubmit,
        reset: resetEditAttempted,
    } = useFormValidation(editForm, rules);

    function edit(item: TItem): void {
        editingId.value = item.id;
        editForm.clearErrors();
        resetEditAttempted();
        populate(editForm, item);
    }

    function closeEdit(): void {
        editingId.value = null;
        editForm.clearErrors();
        editForm.reset();
        resetEditAttempted();
    }

    return {
        form,
        errors,
        clientErrors,
        fieldErrors,
        attemptSubmit,
        resetAttempted,
        editingId,
        editForm,
        editErrors,
        editClientErrors,
        editFieldErrors,
        attemptEditSubmit,
        resetEditAttempted,
        edit,
        closeEdit,
    };
}
