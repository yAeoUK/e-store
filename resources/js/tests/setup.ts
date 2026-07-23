import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import { reactive } from 'vue';

const routerGet = vi.fn();
const routerPost = vi.fn();

type FormOptions = { onFinish?: () => void };
type MockForm = Record<string, unknown> & {
    errors: Record<string, string>;
    processing: boolean;
};

let lastForm: MockForm | undefined;

function useForm<T extends Record<string, unknown>>(initial: T) {
    const initialData: Record<string, unknown> = { ...initial };

    const form = reactive({
        ...initial,
        errors: {} as Record<string, string>,
        processing: false,
        data() {
            return { ...initialData };
        },
        post(_url: string, options: FormOptions = {}) {
            options.onFinish?.();
        },
        get(_url: string, options: FormOptions = {}) {
            options.onFinish?.();
        },
        reset(...fields: string[]) {
            const target = form as unknown as Record<string, unknown>;
            const keys = fields.length ? fields : Object.keys(initialData);

            keys.forEach((key) => {
                if (key in initialData) {
                    target[key] = initialData[key];
                }
            });
        },
    });

    lastForm = form as MockForm;

    return form;
}

// Grabs the most recently created mock useForm() instance so tests can seed
// form.errors after mounting and assert that validation errors render.
export function getMockForm<T = MockForm>(): T {
    if (!lastForm) {
        throw new Error('getMockForm() called before any component called useForm().');
    }

    return lastForm as unknown as T;
}

const usePage = vi.fn(() => ({ props: { auth: { user: null } } }));

vi.mock('@inertiajs/vue3', () => ({
    Head: {
        name: 'Head',
        template: '<div><slot /></div>',
    },
    Link: {
        name: 'Link',
        props: ['href'],
        template: '<a :href="href"><slot /></a>',
    },
    router: {
        get: routerGet,
        post: routerPost,
    },
    useForm,
    usePage,
}));

vi.mock('@/i18n', () => ({
    t: (key: string) => key,
}));

export const routeMock = vi.fn((name: string) => name);

(globalThis as any).route = routeMock;
config.global.config = { globalProperties: { route: routeMock } } as unknown as typeof config.global.config;

// @vue/test-utils defaults renderStubDefaultSlot to false; several existing shallowMount
// tests rely on nested slot content (e.g. CatalogLayout inside ShopLayout's default slot)
// actually rendering through an auto-stubbed parent.
config.global.renderStubDefaultSlot = true;
