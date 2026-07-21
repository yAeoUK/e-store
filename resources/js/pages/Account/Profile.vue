<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Profile</h1>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Name</label>
        <input v-model="form.name" type="text" class="mt-1 block w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium">Email</label>
        <input v-model="form.email" type="email" class="mt-1 block w-full" />
      </div>

      <div>
        <button type="submit" class="px-4 py-2 bg-gray-800 text-white rounded">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';

const props = defineProps({ user: Object });

const form = useForm({
  name: props.user?.name ?? '',
  email: props.user?.email ?? '',
});

function submit() {
  form.put(route('account.profile.update'));
}
</script>
