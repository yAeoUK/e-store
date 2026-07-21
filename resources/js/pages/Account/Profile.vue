<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({
  user: Object,
});

const form = useForm({
  name: props.user?.name ?? '',
  email: props.user?.email ?? '',
});

function submit() {
  form.put(route('account.profile.update'));
}
</script>

<template>
  <AuthenticatedLayout>
    <Head title="Account Profile" />

    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        Account Profile
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow sm:rounded-lg">
          <div class="p-6">
            <form @submit.prevent="submit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700"
                  :disabled="form.processing"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
