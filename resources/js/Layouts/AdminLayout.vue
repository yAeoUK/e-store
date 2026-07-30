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
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import {
    compactHeadingClass,
    headerRowClass,
    mutedBorderClass,
    mutedLinkClass,
    pageBgClass,
    surfaceBgClass,
} from '@/components/classNames';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import PageContainer from '@/components/PageContainer.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';
import SidebarNav from '@/components/SidebarNav.vue';
import type { SidebarNavItem } from '@/components/SidebarNav.vue';
import { t } from '@/i18n';

const page = usePage();

// Matches by URL prefix so a sub-route (e.g. /admin/products/5/edit) still
// highlights its parent nav item, without depending on Ziggy's route().current().
// Requires a boundary (end of string, '/', or '?') after the href so a
// sibling section whose name prefixes another (e.g. "admins" vs "admin")
// can't falsely match.
function isCurrentSection(href: string): boolean {
    const url = typeof page.url === 'string' ? page.url : '';

    return (
        url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`)
    );
}

const navItems = computed<SidebarNavItem[]>(() => {
    // Ziggy's route() returns an absolute URL by default, but Inertia's
    // page.url is relative — request a relative URL here so it can be
    // compared against page.url in isCurrentSection().
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
            active: isCurrentSection(dashboardHref),
        },
        {
            key: 'products',
            label: t('admin.nav.products'),
            href: productsHref,
            icon: Package,
            active: isCurrentSection(productsHref),
        },
        {
            key: 'categories',
            label: t('admin.nav.categories'),
            href: categoriesHref,
            icon: FolderTree,
            active: isCurrentSection(categoriesHref),
        },
        {
            key: 'users',
            label: t('admin.nav.users'),
            href: usersHref,
            icon: Users,
            active: isCurrentSection(usersHref),
        },
        {
            key: 'orders',
            label: t('admin.nav.orders'),
            href: ordersHref,
            icon: ShoppingCart,
            active: isCurrentSection(ordersHref),
        },
        {
            key: 'admins',
            label: t('admin.nav.admins'),
            href: adminsHref,
            icon: ShieldCheck,
            active: isCurrentSection(adminsHref),
        },
    ];
});
</script>

<template>
    <div :class="['min-h-screen', pageBgClass]">
        <header :class="[mutedBorderClass, 'border-b', surfaceBgClass]">
            <div :class="headerRowClass">
                <Link
                    :href="route('admin.dashboard')"
                    class="flex items-center gap-2"
                >
                    <ApplicationLogo class="h-8 w-auto" />
                    <span :class="compactHeadingClass">
                        {{ t('admin.dashboard.pageTitle') }}
                    </span>
                </Link>

                <div class="flex items-center gap-4">
                    <Link
                        :href="route('home')"
                        :class="[mutedLinkClass, 'text-sm']"
                    >
                        {{ t('admin.nav.backToShop') }}
                    </Link>
                    <LanguageSwitcher />
                    <ShopAuthBanner />
                </div>
            </div>
        </header>

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
