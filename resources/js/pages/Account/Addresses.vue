<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({ addresses: Array });

const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

const form = useForm({
  label: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US',
  phone: '',
  is_default: false,
});

function submit() {
  form.post(route('account.addresses.store'));
}
</script>

<template>
  <AuthenticatedLayout>
    <Head title="Saved Addresses" />

    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        Saved Addresses
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div class="space-y-6">
          <div class="overflow-hidden bg-white shadow sm:rounded-lg p-6">
            <div v-if="addresses.length === 0" class="mb-4 text-sm text-gray-500">
              No addresses yet.
            </div>

            <ul class="space-y-3 mb-6">
              <li
                v-for="addr in addresses"
                :key="addr.id"
                class="rounded border p-4"
              >
                <div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div>
                    <div class="font-medium">{{ addr.label || addr.name }}</div>
                    <div class="text-sm text-gray-600">
                      {{ addr.line1 }} {{ addr.line2 }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ addr.city }} {{ addr.postal_code }} {{ addr.state }}
                    </div>
                  </div>
                  <div class="text-right">
                    <form
                      :action="route('account.addresses.destroy', addr.id)"
                      method="post"
                    >
                      <input type="hidden" name="_token" :value="csrfToken" />
                      <input type="hidden" name="_method" value="delete" />
                      <button class="text-sm text-red-600">Delete</button>
                    </form>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="overflow-hidden bg-white shadow sm:rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Add Address</h3>
            <form @submit.prevent="submit" class="space-y-4">
              <div>
                <input
                  v-model="form.label"
                  placeholder="Label (e.g., Home)"
                  class="block w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  v-model="form.name"
                  placeholder="Recipient name"
                  class="block w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  v-model="form.line1"
                  placeholder="Address line 1"
                  required
                  class="block w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  v-model="form.line2"
                  placeholder="Address line 2"
                  class="block w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div class="grid gap-2 sm:grid-cols-3">
                <input
                  v-model="form.city"
                  placeholder="City"
                  required
                  class="rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  v-model="form.state"
                  placeholder="State"
                  class="rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  v-model="form.postal_code"
                  placeholder="Postal code"
                  required
                  class="rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  v-model="form.country"
                  placeholder="Country"
                  required
                  class="block w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="form.is_default"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700">Set as default</span>
              </div>
              <div>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700"
                  :disabled="form.processing"
                >
                  Add Address
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
