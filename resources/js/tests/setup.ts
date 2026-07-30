import { config } from '@vue/test-utils';
import { beforeEach, vi } from 'vitest';
import { reactive } from 'vue';

const routerGet = vi.fn();
const routerPost = vi.fn();
const routerDelete = vi.fn();

type FormOptions = {
    onFinish?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    forceFormData?: boolean;
    onProgress?: (event: { percentage?: number }) => void;
};
type MockForm = Record<string, unknown> & {
    errors: Record<string, string>;
    processing: boolean;
    lastPostUrl?: string;
    lastPostOptions?: FormOptions;
};

// Forms are recorded in useForm() call order for the currently-mounted
// component; reset before every test so stale instances from a previous
// test/mount never leak into getMockForm()'s indexing.
let mockForms: MockForm[] = [];

beforeEach(() => {
    mockForms = [];
});

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
            (form as unknown as MockForm).lastPostUrl = _url;
            (form as unknown as MockForm).lastPostOptions = options;
            options.onSuccess?.();
            options.onFinish?.();
        },
        patch(_url: string, options: FormOptions = {}) {
            (form as unknown as MockForm).lastPostUrl = _url;
            (form as unknown as MockForm).lastPostOptions = options;
            options.onSuccess?.();
            options.onFinish?.();
        },
        put(_url: string, options: FormOptions = {}) {
            (form as unknown as MockForm).lastPostUrl = _url;
            (form as unknown as MockForm).lastPostOptions = options;
            options.onSuccess?.();
            options.onFinish?.();
        },
        delete(_url: string, options: FormOptions = {}) {
            (form as unknown as MockForm).lastPostUrl = _url;
            (form as unknown as MockForm).lastPostOptions = options;
            options.onSuccess?.();
            options.onFinish?.();
        },
        get(_url: string, options: FormOptions = {}) {
            options.onFinish?.();
        },
        clearErrors() {
            (form as unknown as MockForm).errors = {};
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

    mockForms.push(form as MockForm);

    return form;
}

// Grabs a mock useForm() instance (in creation order) so tests can seed
// form.errors after mounting and assert that validation errors render.
// Defaults to the first form created, matching every existing page under
// test that only calls useForm() once.
export function getMockForm<T = MockForm>(index = 0): T {
    if (!mockForms[index]) {
        throw new Error(
            'getMockForm() called before any component called useForm() that many times.',
        );
    }

    return mockForms[index] as unknown as T;
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
        delete: routerDelete,
    },
    useForm,
    usePage,
}));

vi.mock('@/i18n', () => ({
    t: (key: string) => key,
}));

// Params kept (though unused) so calls with route()'s full (name, params,
// absolute) arity type-check against this mock.
export const routeMock = vi.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (name: string, _params?: unknown, _absolute?: boolean) => name,
);

(globalThis as any).route = routeMock;
config.global.config = {
    globalProperties: { route: routeMock },
} as unknown as typeof config.global.config;

// @vue/test-utils defaults renderStubDefaultSlot to false; several existing shallowMount
// tests rely on nested slot content (e.g. CatalogLayout inside ShopLayout's default slot)
// actually rendering through an auto-stubbed parent.
config.global.renderStubDefaultSlot = true;
