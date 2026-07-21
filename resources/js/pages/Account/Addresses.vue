<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Saved Addresses</h1>

    <div v-if="addresses.length === 0" class="mb-4">No addresses yet.</div>

    <ul class="space-y-3 mb-6">
      <li v-for="addr in addresses" :key="addr.id" class="p-3 border rounded">
        <div class="flex justify-between">
          <div>
            <div class="font-medium">{{ addr.label || addr.name }}</div>
            <div class="text-sm">{{ addr.line1 }} {{ addr.line2 }}</div>
            <div class="text-sm">{{ addr.city }} {{ addr.postal_code }} {{ addr.state }}</div>
          </div>
          <div class="text-right">
            <form :action="route('account.addresses.destroy', addr.id)" method="post">
              <input type="hidden" name="_method" value="delete" />
              <button class="text-sm text-red-600">Delete</button>
            </form>
          </div>
        </div>
      </li>
    </ul>

    <h2 class="text-xl font-semibold mb-2">Add Address</h2>
    <form @submit.prevent="submit" class="space-y-2">
      <div>
        <input v-model="form.label" placeholder="Label (e.g., Home)" class="block w-full" />
      </div>
      <div>
        <input v-model="form.name" placeholder="Recipient name" class="block w-full" />
      </div>
      <div>
        <input v-model="form.line1" placeholder="Address line 1" required class="block w-full" />
      </div>
      <div>
        <input v-model="form.line2" placeholder="Address line 2" class="block w-full" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <input v-model="form.city" placeholder="City" required />
        <input v-model="form.state" placeholder="State" />
        <input v-model="form.postal_code" placeholder="Postal code" required />
      </div>
      <div>
        <input v-model="form.country" placeholder="Country" required />
      </div>
      <div>
        <label class="inline-flex items-center">
          <input type="checkbox" v-model="form.is_default" class="mr-2" /> Set as default
        </label>
      </div>
      <div>
        <button type="submit" class="px-4 py-2 bg-gray-800 text-white rounded">Add Address</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';

const props = defineProps({ addresses: Array });

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
