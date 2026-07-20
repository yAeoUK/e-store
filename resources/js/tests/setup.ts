import { vi } from 'vitest';

const routerGet = vi.fn();

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
    },
}));

vi.mock('@/i18n', () => ({
    t: (key: string) => key,
}));
