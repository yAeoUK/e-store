import '@inertiajs/core';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: {
                user: User | null;
            };
            sidebarOpen: boolean;
        };
    }
}
