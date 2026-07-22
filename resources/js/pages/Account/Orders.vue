<script setup>
import ShopLayout from '@/Layouts/ShopLayout.vue';
import Card from '@/components/Card.vue';
import MutedText from '@/components/MutedText.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
  <ShopLayout>
    <Head title="Order History" />

    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        Order History
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
        <Card class="overflow-hidden p-6">
          <MutedText>
            This page is a placeholder for the user's order history. Orders will be implemented later.
          </MutedText>
        </Card>
      </div>
    </div>
  </ShopLayout>
</template>
