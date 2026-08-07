import { useForm } from '@inertiajs/vue3';
import type { InertiaForm } from '@inertiajs/vue3';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Validator } from '@/lib/validation';

// Bundles the useForm() + useFormValidation() + guarded-submit boilerplate
// every auth/profile/admin page repeats. Auth/profile pages bind the
// client-first `errors`; admin pages that hand a whole errors object down to
// a shared fields component bind the server-first `fieldErrors` instead.
export function useValidatedSubmit<TForm extends Record<string, unknown>>(
    initialValues: TForm,
    rules: Partial<Record<keyof TForm, Validator[]>>,
    onSubmit: (form: InertiaForm<TForm>) => void,
) {
    // `useForm`'s generic constraint can't be verified against an unresolved
    // generic `TForm`, only against a concrete object literal type, so the
    // argument is passed through as `any` and the result cast back to
    // `InertiaForm<TForm>`.
    const form = useForm(initialValues as any) as InertiaForm<TForm>;
    const { clientErrors, errors, fieldErrors, attemptSubmit, reset } =
        useFormValidation(form, rules);

    function submit(): void {
        if (!attemptSubmit()) {
            return;
        }

        onSubmit(form);
    }

    return { form, clientErrors, errors, fieldErrors, submit, reset };
}
