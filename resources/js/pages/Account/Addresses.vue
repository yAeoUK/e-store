<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import Card from '@/components/Card.vue';
import Checkbox from '@/components/Checkbox.vue';
import InputError from '@/components/InputError.vue';
import MutedText from '@/components/MutedText.vue';
import TextInput from '@/components/TextInput.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';

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
  <ShopLayout>
    <Head :title="t('account.addresses.pageTitle')" />

    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        {{ t('account.addresses.pageTitle') }}
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div class="space-y-6">
          <Card class="overflow-hidden p-6">
            <div v-if="addresses.length === 0" class="mb-4 text-sm text-gray-500">
              {{ t('account.addresses.empty') }}
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
                    <MutedText>
                      {{ addr.line1 }} {{ addr.line2 }}
                    </MutedText>
                    <MutedText>
                      {{ addr.city }} {{ addr.postal_code }} {{ addr.state }}
                    </MutedText>
                  </div>
                  <div class="text-end">
                    <form
                      :action="route('account.addresses.destroy', addr.id)"
                      method="post"
                    >
                      <input type="hidden" name="_token" :value="csrfToken" />
                      <input type="hidden" name="_method" value="delete" />
                      <button class="text-sm text-red-600">{{ t('common.delete') }}</button>
                    </form>
                  </div>
                </div>
              </li>
            </ul>
          </Card>

          <Card class="overflow-hidden p-6">
            <h3 class="text-lg font-semibold mb-4">{{ t('account.addresses.addHeading') }}</h3>
            <form @submit.prevent="submit" class="space-y-4">
              <div>
                <TextInput v-model="form.label" :placeholder="t('account.addresses.labelPlaceholder')" />
                <InputError class="mt-2" :message="form.errors.label" />
              </div>
              <div>
                <TextInput v-model="form.name" :placeholder="t('account.addresses.namePlaceholder')" />
                <InputError class="mt-2" :message="form.errors.name" />
              </div>
              <div>
                <TextInput v-model="form.line1" :placeholder="t('account.addresses.line1Placeholder')" required />
                <InputError class="mt-2" :message="form.errors.line1" />
              </div>
              <div>
                <TextInput v-model="form.line2" :placeholder="t('account.addresses.line2Placeholder')" />
                <InputError class="mt-2" :message="form.errors.line2" />
              </div>
              <div class="grid gap-2 sm:grid-cols-3">
                <div>
                  <TextInput v-model="form.city" :placeholder="t('account.addresses.cityPlaceholder')" required />
                  <InputError class="mt-2" :message="form.errors.city" />
                </div>
                <div>
                  <TextInput v-model="form.state" :placeholder="t('account.addresses.statePlaceholder')" />
                  <InputError class="mt-2" :message="form.errors.state" />
                </div>
                <div>
                  <TextInput v-model="form.postal_code" :placeholder="t('account.addresses.postalCodePlaceholder')" required />
                  <InputError class="mt-2" :message="form.errors.postal_code" />
                </div>
              </div>
              <div>
                <TextInput v-model="form.country" :placeholder="t('account.addresses.countryPlaceholder')" required />
                <InputError class="mt-2" :message="form.errors.country" />
              </div>
              <div class="flex items-center gap-2">
                <Checkbox v-model:checked="form.is_default" />
                <span class="text-sm text-gray-700">{{ t('account.addresses.setDefault') }}</span>
              </div>
              <div>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700"
                  :disabled="form.processing"
                >
                  {{ t('account.addresses.submit') }}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  </ShopLayout>
</template>
