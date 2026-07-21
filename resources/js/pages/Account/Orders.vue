<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
  <AuthenticatedLayout>
    <Head title="Order History" />

    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        Order History
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow sm:rounded-lg p-6">
          <p class="text-sm text-gray-600">
            This page is a placeholder for the user's order history. Orders will be implemented later.
          </p>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
