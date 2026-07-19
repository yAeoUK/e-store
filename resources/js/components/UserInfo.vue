<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';

type Props = {
    user?: User | null;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    user: null,
    showEmail: false,
});

const { getInitials } = useInitials();

const displayName = computed(() => props.user?.name ?? 'User');
const displayEmail = computed(() => props.user?.email ?? '');

// Compute whether we should show the avatar image
const showAvatar = computed(() => Boolean(props.user?.avatar));
</script>

<template>
    <Avatar class="h-8 w-8 overflow-hidden rounded-lg">
        <AvatarImage v-if="showAvatar" :src="props.user?.avatar ?? ''" :alt="displayName" />
        <AvatarFallback class="rounded-lg text-black dark:text-white">
            {{ getInitials(displayName) }}
        </AvatarFallback>
    </Avatar>

    <div class="grid flex-1 text-left text-sm leading-tight">
        <span class="truncate font-medium">{{ displayName }}</span>
        <span v-if="showEmail" class="truncate text-xs text-muted-foreground">
            {{ displayEmail }}
        </span>
    </div>
</template>
