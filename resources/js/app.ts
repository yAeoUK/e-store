import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import type { DefineComponent } from 'vue';
import { ZiggyVue } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function resolve(name: string): Promise<DefineComponent> {
    return resolvePageComponent<{ default: DefineComponent }>(
        `./pages/${name}.vue`,
        import.meta.glob<{ default: DefineComponent }>('./pages/**/*.vue'),
    ).then((module) => module.default);
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve,
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
