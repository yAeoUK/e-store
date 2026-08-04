import { computed, ref } from 'vue';
import type { Validator } from '@/lib/validation';
import { validateFields } from '@/lib/validation';

interface FormWithErrors {
    errors: Record<string, string | undefined>;
}

// Bound on `object` (not `Record<string, unknown>`) for the same reason as
// validateFields: callers pass an Inertia `useForm()` result directly, and
// `InertiaForm<T>`'s intersection with methods isn't assignable to an
// indexed constraint without casting.
export function useFormValidation<F extends object>(
    form: F,
    rules: Partial<Record<keyof F, Validator[]>>,
) {
    const attempted = ref(false);

    const clientErrors = computed<Partial<Record<keyof F, string>>>(() =>
        attempted.value ? validateFields(form, rules) : {},
    );

    const errors = computed<Partial<Record<keyof F, string>>>(() => ({
        ...(form as unknown as FormWithErrors).errors,
        ...clientErrors.value,
    }));

    function attemptSubmit(): boolean {
        attempted.value = true;

        return Object.keys(clientErrors.value).length === 0;
    }

    function reset(): void {
        attempted.value = false;
    }

    return { attempted, clientErrors, errors, attemptSubmit, reset };
}
