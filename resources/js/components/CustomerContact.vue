<script setup lang="ts">
defineProps<{
    user: { name: string; email: string } | null;
}>();
</script>

<template>
    <span v-if="user">{{ user.name }} ({{ user.email }})</span>
    <span v-else>—</span>
</template>
