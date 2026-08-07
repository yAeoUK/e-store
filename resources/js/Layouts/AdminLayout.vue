<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    FolderTree,
    LayoutDashboard,
    Package,
    ShieldCheck,
    ShoppingCart,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import {
    compactHeadingClass,
    mutedLinkClass,
    pageBgClass,
} from '@/components/classNames';
import PageContainer from '@/components/PageContainer.vue';
import SidebarNav from '@/components/SidebarNav.vue';
import type { SidebarNavItem } from '@/components/SidebarNav.vue';
import { t } from '@/i18n';
import { isCurrentPath } from '@/lib/navigation';

const page = usePage();

const navItems = computed<SidebarNavItem[]>(() => {
    // Ziggy's route() returns an absolute URL by default, but Inertia's
    // page.url is relative — request a relative URL here so it can be
    // compared against page.url in isCurrentPath().
    const dashboardHref = route('admin.dashboard', undefined, false);
    const productsHref = route('admin.products.index', undefined, false);
    const categoriesHref = route('admin.categories.index', undefined, false);
    const usersHref = route('admin.users.index', undefined, false);
    const ordersHref = route('admin.orders.index', undefined, false);
    const adminsHref = route('admin.admins.index', undefined, false);

    return [
        {
            key: 'dashboard',
            label: t('admin.nav.dashboard'),
            href: dashboardHref,
            icon: LayoutDashboard,
            active: isCurrentPath(page.url, dashboardHref),
        },
        {
            key: 'products',
            label: t('admin.nav.products'),
            href: productsHref,
            icon: Package,
            active: isCurrentPath(page.url, productsHref),
        },
        {
            key: 'categories',
            label: t('admin.nav.categories'),
            href: categoriesHref,
            icon: FolderTree,
            active: isCurrentPath(page.url, categoriesHref),
        },
        {
            key: 'users',
            label: t('admin.nav.users'),
            href: usersHref,
            icon: Users,
            active: isCurrentPath(page.url, usersHref),
        },
        {
            key: 'orders',
            label: t('admin.nav.orders'),
            href: ordersHref,
            icon: ShoppingCart,
            active: isCurrentPath(page.url, ordersHref),
        },
        {
            key: 'admins',
            label: t('admin.nav.admins'),
            href: adminsHref,
            icon: ShieldCheck,
            active: isCurrentPath(page.url, adminsHref),
        },
    ];
});
</script>

<template>
    <div :class="['min-h-screen', pageBgClass]">
        <AppHeader :logo-href="route('admin.dashboard')">
            <template #logo-suffix>
                <span :class="compactHeadingClass">
                    {{ t('admin.dashboard.pageTitle') }}
                </span>
            </template>
            <template #actions>
                <Link
                    :href="route('home')"
                    :class="[mutedLinkClass, 'text-sm']"
                >
                    {{ t('admin.nav.backToShop') }}
                </Link>
            </template>
        </AppHeader>

        <PageContainer>
            <div class="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div>
                    <SidebarNav :items="navItems" />
                </div>

                <div class="space-y-6">
                    <div v-if="$slots.header">
                        <slot name="header" />
                    </div>

                    <slot />
                </div>
            </div>
        </PageContainer>
    </div>
</template>
