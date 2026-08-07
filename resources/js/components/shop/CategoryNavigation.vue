<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { CatalogCategory } from '@/components/shop/catalog';
import SidebarNav from '@/components/SidebarNav.vue';
import type { SidebarNavItem } from '@/components/SidebarNav.vue';
import { t } from '@/i18n';
import { isCurrentPath } from '@/lib/navigation';

const props = defineProps<{
    categories?: CatalogCategory[];
}>();

const page = usePage();

function toItem(category: CatalogCategory): SidebarNavItem {
    const href = `/categories/${category.slug}`;

    return {
        key: category.id,
        label: category.name,
        href,
        badge: category.children?.length || undefined,
        active: isCurrentPath(page.url, href),
        children: category.children?.map((child) => {
            const childHref = `/categories/${child.slug}`;

            return {
                key: child.id,
                label: child.name,
                href: childHref,
                active: isCurrentPath(page.url, childHref),
            };
        }),
    };
}

const items = computed(() => (props.categories ?? []).map(toItem));
</script>

<template>
    <SidebarNav :title="t('common.categories')" :items="items" />
</template>
