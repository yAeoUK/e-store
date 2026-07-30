<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import SidebarNav from '@/components/SidebarNav.vue';
import type { SidebarNavItem } from '@/components/SidebarNav.vue';
import { t } from '@/i18n';

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

const props = defineProps<{
    categories?: Category[];
}>();

const page = usePage();

// Exact-match (allowing a trailing path segment or query string) rather than
// a plain prefix match, since sibling category slugs can share a prefix
// (e.g. "shoes" and "shoes-kids").
function isCurrent(href: string): boolean {
    const url = typeof page.url === 'string' ? page.url : '';

    return url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);
}

function toItem(category: Category): SidebarNavItem {
    const href = `/categories/${category.slug}`;

    return {
        key: category.id,
        label: category.name,
        href,
        badge: category.children?.length || undefined,
        active: isCurrent(href),
        children: category.children?.map((child) => {
            const childHref = `/categories/${child.slug}`;

            return {
                key: child.id,
                label: child.name,
                href: childHref,
                active: isCurrent(childHref),
            };
        }),
    };
}

const items = computed(() => (props.categories ?? []).map(toItem));
</script>

<template>
    <SidebarNav :title="t('common.categories')" :items="items" />
</template>
